import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Link, useParams } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import { Country, State } from "country-state-city";
import userApiProvider from "../apiProvider/userApi";
import chapterApiProvider from "../apiProvider/chapterApi";
import Swal from "sweetalert2";
import { hasPermission } from "../utils/auth";
import Select from "react-select";
import { Tag, Tooltip } from "antd";
import debounce from "lodash.debounce";
import { toast, ToastContainer } from 'react-toastify';
import apiClient, { IMAGE_BASE_URL } from '../network/apiClient';
import roleApiProvider from '../apiProvider/roleApi';
import ManageZoneLayer from "./ManageZoneLayer";

const ChapterAccessLayer = () => {
  const { zoneId } = useParams();
  // Zone Modal State
  const [zoneFormData, setZoneFormData] = useState({
    countryName: "",
    stateName: "",
    zoneName: "",
    dob: "",
    // zoneHead: []
  });

  // Chapter Modal State
  const [chapterFormData, setChapterFormData] = useState({
    chapterName: "",
    countryName: "",
    stateName: "",
    zoneId: zoneId || "",
    mentorId: [],
    meetingVenue: "",
    chapterCreatedDate: "",
    meetingDayAndTime: "",
    meetingType: "In Person",
    weekday: ""
  });

  // Selected Chapter for Edit
  const [selectedChapter, setSelectedChapter] = useState(null);

  // Data Options
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [zones, setZones] = useState([]);
  const [cids, setCids] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [chapters, setChapters] = useState([]);
  const [options, setOptions] = useState([
    { value: "Chennai", label: "Chennai" },
  ]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [errors, setErrors] = useState({});
  const [chaptererror, setChapterError] = useState({});

  // User Modal State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userRoleToCreate, setUserRoleToCreate] = useState("");
  const [userRoleOptions, setUserRoleOptions] = useState([]);
  const [selectedChapterForQR, setSelectedChapterForQR] = useState(null);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const qrRef = useRef();
  const [selectedUserImage, setSelectedUserImage] = useState(null);
  const [userImagePreview, setUserImagePreview] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: "", companyName: "", mobileNumber: "", email: "", username: "", pin: "", role: ""
  });
  const [userFormErrors, setUserFormErrors] = useState({});

  const fetchCountries = () => {
    const countryData = Country.getAllCountries().map((country) => ({
      value: country.isoCode,
      label: country.name,
    }));
    setCountries(countryData);
  };

  const fetchStates = (countryCode) => {
    const stateData = State.getStatesOfCountry(countryCode).map((state) => ({
      value: state.isoCode,
      label: state.name,
    }));
    setStates(stateData);
  };

  const fetchZones = async () => {
    const response = await chapterApiProvider.getZones({ limit: 1000 });
    if (response && response.status) {
      const zoneOptions = response.response.data.map((zone) => ({
        value: zone._id,
        label: zone.zoneName,
        countryName: zone.countryName,
        stateName: zone.stateName
      }));
      setZones(zoneOptions);
    }
  };



  const fetchRoles = async () => {
    try {
      const response = await roleApiProvider.getRoles();
      if (response && response.status) {
        setUserRoleOptions(response.response.data);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchMentors = async (zoneIdParam = zoneId) => {
    const params = { role: "MENTOR" };
    if (zoneIdParam) {
      params.zoneId = zoneIdParam;
    }
    const response = await userApiProvider.getUsersByRole(params);
    if (response && response.status) {
      const mentorOptions = response.response.data.map((user) => ({
        value: user._id,
        label: user.name,
      }));
      setMentors(mentorOptions);
    } else {
      setMentors([]);
    }
  };

  const fetchChapters = React.useCallback(async (search = "") => {
    try {
      let response;
      if (zoneId) {
        response = await chapterApiProvider.getChaptersByZone(zoneId);
      } else {
        response = await chapterApiProvider.getAllChapters({ search });
      }

      if (response && response.status) {
        let data = response.response.data || [];
        if (zoneId && search) {
          data = data.filter((chapter) =>
            chapter.chapterName?.toLowerCase().includes(search.toLowerCase())
          );
        }
        setChapters(data);
      }
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  }, [zoneId]);

  const debouncedFetchChapters = React.useCallback(
    debounce((query) => {
      fetchChapters(query);
    }, 500),
    [fetchChapters]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedFetchChapters(value);
  };

  // Fetch initial data
  useEffect(() => {
    fetchCountries();
    fetchChapters();
    fetchRoles();
    fetchZones();
    fetchMentors();
  }, [fetchChapters]);

  // Sync zoneId with chapterFormData
  useEffect(() => {
    if (zoneId && zones.length > 0) {
      const selectedZone = zones.find((z) => z.value === zoneId);
      if (selectedZone) {
        setChapterFormData((prev) => ({
          ...prev,
          zoneId: zoneId,
          countryName: selectedZone.countryName,
          stateName: selectedZone.stateName,
        }));
      }
    }
  }, [zoneId, zones]);

  // Zone Form Handlers
  const handleZoneCountryChange = (e) => {
    const countryName = e.target.value;
    setZoneFormData({ ...zoneFormData, countryName, stateName: "" });
    fetchStates(countryName);
  };

  const handleZoneStateChange = (e) => {
    const stateName = e.target.value;
    setZoneFormData({ ...zoneFormData, stateName });
  };

  const handleZoneInputChange = (e) => {
    const { name, value } = e.target;
    setZoneFormData({ ...zoneFormData, [name]: value });
  };

  const handleZoneSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    console.log("chapterFormData before submit: ", chapterFormData);

    if (!zoneFormData.zoneName || zoneFormData.zoneName.trim() === "") {
      newErrors.zoneName = "Zone name is required";
    }

    if (!zoneFormData.countryName) {
      newErrors.countryName = "Country is required";
    }

    if (!zoneFormData.stateName) {
      newErrors.stateName = "State is required";
    }

    if (!zoneFormData.dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const dobDate = new Date(zoneFormData.dob);
      const today = new Date();
      if (dobDate > today) {
        newErrors.dob = "Date cannot be in the future";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      console.log("Validation errors: ", newErrors);
      setErrors(newErrors);
      return;
    }

    try {
      const response = await chapterApiProvider.createZone(zoneFormData);

      if (response && response.status) {
        Swal.fire({
          title: "Success!",
          text: "Zone created successfully",
          icon: "success",
          customClass: {
            popup: "small-swal-popup",
            title: "small-swal-title",
            htmlContainer: "small-swal-text",
          },
          width: "400px",
        });
        document.getElementById("closeZoneModal").click();
        setZoneFormData({
          countryName: "",
          stateName: "",
          zoneName: "",
          dob: "",
        });
        setErrors({});
      } else {
        throw new Error(response?.response?.message || "Failed to create zone");
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to create zone",
        icon: "error",
        customClass: {
          popup: "small-swal-popup",
          title: "small-swal-title",
          htmlContainer: "small-swal-text",
        },
        width: "400px",
      });
    }
  };

  // User Modal Handlers
  const handleUserImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedUserImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUserInputChange = (e) => {
    const { id, value } = e.target;
    if (id === 'pin' && !/^\d{0,4}$/.test(value)) return;
    setUserFormData(prev => ({ ...prev, [id]: value }));
  };

  const openUserModal = (roleName) => {
    const matchingRole = userRoleOptions.find(r => r.name.toLowerCase() === roleName.toLowerCase());
    setUserFormData({ name: "", companyName: "", mobileNumber: "", email: "", username: "", pin: "", role: matchingRole?._id || "" });
    setSelectedUserImage(null);
    setUserImagePreview("");
    setUserRoleToCreate(roleName);
    setUserFormErrors({});
    setIsUserModalOpen(true);
    // Use Bootstrap modal instance or trigger click on a hidden button to show modal
    setTimeout(() => {
        const btn = document.getElementById("hiddenOpenUserModalBtn");
        if(btn) btn.click();
    }, 100);
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!userFormData.name?.trim()) errors.name = "Please enter name";
    else if (!/^[a-zA-Z\s]+$/.test(userFormData.name)) errors.name = "Name should contain only alphabets";

    if (!userFormData.companyName?.trim()) errors.companyName = "Please enter company name";
    if (!userFormData.mobileNumber?.trim()) errors.mobileNumber = "Please enter mobile number";
    else if (!/^[0-9]{10}$/.test(userFormData.mobileNumber)) errors.mobileNumber = "Mobile number must be 10 digits";

    if (!userFormData.email?.trim()) errors.email = "Please enter email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userFormData.email)) errors.email = "Please enter a valid email";

    if (!userFormData.username?.trim()) errors.username = "Please enter username";
    else if (userFormData.username.length < 4) errors.username = "Username must be at least 4 characters";

    if (!userFormData.pin?.trim()) errors.pin = "Please enter PIN";
    else if (!/^[0-9]{4}$/.test(userFormData.pin)) errors.pin = "PIN must be exactly 4 digits";

    if (!userFormData.role) errors.role = "Role mapping failed. Ensure role exists.";

    if (Object.keys(errors).length > 0) {
      setUserFormErrors(errors);
      return;
    }

    setIsSubmittingUser(true);
    const formDataToSend = new FormData();
    formDataToSend.append('name', userFormData.name);
    formDataToSend.append('companyName', userFormData.companyName);
    formDataToSend.append('email', userFormData.email);
    formDataToSend.append('username', userFormData.username);
    formDataToSend.append('pin', userFormData.pin);
    formDataToSend.append('mobileNumber', userFormData.mobileNumber);
    formDataToSend.append('role', userFormData.role);
    if (zoneId) {
      formDataToSend.append('zoneId', zoneId);
    }
    if (selectedUserImage) formDataToSend.append('profileImage', selectedUserImage);

    try {
      const response = await userApiProvider.addUsers(formDataToSend);
      if (response && response.status) {
        Swal.fire({
          title: 'Success!',
          text: 'User created successfully.',
          icon: 'success',
          customClass: { popup: 'small-swal-popup', title: 'small-swal-title', htmlContainer: 'small-swal-text' },
          width: '400px'
        });
        document.getElementById("closeUserModal")?.click();
      } else {
        toast.error(response?.response || "Failed to create user");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "An error occurred while creating user");
    } finally {
      setIsSubmittingUser(false);
    }
  };

  // Chapter Form Handlers
  const handleChapterCountryChange = (e) => {
    const countryName = e.target.value;
    setChapterFormData({
      ...chapterFormData,
      countryName,
      stateName: "",
      zoneId: "",
    });
    fetchStates(countryName);
  };

  const handleChapterStateChange = (e) => {
    const stateName = e.target.value;
    setChapterFormData({ ...chapterFormData, stateName, zoneId: "" });
  };

  const handleChapterZoneChange = (e) => {
    const selectedZoneId = e.target.value;
    const selectedZone = zones.find(z => z.value === selectedZoneId);
    setChapterFormData({ 
      ...chapterFormData, 
      zoneId: selectedZoneId,
      countryName: selectedZone ? selectedZone.countryName : "",
      stateName: selectedZone ? selectedZone.stateName : "",
      mentorId: [] // Reset mentor on zone change
    });
    fetchMentors(selectedZoneId);
  };

  const handleChapterInputChange = (e) => {
    setChapterError({});
    const { name, value } = e.target;
    setChapterFormData({ ...chapterFormData, [name]: value });
  };

  function getTodayWeekday() {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return days[new Date().getDay()];
}

  const downloadQRCode = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${selectedChapterForQR?.chapterName?.toLowerCase().replace(/\s+/g, '')}-qr.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handleRegenerateQR = () => {
    Swal.fire({
      title: "Regenerate QR Code?",
      text: "Are you sure you want to regenerate the QR code image?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, regenerate it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "small-swal-popup",
        title: "small-swal-title",
        htmlContainer: "small-swal-text",
        confirmButton: "small-swal-confirm-btn",
        cancelButton: "small-swal-cancel-btn",
      },
      width: "400px",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsGeneratingQR(true);
        setTimeout(() => {
          setIsGeneratingQR(false);
          Swal.fire({
            title: "Regenerated!",
            text: "The QR Code has been successfully regenerated.",
            icon: "success",
            width: "400px",
            customClass: {
              popup: "small-swal-popup",
              title: "small-swal-title",
              htmlContainer: "small-swal-text",
            },
          });
        }, 1000);
      }
    });
  };

  const handleChapterSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    let submitZoneId = chapterFormData.zoneId || zoneId;
    let finalCountryName = chapterFormData.countryName;
    let finalStateName = chapterFormData.stateName;

    if (submitZoneId && zones.length > 0) {
      const selectedZone = zones.find(z => z.value === submitZoneId);
      if (selectedZone) {
        finalCountryName = selectedZone.countryName;
        finalStateName = selectedZone.stateName;
      }
    }

    if (submitZoneId && (!finalCountryName || !finalStateName)) {
      try {
        const zoneRes = await apiClient.get(`/zones/${submitZoneId}`);
        if (zoneRes.status === 200 && zoneRes.data && zoneRes.data.data) {
           finalCountryName = zoneRes.data.data.countryName;
           finalStateName = zoneRes.data.data.stateName;
        }
      } catch (err) {
         console.error("Failed to fetch zone details fallback:", err);
      }
    }

    const payload = {
      ...chapterFormData,
      zoneId: submitZoneId,
      countryName: finalCountryName,
      stateName: finalStateName,
    };

    // Auto-calculate weekday from chapterCreatedDate
    if (payload.chapterCreatedDate) {
      const selectedDate = new Date(payload.chapterCreatedDate);
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      payload.weekday = days[selectedDate.getDay()];
    } else if (payload.weekday === "") {
      delete payload.weekday;
    }

    if (payload.meetingDayAndTime === "") {
      delete payload.meetingDayAndTime;
    }

    if (!payload.chapterName || payload.chapterName.trim() === "") {
      newErrors.chapterName = "Chapter name is required";
    }

    if (!payload.countryName) {
      newErrors.countryName = "Country is required";
    }

    if (!payload.stateName) {
      newErrors.stateName = "State is required";
    }

    if (!payload.zoneId) {
      newErrors.zoneId = "Zone is required";
    }

    if (!payload.mentorId || payload.mentorId.length === 0) {
      newErrors.mentorId = "Mentor is required";
    }

    if (!payload.meetingVenue || payload.meetingVenue.trim() === "") {
      newErrors.meetingVenue = "Meeting venue is required";
    }

    if (!payload.chapterCreatedDate) {
      newErrors.chapterCreatedDate = "Chapter created date is required";
    } else {
      const createdDate = new Date(payload.chapterCreatedDate);
      const today = new Date();
      if (createdDate > today) {
        newErrors.chapterCreatedDate = "Date cannot be in the future";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      console.log("Validation errors: ", newErrors);
      setChapterError(newErrors);
      
      const firstError = Object.values(newErrors)[0];
      Swal.fire({
        toast: true,
        position: "top-end",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        icon: "error",
        title: firstError,
        customClass: {
          popup: "small-swal-popup",
          title: "small-swal-title",
          htmlContainer: "small-swal-text",
        },
      });
      return;
    }

    try {
      const response = await chapterApiProvider.createChapter(payload);
      if (response && response.status) {
        Swal.fire({
          title: "Success!",
          text: "Chapter created successfully",
          icon: "success",
          customClass: {
            popup: "small-swal-popup",
            title: "small-swal-title",
            htmlContainer: "small-swal-text",
          },
          width: "400px",
        });
        document.getElementById("closeChapterModal").click();
        setChapterFormData({
          chapterName: "",
          countryName: zoneId ? chapterFormData.countryName : "",
          stateName: zoneId ? chapterFormData.stateName : "",
          zoneId: zoneId || "",
          mentorId: [],
          meetingVenue: "",
          chapterCreatedDate: "",
          meetingDayAndTime: "",
          meetingType: "In Person",
        });
        fetchChapters();
      } else {
        const errorMessage = response.response?.message || "Failed to create chapter";
        Swal.fire({
          toast: true,
          position: "top-end",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          icon: "error",
          title: errorMessage,
          customClass: {
            popup: "small-swal-popup",
            title: "small-swal-title",
            htmlContainer: "small-swal-text",
          },
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to create chapter";
      Swal.fire({
        toast: true,
        position: "top-end",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        icon: "error",
        title: errorMessage,
        customClass: {
          popup: "small-swal-popup",
          title: "small-swal-title",
        },
      });
    }
  };

  function formatDayName(dateString) {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = new Date(dateString);
    return days[date.getDay()];
  }
  return (
    <>
      <div className="card-header mb-3 border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <form className="navbar-search">
            <input
              type="text"
              className="bg-base h-40-px w-auto"
              name="search"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Icon icon="ion:search-outline" className="icon" />
          </form>
        </div>

        <div className="d-flex align-items-center flex-wrap gap-1">
          {zoneId && (
            <button
              type="button"
              className="btn btn-info grip text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2 text-white"
              style={{ backgroundColor: "#707784", borderColor: "#707784" }}
              data-bs-toggle="modal"
              data-bs-target="#manageZoneModal"
            >
              <Icon
                icon="mdi:account-cog-outline"
                className="icon text-xl line-height-1"
              />
              Manage Zone
            </button>
          )}
          {hasPermission("chapters-create") && zoneId && (
            <button
              type="button"
              className="btn btn-primary grip text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              <Icon
                icon="ic:baseline-plus"
                className="icon text-xl line-height-1"
              />
              Add New
            </button>
          )}
        </div>
      </div>

      <div className="card h-100 p-0 radius-12">
        <div className="card-body p-24">
          <div className="row gy-4">
            {chapters.filter((chapter) => chapter.isActive === 1).length === 0 ? (
              <div className="col-12 text-center py-5">
                <div className="text-muted fs-5 fw-semibold py-24">
                  {zoneId ? "No active chapters found under this zone." : "No active chapters found."}
                </div>
              </div>
            ) : (
              chapters.filter((chapter) => chapter.isActive === 1).map((chapter) => (
                <div
                  className="col-12 col-xxl-4 col-lg-4 col-sm-6 mb-0"
                  key={chapter._id}
                >
                  <div className="folded">
                    <h2>{chapter.chapterName}</h2>
                  </div>

                  <div
                    className="kanban-card bg-neutral-50 p-3 radius-8"
                    style={{ userSelect: "none", background: "#fff" }}
                  >
                    <table style={{ borderCollapse: "collapse", width: "100%" }}>
                      <tbody>
                        <tr>
                          <td style={{ padding: "8px 0" }}>
                            <strong>Chapter day:</strong>
                          </td>
                          <td style={{ padding: "8px 0" }}>
                            {/* {formatDayName(chapter.meetingDayAndTime)} */}
                            {chapter.weekday}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: "8px 0" }}>
                            <strong>Zone:</strong>
                          </td>
                          <td style={{ padding: "8px 0" }}>
                            {chapter.zoneId?.zoneName || "N/A"}
                          </td>
                        </tr>

                        <tr>
                          <td style={{ padding: "8px 0" }}>
                            <strong>Mentor:</strong>
                          </td>
                          <td style={{ padding: "8px 0" }}>
                            {chapter.mentorId?.length > 0 ? (
                              <>
                                <Tag color="#c02222">{chapter.mentorId[0]?.name}</Tag>
                                {chapter.mentorId.length > 1 && (
                                  <Tooltip
                                    title={chapter.mentorId
                                      .slice(1)
                                      .map((m) => m.name)
                                      .join(", ")}
                                  >
                                    <Tag color="#c02222">+{chapter.mentorId.length - 1}</Tag>
                                  </Tooltip>
                                )}
                              </>
                            ) : (
                              "N/A"
                            )}
                          </td>
                        </tr>


                        <tr>
                          <td style={{ padding: "8px 0" }}>
                            <strong>Location:</strong>
                          </td>
                          <td style={{ padding: "8px 0" }}>
                            {chapter.meetingVenue}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="d-flex align-items-center justify-content-between pt-3">
                      <span className="start-date text-secondary-light">
                        Status:{" "}
                        <span
                          className={
                            chapter.isActive == 1
                              ? "text-success-600"
                              : "text-danger-600"
                          }
                        >
                          {chapter.isActive == 1 ? "Active" : "Inactive"}
                        </span>
                      </span>

                      <div className="d-flex align-items-center gap-2">
                        {hasPermission("chapters-list") && (
                          <button
                            type="button"
                            className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                          >
                            <Link
                              to={`/chapter-view/${chapter._id}`}
                              className="text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                            >
                              <Icon
                                icon="majesticons:eye"
                                className="icon text-xl"
                              />
                            </Link>
                          </button>
                        )}

                        {hasPermission("chapters-update") && (
                          <button
                            type="button"
                            className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModalOne"
                            onClick={() => setSelectedChapter(chapter)}
                          >
                            <Icon icon="lucide:edit" className="menu-icon" />
                          </button>
                        )}
                        <button
                          type="button"
                          className="bg-info-focus text-info-600 bg-hover-info-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                          data-bs-toggle="modal"
                          data-bs-target="#qrModal"
                          onClick={() => setSelectedChapterForQR(chapter)}
                          title="View QR Code"
                        >
                          <Icon icon="lucide:qr-code" className="menu-icon" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Zone Modal */}
      <div
        className="modal fade"
        id="exampleModalTwo"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-m modal-dialog modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Add New Zone
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeZoneModal"
              />
            </div>
            <div className="modal-body p-24">
              <form onSubmit={handleZoneSubmit}>
                <div className="row">
                  {/* Zone Name */}
                  <div className="col-12 mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Zone Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.zoneName ? "is-invalid" : ""}`}
                      value={zoneFormData.zoneName}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^[A-Za-z\s]+$/.test(value)) {
                          setZoneFormData(prev => ({ ...prev, zoneName: value }));
                          if (errors.zoneName) {
                            setErrors(prev => ({ ...prev, zoneName: "" }));
                          }
                        } else {
                          setErrors(prev => ({ ...prev, zoneName: "Only alphabets and spaces are allowed" }));
                        }
                      }}
                      placeholder="Enter Zone Name"
                    />
                    {errors.zoneName && (
                      <div className="text-danger mt-1">{errors.zoneName}</div>
                    )}
                  </div>

                  {/* Country */}
                  <div className="col-12 mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Country <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-control form-select ${errors.countryName ? "is-invalid" : ""
                        }`}
                      value={zoneFormData.countryName}
                      onChange={(e) => {
                        handleZoneCountryChange(e);
                        if (errors.countryName) {
                          setErrors((prev) => ({ ...prev, countryName: "" }));
                        }
                      }}
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country.value} value={country.value}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                    {errors.countryName && (
                      <div className="text-danger mt-1">
                        {errors.countryName}
                      </div>
                    )}
                  </div>

                  {/* State */}
                  <div className="col-12 mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      State <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-control form-select ${errors.stateName ? "is-invalid" : ""
                        }`}
                      value={zoneFormData.stateName}
                      onChange={(e) => {
                        handleZoneStateChange(e);
                        if (errors.stateName) {
                          setErrors((prev) => ({ ...prev, stateName: "" }));
                        }
                      }}
                      disabled={!zoneFormData.countryName}
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state.value} value={state.value}>
                          {state.label}
                        </option>
                      ))}
                    </select>
                    {errors.stateName && (
                      <div className="text-danger mt-1">{errors.stateName}</div>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div className="col-12 mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Date of Birth <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className={`form-control ${errors.dob ? "is-invalid" : ""
                        }`}
                      name="dob"
                      value={zoneFormData.dob}
                      onChange={(e) => {
                        handleZoneInputChange(e);
                        if (errors.dob) {
                          setErrors((prev) => ({ ...prev, dob: "" }));
                        }
                      }}
                    />
                    {errors.dob && (
                      <div className="text-danger mt-1">{errors.dob}</div>
                    )}
                  </div>

                  <div className="d-flex align-items-center gap-3 mt-24">
                    <button
                      type="reset"
                      className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-40 py-11 radius-8"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary grip border border-primary-600 text-md px-48 py-12 radius-8"
                      disabled={Object.keys(errors).some((key) => errors[key])}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Add Chapter Modal */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Add New Chapter
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeChapterModal"
              />
            </div>
            <div className="modal-body p-24">
              <form onSubmit={handleChapterSubmit}>
                <div className="row">
                  {/* Chapter Name */}
                  <div className="col-md-6 mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Chapter Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control radius-8 ${chaptererror.chapterName ? "is-invalid" : ""}`}
                      name="chapterName"
                      value={chapterFormData.chapterName}
                      onChange={handleChapterInputChange}
                    />
                    {chaptererror.chapterName && (
                      <div className="text-danger mt-1">{chaptererror.chapterName}</div>
                    )}
                  </div>

                  {/* Zone (Only shown if no zoneId in URL) */}
                  {!zoneId && (
                    <div className="col-md-6 mb-20">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Zone <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`form-control form-select ${chaptererror.zoneId ? "is-invalid" : ""}`}
                        name="zoneId"
                        value={chapterFormData.zoneId}
                        onChange={handleChapterZoneChange}
                      >
                        <option value="">Select Zone</option>
                        {zones.map((zone) => (
                          <option key={zone.value} value={zone.value}>
                            {zone.label}
                          </option>
                        ))}
                      </select>
                      {chaptererror.zoneId && (
                        <div className="text-danger mt-1">{chaptererror.zoneId}</div>
                      )}
                    </div>
                  )}

                  {/* Chapter Mentors */}
                  <div className="col-md-6 mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Chapter Mentors <span className="text-danger">*</span>
                    </label>
                    <Select
                      isMulti
                      className={`react-select-container ${chaptererror.mentorId ? "is-invalid" : ""}`}
                      classNamePrefix="react-select"
                      options={mentors}
                      value={mentors.filter((mentor) =>
                        chapterFormData.mentorId?.includes(mentor.value)
                      )}
                      onChange={(selectedOptions) => {
                        const selectedValues = selectedOptions ? selectedOptions.map((option) => option.value) : [];
                        setChapterFormData((prev) => ({
                          ...prev,
                          mentorId: selectedValues,
                        }));
                        if (chaptererror.mentorId) {
                          setChapterError((prev) => ({ ...prev, mentorId: "" }));
                        }
                      }}
                      placeholder="Select Mentors"
                    />
                    {chaptererror.mentorId && (
                      <div className="text-danger mt-1">{chaptererror.mentorId}</div>
                    )}
                  </div>

                  {/* Chapter Created Date */}
                  <div className="col-md-6 mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Chapter Created Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className={`form-control ${chaptererror.chapterCreatedDate ? "is-invalid" : ""}`}
                      name="chapterCreatedDate"
                      value={chapterFormData.chapterCreatedDate}
                      onChange={handleChapterInputChange}
                    />
                    {chaptererror.chapterCreatedDate && (
                      <div className="text-danger mt-1">{chaptererror.chapterCreatedDate}</div>
                    )}
                  </div>



                  {/* Location */}
                  <div className="col-md-6 mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Location <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control radius-8 ${chaptererror.meetingVenue ? "is-invalid" : ""}`}
                      name="meetingVenue"
                      value={chapterFormData.meetingVenue}
                      onChange={handleChapterInputChange}
                    />
                    {chaptererror.meetingVenue && (
                      <div className="text-danger mt-1">{chaptererror.meetingVenue}</div>
                    )}
                  </div>

                  {/* Meeting Type */}
                  <div className="col-md-6 mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Meeting Type
                    </label>
                    <select
                      className={`form-control form-select ${chaptererror.meetingType ? "is-invalid" : ""}`}
                      name="meetingType"
                      value={chapterFormData.meetingType}
                      onChange={handleChapterInputChange}
                    >
                      <option value="Online">Online</option>
                      <option value="In Person">In Person</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                    {chaptererror.meetingType && (
                      <div className="text-danger mt-1">{chaptererror.meetingType}</div>
                    )}
                  </div>


                </div>

                {/* Action Buttons - Full Width */}
                <div className="d-flex align-items-center gap-3 mt-24">
                  <button
                    type="reset"
                    className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-40 py-11 radius-8"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary grip border border-primary-600 text-md px-48 py-12 radius-8"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>


      {/* Edit Chapter Modal */}
      <div
        className="modal fade"
        id="exampleModalOne"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-m modal-dialog modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit Chapter Status
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeEditModal"
              />
            </div>

            <div className="modal-body p-24">
              {selectedChapter && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    console.log("🚀 Sending update:", {
                      isActive: selectedChapter.isActive,
                      weekday: selectedChapter.weekday,
                    });
                    try {
                      const response = await chapterApiProvider.updateChapterStatus(
                        selectedChapter._id,
                        {
                          isActive: selectedChapter.isActive,
                          weekday: selectedChapter.weekday,
                          mentorId: Array.isArray(selectedChapter.mentorId)
                            ? selectedChapter.mentorId.map(m => m._id || m)
                            : []
                        }
                      );

                      if (response && response.status) {
                        Swal.fire({
                          title: "Success!",
                          text: "Chapter updated successfully",
                          icon: "success",
                          customClass: {
                            popup: "small-swal-popup",
                            title: "small-swal-title",
                            htmlContainer: "small-swal-text",
                          },
                          width: "400px",
                        });

                        document.getElementById("closeEditModal").click();
                        fetchChapters();
                      }
                    } catch (error) {
                      Swal.fire({
                        title: "Error!",
                        text: error.message || "Failed to update chapter",
                        icon: "error",
                        customClass: {
                          popup: "small-swal-popup",
                          title: "small-swal-title",
                          htmlContainer: "small-swal-text",
                        },
                        width: "400px",
                      });
                    }
                  }}
                >
                  <table style={{ borderCollapse: "collapse", width: "100%" }}>
                    <tbody>

                      {/* Chapter Name */}
                      <tr style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}>
                        <td style={{ padding: "8px 0" }}>
                          <strong>Chapter Name:</strong>
                        </td>
                        <td style={{ padding: "8px 0" }}>
                          {selectedChapter.chapterName}{" "}
                          <span className="chapterday">
                            {/* ({formatDayName(selectedChapter.meetingDayAndTime)}) */}
                            ({selectedChapter.weekday})
                          </span>
                        </td>
                      </tr>

                      {/* Weekday Row (NEW) */}
                      <tr style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}>
                        <td style={{ padding: "8px 0" }}>
                          <strong>Weekday:</strong>
                        </td>
                        <td style={{ padding: "8px 0" }}>
                          <select
                            className="form-control form-select"
                            value={selectedChapter.weekday}
                            onChange={(e) =>
                              setSelectedChapter({
                                ...selectedChapter,
                                weekday: e.target.value,
                              })
                            }
                            style={{
                              width: "150px",
                              padding: "8px 8px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              backgroundColor: "#fff",
                            }}
                          >
                            <option value=""> Weekday</option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
                          </select>
                        </td>
                      </tr>

                      {/* Zone */}
                      <tr style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}>
                        <td style={{ padding: "8px 0" }}>
                          <strong>Zone:</strong>
                        </td>
                        <td style={{ padding: "8px 0" }}>
                          {selectedChapter.zoneId?.zoneName || "N/A"}
                        </td>
                      </tr>

                      {/* Mentor */}
                      <tr style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}>
                        <td style={{ padding: "8px 0" }}>
                          <strong>Mentor:</strong>
                        </td>
                        <td style={{ padding: "8px 0" }}>
                          <Select
                            isMulti
                            className="react-select-container"
                            classNamePrefix="react-select"
                            options={mentors}
                            value={mentors.filter((mentor) =>
                              Array.isArray(selectedChapter.mentorId) && selectedChapter.mentorId.some(m => (m._id || m) === mentor.value)
                            )}
                            onChange={(selectedOptions) => {
                              const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
                              setSelectedChapter({
                                ...selectedChapter,
                                mentorId: selectedValues,
                              });
                            }}
                            placeholder="Select Mentors"
                            styles={{
                              control: (baseStyles) => ({
                                ...baseStyles,
                                width: "350px",
                              }),
                            }}
                          />
                        </td>
                      </tr>

                      {/* Location */}
                      <tr style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}>
                        <td style={{ padding: "8px 0" }}>
                          <strong>Location:</strong>
                        </td>
                        <td style={{ padding: "8px 0" }}>
                          {selectedChapter.meetingVenue}
                        </td>
                      </tr>

                      {/* Status */}
                      <tr style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}>
                        <td style={{ padding: "8px 0" }}>
                          <strong>Status:</strong>
                        </td>
                        <td style={{ padding: "8px 0" }}>
                          <select
                            className="form-control form-select"
                            value={selectedChapter.isActive}
                            onChange={(e) =>
                              setSelectedChapter({
                                ...selectedChapter,
                                isActive: parseInt(e.target.value),
                              })
                            }
                            style={{
                              width: "150px",
                              padding: "8px 8px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              backgroundColor: "#fff",
                            }}
                          >
                            <option value={1}>Active</option>
                            <option value={0}>Inactive</option>
                          </select>
                        </td>
                      </tr>

                    </tbody>
                  </table>

                  <div className="d-flex align-items-center gap-3 mt-24 justify-content-end">
                    <button
                      type="button"
                      className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-40 py-11 radius-8"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary grip border border-primary-600 text-md px-48 py-12 radius-8"
                    >
                      Update Status
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inactive Chapters Modal */}
      <div
        className="modal fade"
        id="inactiveChaptersModal"
        tabIndex={-1}
        aria-labelledby="inactiveChaptersModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="inactiveChaptersModalLabel">
                Inactive Chapters
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeInactiveModal"
              />
            </div>
            <div className="modal-body p-24">
              <div className="table-responsive scroll-sm">
                <table className="table bordered-table sm-table mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Chapter Name</th>
                      <th scope="col">Zone</th>
                      <th scope="col">Location</th>
                      <th scope="col" className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chapters.filter((c) => c.isActive !== 1).length > 0 ? (
                      chapters.filter((c) => c.isActive !== 1).map((chapter) => (
                        <tr key={chapter._id}>
                          <td>{chapter.chapterName}</td>
                          <td>{chapter.zoneId?.zoneName || "N/A"}</td>
                          <td>{chapter.meetingVenue || "N/A"}</td>
                          <td className="text-center">
                            <button
                              type="button"
                              className="btn btn-sm btn-success"
                              onClick={async () => {
                                try {
                                  const response = await chapterApiProvider.updateChapterStatus(
                                    chapter._id,
                                    {
                                      isActive: 1,
                                      weekday: chapter.weekday
                                    }
                                  );
                                  if (response && response.status) {
                                    Swal.fire({
                                      title: "Activated!",
                                      text: `Chapter "${chapter.chapterName}" is now active.`,
                                      icon: "success",
                                      timer: 1500,
                                      showConfirmButton: false,
                                      width: "400px"
                                    });
                                    fetchChapters();
                                  } else {
                                    throw new Error(response?.response?.message || "Failed to activate chapter");
                                  }
                                } catch (error) {
                                  Swal.fire({
                                    title: "Error!",
                                    text: error.message || "Failed to activate chapter",
                                    icon: "error",
                                    width: "400px"
                                  });
                                }
                              }}
                            >
                              Activate
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-4">
                          No inactive chapters found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden button to trigger User Modal */}
      <button type="button" id="hiddenOpenUserModalBtn" data-bs-toggle="modal" data-bs-target="#userCreationModal" style={{ display: 'none' }}></button>

      {/* User Creation Modal */}
      <div className="modal fade" id="userCreationModal" tabIndex="-1" aria-labelledby="userCreationModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="userCreationModalLabel">Add {userRoleToCreate}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeUserModal" />
            </div>
            <div className="modal-body p-24">
              <form onSubmit={handleUserSubmit}>
                <div className="row">
                  <div className="col-12 mb-20 text-center">
                    <h6 className="text-md text-primary-light mb-16">Profile Image</h6>
                    <div className="avatar-upload mx-auto" style={{ width: '100px', height: '100px', position: 'relative' }}>
                      <div className="avatar-edit position-absolute bottom-0 end-0 z-1 cursor-pointer">
                        <input type="file" id="userImageUpload" accept=".png, .jpg, .jpeg" hidden onChange={handleUserImageChange} disabled={isSubmittingUser} />
                        <label htmlFor="userImageUpload" className="w-32-px h-32-px d-flex justify-content-center align-items-center bg-primary-50 text-primary-600 border border-primary-600 bg-hover-primary-100 text-lg rounded-circle" style={{ cursor: 'pointer' }}>
                          <Icon icon="solar:camera-outline" className="icon"></Icon>
                        </label>
                      </div>
                      <div className="avatar-preview" style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', border: '2px solid #ccc' }}>
                        <div id="userImagePreview" style={{ width: '100%', height: '100%', backgroundImage: userImagePreview ? `url(${userImagePreview})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-20">
                    <label htmlFor="name" className="form-label fw-semibold text-primary-light text-sm mb-8">Name <span className="text-danger">*</span></label>
                    <input type="text" className="form-control radius-8" id="name" value={userFormData.name} onChange={handleUserInputChange} disabled={isSubmittingUser} />
                    {userFormErrors.name && <span className='text-danger'>{userFormErrors.name}</span>}
                  </div>

                  <div className="col-md-6 mb-20">
                    <label htmlFor="companyName" className="form-label fw-semibold text-primary-light text-sm mb-8">Company Name <span className="text-danger">*</span></label>
                    <input type="text" className="form-control radius-8" id="companyName" value={userFormData.companyName} onChange={handleUserInputChange} disabled={isSubmittingUser} />
                    {userFormErrors.companyName && <span className='text-danger'>{userFormErrors.companyName}</span>}
                  </div>

                  <div className="col-md-6 mb-20">
                    <label htmlFor="mobileNumber" className="form-label fw-semibold text-primary-light text-sm mb-8">Mobile Number <span className="text-danger">*</span></label>
                    <input type="tel" className="form-control radius-8" id="mobileNumber" value={userFormData.mobileNumber} onChange={handleUserInputChange} disabled={isSubmittingUser} />
                    {userFormErrors.mobileNumber && <span className='text-danger'>{userFormErrors.mobileNumber}</span>}
                  </div>

                  <div className="col-md-6 mb-20">
                    <label htmlFor="email" className="form-label fw-semibold text-primary-light text-sm mb-8">Email <span className="text-danger">*</span></label>
                    <input type="email" className="form-control radius-8" id="email" value={userFormData.email} onChange={handleUserInputChange} disabled={isSubmittingUser} />
                    {userFormErrors.email && <span className='text-danger'>{userFormErrors.email}</span>}
                  </div>

                  <div className="col-md-6 mb-20">
                    <label htmlFor="username" className="form-label fw-semibold text-primary-light text-sm mb-8">Username <span className="text-danger">*</span></label>
                    <input type="text" className="form-control radius-8" id="username" value={userFormData.username} onChange={handleUserInputChange} disabled={isSubmittingUser} />
                    {userFormErrors.username && <span className='text-danger'>{userFormErrors.username}</span>}
                  </div>

                  <div className="col-md-6 mb-20">
                    <label htmlFor="pin" className="form-label fw-semibold text-primary-light text-sm mb-8">PIN <span className="text-danger">*</span></label>
                    <input type="text" className="form-control radius-8" id="pin" placeholder="Enter 4-digit PIN" value={userFormData.pin} onChange={handleUserInputChange} maxLength="4" disabled={isSubmittingUser} />
                    <small className="text-muted d-block mt-1">Must be exactly 4 digits (numbers only)</small>
                    {userFormErrors.pin && <span className='text-danger'>{userFormErrors.pin}</span>}
                    {userFormErrors.role && <div className="text-danger mt-2">{userFormErrors.role}</div>}
                  </div>

                  <div className="col-12 d-flex align-items-center justify-content-end gap-3 mt-4">
                    <button type="button" className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-40 py-11 radius-8" data-bs-dismiss="modal" disabled={isSubmittingUser}>Cancel</button>
                    <button type="submit" className="btn btn-primary grip text-md px-40 py-12 radius-8" disabled={isSubmittingUser}>
                      {isSubmittingUser ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Save'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Manage Zone Modal */}
      <div
        className="modal fade"
        id="manageZoneModal"
        tabIndex={-1}
        aria-labelledby="manageZoneModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="manageZoneModalLabel">
                Manage Zone Members
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body p-0">
              <ManageZoneLayer isModal={true} zoneId={zoneId} />
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <div
        className="modal fade"
        id="qrModal"
        tabIndex={-1}
        aria-labelledby="qrModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="qrModalLabel">
                Visitor Link QR Code
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body p-24 text-center">
              {selectedChapterForQR ? (
                <>
                  <h5 className="mb-3 text-primary-light fw-semibold">
                    {selectedChapterForQR.chapterName}
                  </h5>
                  {isGeneratingQR ? (
                    <div className="d-flex justify-content-center align-items-center mb-4" style={{ height: "256px" }}>
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-center mb-4" ref={qrRef}>
                      <QRCodeCanvas
                        value={`https://user.gripforum.com/visitors/${selectedChapterForQR.zoneId?.zoneName?.toLowerCase().replace(/\s+/g, "") || "zone"}/${selectedChapterForQR.chapterName?.toLowerCase().replace(/\s+/g, "")}`}
                        size={256}
                        level={"H"}
                        includeMargin={true}
                      />
                    </div>
                  )}
                  <p className="text-secondary mb-4 text-sm" style={{ wordBreak: 'break-all' }}>
                    https://user.gripforum.com/visitors/{selectedChapterForQR.zoneId?.zoneName?.toLowerCase().replace(/\s+/g, "") || "zone"}/{selectedChapterForQR.chapterName?.toLowerCase().replace(/\s+/g, "")}
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <button
                      className="btn btn-outline-primary grip text-md px-24 py-11 radius-8"
                      onClick={handleRegenerateQR}
                      disabled={isGeneratingQR}
                    >
                      <Icon icon="lucide:refresh-cw" className="me-2" />
                      Regenerate
                    </button>
                    <button
                      className="btn btn-primary grip text-md px-24 py-11 radius-8"
                      onClick={downloadQRCode}
                      disabled={isGeneratingQR}
                    >
                      <Icon icon="lucide:download" className="me-2" />
                      Download
                    </button>
                  </div>
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default ChapterAccessLayer;

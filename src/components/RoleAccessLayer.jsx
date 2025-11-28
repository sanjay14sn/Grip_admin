import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import { Country, State } from "country-state-city";
import userApiProvider from "../apiProvider/userApi";
import chapterApiProvider from "../apiProvider/chapterApi";
import Swal from "sweetalert2";
import { hasPermission } from "../utils/auth";
import Select from "react-select";
import { Tag, Tooltip } from "antd";
import debounce from "lodash.debounce";

const ChapterAccessLayer = () => {
  // Zone Modal State
  const [zoneFormData, setZoneFormData] = useState({
    countryName: "",
    stateName: "",
    zoneName: "",
    dob: "",
    zoneHead: []
  });

  // Chapter Modal State
  const [chapterFormData, setChapterFormData] = useState({
    chapterName: "",
    countryName: "",
    stateName: "",
    zoneId: "",
    cidId: [],
    mentorId: "",
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

  // Fetch initial data
  useEffect(() => {
    fetchCountries();
    fetchChapters();
    fetchCIds({ role: "CID" });
    fetchMentors({ role: "mentor" });
  }, []);

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

  const fetchZonesByState = async (countryName, stateName) => {
    const response = await chapterApiProvider.getZonesByState(stateName);
    if (response && response.status) {
      const zoneOptions = response.response.data.map((zone) => ({
        value: zone._id,
        label: zone.zoneName,
      }));
      setZones(zoneOptions);
    }
  };

  const fetchCIds = async () => {
    const response = await userApiProvider.getUsersByRole({ role: "CID" });
    if (response && response.status) {
      const cidOptions = response.response.data.map((user) => ({
        value: user._id,
        label: user.name,
      }));
      setCids(cidOptions);
    }
  };

  const fetchMentors = async () => {
    const response = await userApiProvider.getUsersByRole({ role: "Chapter Mentor" });
    if (response && response.status) {
      const mentorOptions = response.response.data.map((user) => ({
        value: user._id,
        label: user.name,
      }));
      setMentors(mentorOptions);
    }
  };

  const debouncedFetchChapters = React.useCallback(
    debounce((query) => {
      fetchChapters(query);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedFetchChapters(value);
  };

  const fetchChapters = async (search = "") => {
    try {
      const response = await chapterApiProvider.getAllChapters({ search });
      if (response && response.status) {
        setChapters(response.response.data);
      }
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };

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
          zoneHead: [],
        });
        setErrors({});
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
    fetchZonesByState(chapterFormData.countryName, stateName);
  };

  const handleChapterZoneChange = (e) => {
    const zoneId = e.target.value;
    setChapterFormData({ ...chapterFormData, zoneId });
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

  const handleChapterSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!chapterFormData.chapterName || chapterFormData.chapterName.trim() === "") {
      newErrors.chapterName = "Chapter name is required";
    }

    if (!chapterFormData.countryName) {
      newErrors.countryName = "Country is required";
    }

    if (!chapterFormData.stateName) {
      newErrors.stateName = "State is required";
    }

    if (!chapterFormData.zoneId) {
      newErrors.zoneId = "Zone is required";
    }

    if (!chapterFormData.cidId || chapterFormData.cidId.length === 0) {
      newErrors.cidId = "At least one CID is required";
    }
    if (!chapterFormData.mentorId) {
      newErrors.mentorId = "Mentor is required";
    }

    if (!chapterFormData.meetingVenue || chapterFormData.meetingVenue.trim() === "") {
      newErrors.meetingVenue = "Meeting venue is required";
    }

    if (!chapterFormData.chapterCreatedDate) {
      newErrors.chapterCreatedDate = "Chapter created date is required";
    } else {
      const createdDate = new Date(chapterFormData.chapterCreatedDate);
      const today = new Date();
      if (createdDate > today) {
        newErrors.chapterCreatedDate = "Date cannot be in the future";
      }
    }

    if (!chapterFormData.meetingDayAndTime) {
      newErrors.meetingDayAndTime = "Meeting date and time is required";
    }

    if (!chapterFormData.weekday || chapterFormData.weekday.trim() === "") {
      newErrors.weekday = "Weekday is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setChapterError(newErrors);
      return;
    }

    try {
      const response = await chapterApiProvider.createChapter(chapterFormData);
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
          countryName: "",
          stateName: "",
          zoneId: "",
          cidId: [],
          mentorId: "",
          meetingVenue: "",
          chapterCreatedDate: "",
          meetingDayAndTime: "",
          meetingType: "In Person",
        });
        fetchChapters();
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
          {hasPermission("chapters-create") && (
            <button
              type="button"
              className="btn btn-primary grip text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
              data-bs-toggle="modal"
              data-bs-target="#exampleModalTwo"
            >
              <Icon
                icon="ic:baseline-plus"
                className="icon text-xl line-height-1"
              />
              Add Zone
            </button>
          )}
          {hasPermission("chapters-create") && (
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
            {chapters.map((chapter) => (
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
                          <strong>CID:</strong>
                        </td>
                        <td style={{ padding: "8px 0" }}>
                          {chapter.cidId?.length > 0 ? (
                            <>
                              <Tag color="#c02222">{chapter.cidId[0]?.name}</Tag>

                              {chapter.cidId.length > 2 ? (
                                <Tooltip
                                  title={chapter.cidId
                                    .slice(1)
                                    .map(cid => cid.name)
                                    .join(", ")}
                                >
                                  <Tag color="#c02222">+{chapter.cidId.length - 1}</Tag>
                                </Tooltip>
                              ) : (
                                // If exactly 2, show the second tag normally
                                chapter.cidId[1] && (
                                  <Tag color="#c02222">{chapter.cidId[1]?.name}</Tag>
                                )
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
                    </div>
                  </div>
                </div>
              </div>
            ))}
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

                  {/* Country */}
                  <div className="col-md-6 mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Country <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-control form-select ${chaptererror.countryName ? "is-invalid" : ""}`}
                      name="countryName"
                      value={chapterFormData.countryName}
                      onChange={handleChapterCountryChange}
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country.value} value={country.value}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                    {chaptererror.countryName && (
                      <div className="text-danger mt-1">{chaptererror.countryName}</div>
                    )}
                  </div>

                  {/* State */}
                  <div className="col-md-6 mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      State <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-control form-select ${chaptererror.stateName ? "is-invalid" : ""}`}
                      name="stateName"
                      value={chapterFormData.stateName}
                      onChange={handleChapterStateChange}
                      disabled={!chapterFormData.countryName}
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state.value} value={state.value}>
                          {state.label}
                        </option>
                      ))}
                    </select>
                    {chaptererror.stateName && (
                      <div className="text-danger mt-1">{chaptererror.stateName}</div>
                    )}
                  </div>

                  {/* Zone */}
                  <div className="col-md-6 mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Zone <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-control form-select ${chaptererror.zoneId ? "is-invalid" : ""}`}
                      name="zoneId"
                      value={chapterFormData.zoneId}
                      onChange={handleChapterZoneChange}
                      disabled={!chapterFormData.stateName}
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

                  {/* Chapter Mentors */}
                  <div className="col-md-6 mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Chapter Mentors <span className="text-danger">*</span>
                    </label>
                    <Select
                      className={`react-select-container ${chaptererror.mentorId ? "is-invalid" : ""}`}
                      classNamePrefix="react-select"
                      options={mentors}
                      value={mentors.find((mentor) => mentor.value === chapterFormData.mentorId)}
                      onChange={(selectedOption) => {
                        const selectedValue = selectedOption ? selectedOption.value : "";
                        setChapterFormData((prev) => ({
                          ...prev,
                          mentorId: selectedValue,
                        }));
                        if (chaptererror.mentorId) {
                          setChapterError((prev) => ({ ...prev, mentorId: "" }));
                        }
                      }}
                      placeholder="Select Mentor"
                    />
                    {chaptererror.mentorId && (
                      <div className="text-danger mt-1">{chaptererror.mentorId}</div>
                    )}
                  </div>
                  {/* CIDs */}
                  <div className="col-md-6 mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Chapter Induction Directors <span className="text-danger">*</span>
                    </label>
                    <Select
                      isMulti
                      className={`react-select-container ${chaptererror.cidId ? "is-invalid" : ""}`}
                      classNamePrefix="react-select"
                      options={cids}
                      value={cids.filter((cid) =>
                        chapterFormData.cidId.includes(cid.value)
                      )}
                      onChange={(selectedOptions) => {
                        const selectedValues = selectedOptions
                          ? selectedOptions.map((option) => option.value)
                          : [];
                        setChapterFormData((prev) => ({
                          ...prev,
                          cidId: selectedValues,
                        }));
                        if (chaptererror.cidId) {
                          setChapterError((prev) => ({ ...prev, cidId: "" }));
                        }
                      }}
                      placeholder="Select CIDs"
                    />
                    {chaptererror.cidId && (
                      <div className="text-danger mt-1">{chaptererror.cidId}</div>
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

                  {/* Meeting Day & Time */}
                  <div className="col-md-6 mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Meeting Date & Time <span className="text-danger">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      className={`form-control ${chaptererror.meetingDayAndTime ? "is-invalid" : ""}`}
                      name="meetingDayAndTime"
                      value={chapterFormData.meetingDayAndTime}
                      onChange={handleChapterInputChange}
                    />
                    {chaptererror.meetingDayAndTime && (
                      <div className="text-danger mt-1">{chaptererror.meetingDayAndTime}</div>
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

                  {/* Weekday */}
                  <div className="col-md-6 mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Weekday <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-control form-select ${chaptererror.weekday ? "is-invalid" : ""}`}
                      name="weekday"
                      value={chapterFormData.weekday}
                      onChange={handleChapterInputChange}
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

                    {chaptererror.weekday && (
                      <div className="text-danger mt-1">{chaptererror.weekday}</div>
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
                          weekday: selectedChapter.weekday   // ★ NEW
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

                      {/* CID */}
                      <tr style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}>
                        <td style={{ padding: "8px 0" }}>
                          <strong>CID:</strong>
                        </td>
                        <td style={{ padding: "8px 0" }}>
                          {selectedChapter.cidId?.length > 0 ? (
                            <>
                              <Tag color="#c02222">{selectedChapter.cidId[0]?.name}</Tag>

                              {selectedChapter.cidId.length > 2 ? (
                                <Tooltip
                                  title={selectedChapter.cidId
                                    .slice(1)
                                    .map((cid) => cid.name)
                                    .join(", ")}
                                >
                                  <Tag color="#c02222">
                                    +{selectedChapter.cidId.length - 1}
                                  </Tag>
                                </Tooltip>
                              ) : (
                                selectedChapter.cidId[1] && (
                                  <Tag color="#c02222">
                                    {selectedChapter.cidId[1]?.name}
                                  </Tag>
                                )
                              )}
                            </>
                          ) : (
                            "N/A"
                          )}
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
    </>
  );
};

export default ChapterAccessLayer;

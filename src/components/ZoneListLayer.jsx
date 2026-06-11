import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import chapterApiProvider from "../apiProvider/chapterApi";
import { Country, State } from "country-state-city";
import Swal from "sweetalert2";
import { hasPermission } from "../utils/auth";
import ManageZoneLayer from "./ManageZoneLayer";


const ZoneListLayer = () => {
  const [zoneData, setZoneData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [errors, setErrors] = useState({});

  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedManageZoneId, setSelectedManageZoneId] = useState(null);
  const [zoneFormData, setZoneFormData] = useState({
    countryName: "",
    stateName: "",
    zoneName: "",
    name: "",
    email: "",
    mobileNumber: "",
    password: "",
    dob: "",
  });

  useEffect(() => {
    fetchCountries();
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

  const handleEditClick = (zone) => {
    setSelectedZone(zone);
    fetchStates(zone.countryName);

    let formattedDob = "";
    if (zone.dob) {
      try {
        const d = new Date(zone.dob);
        formattedDob = d.toISOString().split("T")[0];
      } catch (err) {
        formattedDob = zone.dob;
      }
    }

    setZoneFormData({
      countryName: zone.countryName || "",
      stateName: zone.stateName || "",
      zoneName: zone.zoneName || "",
      name: zone.name || "",
      email: zone.email || "",
      mobileNumber: zone.mobileNumber || "",
      password: "",
      dob: formattedDob,
    });
    setErrors({});
  };

  const handleAddClick = () => {
    setSelectedZone(null);
    setZoneFormData({
      countryName: "",
      stateName: "",
      zoneName: "",
      name: "",
      email: "",
      mobileNumber: "",
      password: "",
      dob: "",
    });
    setErrors({});
  };

  const handleZoneSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!zoneFormData.zoneName || zoneFormData.zoneName.trim() === "") {
      newErrors.zoneName = "Zone name is required";
    }

    if (!zoneFormData.name || zoneFormData.name.trim() === "") {
      newErrors.name = "Name is required";
    }

    if (!zoneFormData.email || zoneFormData.email.trim() === "") {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(zoneFormData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!zoneFormData.mobileNumber || zoneFormData.mobileNumber.trim() === "") {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10,15}$/.test(zoneFormData.mobileNumber.trim())) {
      newErrors.mobileNumber = "Mobile number is invalid";
    }

    if (!selectedZone && (!zoneFormData.password || zoneFormData.password.trim() === "")) {
      newErrors.password = "Password is required";
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
      let response;
      if (selectedZone) {
        response = await chapterApiProvider.updateZone(selectedZone._id, zoneFormData);
      } else {
        response = await chapterApiProvider.createZone(zoneFormData);
      }

      if (response && response.status) {
        Swal.fire({
          title: "Success!",
          text: selectedZone ? "Zone updated successfully" : "Zone created successfully",
          icon: "success",
          customClass: {
            popup: "small-swal-popup",
            title: "small-swal-title",
            htmlContainer: "small-swal-text",
          },
          width: "400px",
        });
        document.getElementById("closeZoneModal").click();
        fetchData();
      } else {
        throw new Error(response?.response?.message || "Failed to save zone");
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to save zone",
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

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.limit, searchQuery]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery,
      };
      const response = await chapterApiProvider.getZones(params);

      if (response && response.status) {
        const zones = response?.response?.data || [];
        const total = response?.response?.meta?.total || response?.response?.pagination?.total || zones.length;

        setZoneData(zones);
        setPagination((prev) => ({
          ...prev,
          total,
          totalPages: Math.ceil(total / pagination.limit),
        }));
      } else {
        setError(response?.response?.message || "Failed to fetch zones");
      }
    } catch (err) {
      console.error("Error fetching zones:", err);
      setError(err.message || "Failed to fetch zones");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (zoneId, zoneName) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete the zone "${zoneName}". This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "small-swal-popup",
        title: "small-swal-title",
        htmlContainer: "small-swal-text",
        confirmButton: "small-swal-confirm-btn",
        cancelButton: "small-swal-cancel-btn",
      },
      width: "400px",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const response = await chapterApiProvider.deleteZone(zoneId);
        if (response && response.status) {
          Swal.fire({
            title: "Deleted!",
            text: `The zone "${zoneName}" has been deleted.`,
            icon: "success",
            width: "400px",
          });
          fetchData();
        } else {
          const errMsg = response?.response?.message || response?.message || "Failed to delete zone";
          throw new Error(errMsg);
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.message || "Something went wrong while deleting the zone.",
          icon: "error",
          width: "400px",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const formatDOB = (dobString) => {
    if (!dobString) return "N/A";
    try {
      const date = new Date(dobString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dobString;
    }
  };

  if (loading && zoneData.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center">Error: {error}</div>;
  }

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <div className="navbar-search">
            <input
              key="search-input"
              type="text"
              className="bg-base h-40-px w-auto"
              name="search"
              placeholder="Search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              disabled={loading}
            />
            <Icon icon="ion:search-outline" className="icon" />
          </div>
        </div>
        <div className="d-flex align-items-center flex-wrap gap-1">
          {hasPermission("chapters-create") && (
            <button
              type="button"
              className="btn btn-primary grip text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
              data-bs-toggle="modal"
              data-bs-target="#exampleModalTwo"
              onClick={handleAddClick}
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

      <div className="card-body p-24">
        <div className="table-responsive scroll-sm">
          <table className="table bordered-table sm-table mb-0">
            <thead>
              <tr>
                <th scope="col">S.No</th>
                <th scope="col">Zone Name</th>
                <th scope="col">Country</th>
                <th scope="col">State</th>
                <th scope="col">Status</th>
                <th scope="col" className="text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {zoneData && zoneData.length > 0 ? (
                zoneData.map((zone, index) => (
                  <tr key={zone._id}>
                    <td>
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </td>
                    <td className="fw-semibold">
                      <Link
                        to={`/chapter/zone/${zone._id}`}
                        className="btn-link border-0 bg-transparent text-primary p-0 fw-semibold text-start text-decoration-underline"
                        style={{ cursor: "pointer", display: "inline-block" }}
                      >
                        {zone.zoneName}
                      </Link>
                    </td>
                    <td>
                      {Country.getCountryByCode(zone.countryName)?.name || zone.countryName}
                    </td>
                    <td>
                      {State.getStateByCodeAndCountry(zone.stateName, zone.countryName)?.name || zone.stateName}
                    </td>
                    <td>
                      <span className={`badge ${zone.isActive === 1 ? "bg-success-focus text-success-600" : "bg-danger-focus text-danger-600"}`}>
                        {zone.isActive === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                     <td className="text-center">
                      <div className="d-flex align-items-center gap-10 justify-content-center">
                        {hasPermission("chapters-update") && (
                          <button
                            type="button"
                            className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModalTwo"
                            onClick={() => handleEditClick(zone)}
                            disabled={loading}
                          >
                            <Icon icon="lucide:edit" className="menu-icon" />
                          </button>
                        )}
                        <button
                          type="button"
                          className="bg-primary-focus text-primary-600 bg-hover-primary-200 fw-medium w-auto h-40-px px-12 d-flex justify-content-center align-items-center rounded-8 text-decoration-none"
                          data-bs-toggle="modal"
                          data-bs-target="#manageZoneModal"
                          onClick={() => setSelectedManageZoneId(zone._id)}
                          title="Manage Zone"
                        >
                          <Icon icon="lucide:users" className="menu-icon me-2" />
                          <span className="text-sm">Manage Zone</span>
                        </button>
                        <button
                          type="button"
                          className="bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                          onClick={() => handleDelete(zone._id, zone.zoneName)}
                          disabled={loading}
                        >
                          <Icon
                            icon="fluent:delete-24-regular"
                            className="menu-icon"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No zones found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} entries
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-danger"
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(1)}
              >
                First
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                Previous
              </button>
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      className={`btn btn-sm ${
                        pagination.page === pageNum
                          ? "btn-primary"
                          : "btn-outline-danger"
                      }`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}
              <button
                className="btn btn-sm btn-outline-danger"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Next
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => handlePageChange(pagination.totalPages)}
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>



      {/* Add/Edit Zone Modal */}
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
                {selectedZone ? "Edit Zone" : "Add New Zone"}
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

                  {/* Name */}
                  <div className="col-12 mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      name="name"
                      value={zoneFormData.name}
                      onChange={(e) => {
                        handleZoneInputChange(e);
                        if (errors.name) {
                          setErrors((prev) => ({ ...prev, name: "" }));
                        }
                      }}
                      placeholder="Enter Name"
                    />
                    {errors.name && (
                      <div className="text-danger mt-1">{errors.name}</div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="col-12 mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      name="email"
                      value={zoneFormData.email}
                      onChange={(e) => {
                        handleZoneInputChange(e);
                        if (errors.email) {
                          setErrors((prev) => ({ ...prev, email: "" }));
                        }
                      }}
                      placeholder="Enter Email"
                    />
                    {errors.email && (
                      <div className="text-danger mt-1">{errors.email}</div>
                    )}
                  </div>

                  {/* Mobile Number */}
                  <div className="col-12 mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Mobile Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.mobileNumber ? "is-invalid" : ""}`}
                      name="mobileNumber"
                      value={zoneFormData.mobileNumber}
                      onChange={(e) => {
                        handleZoneInputChange(e);
                        if (errors.mobileNumber) {
                          setErrors((prev) => ({ ...prev, mobileNumber: "" }));
                        }
                      }}
                      placeholder="Enter Mobile Number"
                    />
                    {errors.mobileNumber && (
                      <div className="text-danger mt-1">{errors.mobileNumber}</div>
                    )}
                  </div>

                  {/* Password */}
                  {!selectedZone && (
                    <div className="col-12 mb-20">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Password <span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                        name="password"
                        value={zoneFormData.password}
                        onChange={(e) => {
                          handleZoneInputChange(e);
                          if (errors.password) {
                            setErrors((prev) => ({ ...prev, password: "" }));
                          }
                        }}
                        placeholder="Enter Password"
                      />
                      {errors.password && (
                        <div className="text-danger mt-1">{errors.password}</div>
                      )}
                    </div>
                  )}

                  {/* Country */}
                  <div className="col-12 mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Country <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-control form-select ${errors.countryName ? "is-invalid" : ""}`}
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
                      className={`form-control form-select ${errors.stateName ? "is-invalid" : ""}`}
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
                      className={`form-control ${errors.dob ? "is-invalid" : ""}`}
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
                      type="button"
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
              <ManageZoneLayer isModal={true} zoneId={selectedManageZoneId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoneListLayer;

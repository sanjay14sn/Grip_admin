import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Modal } from "antd";
import Select from "react-select";
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import chapterApiProvider from "../apiProvider/chapterApi";
import makeAnimated from "react-select/animated";
import paymentApiProvider from "../apiProvider/paymentApi";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import { hasPermission } from "../utils/auth";
import { formatDate } from "../utils/dateFormatter";
import config from "../config/config";

const libraries = ['places'];
const containerStyle = {
    width: '100%',
    height: '300px',
    borderRadius: '8px',
    marginTop: '10px'
};

const defaultCenter = {
    lat: 20.5937,
    lng: 78.9629
};

const MeetingListLayer = () => {
    const [paymentDetails, setPaymentDetails] = useState([]);
    const [chapterList, setChapterList] = useState([]);
    const [formData, setFormData] = useState({
        topic: "",
        amount: "",
        chapters: [],
        hotelName: "",
        startDate: "",
        endDate: "",
        location: "",
        latitude: "",
        longitude: "",
    });

    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [markerPosition, setMarkerPosition] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const mapRef = useRef(null);
    const placeAutocompleteRef = useRef(null);

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: config.googleMapsApiKey,
        libraries
    });

    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    const onUnmount = useCallback(() => {
        mapRef.current = null;
    }, []);

    const onMapClick = useCallback((e) => {
        if (!isLoaded || !window.google || !window.google.maps) return;

        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarkerPosition({ lat, lng });
        updateLocationFromCoordinates(lat, lng);
    }, [isLoaded]);

    const handlePlaceSelect = useCallback((place) => {
        if (!isLoaded || !window.google || !window.google.maps) return;

        if (place && place.geometry) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            setMapCenter({ lat, lng });
            setMarkerPosition({ lat, lng });

            setFormData(prev => ({
                ...prev,
                location: place.formatted_address || '',
                latitude: lat,
                longitude: lng
            }));

            if (mapRef.current) {
                mapRef.current.panTo({ lat, lng });
                mapRef.current.setZoom(15);
            }
        }
    }, [isLoaded]);

    const updateLocationFromCoordinates = async (lat, lng) => {
        if (!isLoaded || !window.google || !window.google.maps) return;

        try {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    setFormData(prev => ({
                        ...prev,
                        location: results[0].formatted_address,
                        latitude: lat.toString(),
                        longitude: lng.toString()
                    }));
                }
            });
        } catch (error) {
            console.error('Error getting address from coordinates:', error);
        }
    };

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentPaymentId, setCurrentPaymentId] = useState(null);
    const animatedComponents = makeAnimated();

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(searchInput);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        fetchGetAllChapter();
        fetchPaymentData();
    }, [pagination.page, pagination.limit, searchQuery]);

    useEffect(() => {
        if (isLoaded && !loadError) {
            console.log('Google Maps API loaded successfully');
        }
    }, [isLoaded, loadError]);

    const fetchGetAllChapter = async () => {
        try {
            const resultALlChapter = await chapterApiProvider.getAllChapters();
            if (resultALlChapter?.status) {
                const data = resultALlChapter?.response?.data;
                if (data) {
                    const formattedChapters = [
                        { value: "all", label: "All Chapters" },
                        ...data.map((chapter) => ({
                            value: chapter._id,
                            label: chapter.chapterName,
                        })),
                    ];
                    setChapterList(formattedChapters);
                }
            }
        } catch (error) {
            console.error("Error fetching chapters:", error);
        }
    };

    const fetchPaymentData = async () => {
        try {
            const input = {
                page: pagination.page,
                limit: pagination.limit,
                search: searchQuery,
                purpose: "meeting",
            };

            const response = await paymentApiProvider.getPaymentDetails(input);
            if (response?.status) {
                setPaymentDetails(response.data.data || []);
                setPagination((prev) => ({
                    ...prev,
                    total: response.data.pagination?.total || 0,
                    totalPages: Math.ceil(
                        (response.data.pagination?.total || 0) / pagination.limit
                    ),
                }));
            }
        } catch (error) {
            console.error("Error fetching payments:", error);
        }
    };

    const handleEditPayment = (paymentId) => {
        const paymentToEdit = paymentDetails.find(
            (payment) => payment._id === paymentId
        );
        if (paymentToEdit) {
            setCurrentPaymentId(paymentId);
            setIsEditMode(true);

            const selectedChapters = paymentToEdit.chapterId.map((chapter) => ({
                value: chapter._id,
                label: chapter.chapterName,
            }));

            const formattedStartDate = paymentToEdit.startDate
                ? new Date(paymentToEdit.startDate).toISOString().slice(0, 16)
                : "";

            const formattedEndDate = paymentToEdit.endDate
                ? new Date(paymentToEdit.endDate).toISOString().slice(0, 16)
                : "";

            if (paymentToEdit.latitude && paymentToEdit.longitude) {
                const lat = parseFloat(paymentToEdit.latitude);
                const lng = parseFloat(paymentToEdit.longitude);

                setMapCenter({ lat, lng });
                setMarkerPosition({ lat, lng });
            }

            setFormData({
                topic: paymentToEdit.topic,
                amount: paymentToEdit.amount,
                chapters: selectedChapters,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                location: paymentToEdit.address || "",
                latitude: paymentToEdit.latitude || "",
                longitude: paymentToEdit.longitude || "",
                hotelName: paymentToEdit.hotelName || "", // 👈 Added line

            });

            setModalVisible(true);
        }
    };

    const handleSubmit = async (e) => {
        const newErrors = {};
        e.preventDefault();

        if (!isLoaded) {
            newErrors.location = "Google Maps is still loading. Please wait and try again.";
        } else if (!formData.latitude || !formData.longitude) {
            newErrors.location = "Please select a location on the map";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }

        if (!formData.topic || formData.topic.trim() === "") {
            newErrors.topic = "Topic is required";
            setErrors(newErrors);
            return false;
        } else if (!/^[A-Za-z\s]+$/.test(formData.topic)) {
            newErrors.topic = "Only alphabets and spaces allowed";
            setErrors(newErrors);
            return false;
        }

        // ✅ Hotel Name validation
        if (!formData.hotelName || formData.hotelName.trim() === "") {
            newErrors.hotelName = "Hotel Name is required";
            setErrors(newErrors);
            return false;
        } else if (!/^[A-Za-z0-9\s.,-]+$/.test(formData.hotelName)) {
            newErrors.hotelName = "Only letters, numbers, spaces, commas, dots, and hyphens allowed";
            setErrors(newErrors);
            return false;
        }

        const amountValue = formData.amount;
        const amountStr = String(amountValue || '').trim();

        if (!amountStr) {
            newErrors.amount = "Amount is required";
            setErrors(newErrors);
            return false;
        } else if (!/^\d+\.?\d*$/.test(amountStr)) {
            newErrors.amount = "Only numbers allowed";
            setErrors(newErrors);
            return false;
        } else if (parseFloat(amountStr) <= 0) {
            newErrors.amount = "Amount must be greater than 0";
            setErrors(newErrors);
            return false;
        }

        if (!formData.chapters || formData.chapters.length === 0) {
            newErrors.chapters = "At least one chapter must be selected";
            setErrors(newErrors);
            return false;
        }

        if (!formData.startDate) {
            newErrors.startDate = "Start Date is required";
            setErrors(newErrors);
            return false;
        }

        if (!formData.endDate) {
            newErrors.endDate = "End Date is required";
            setErrors(newErrors);
            return false;
        }

        if (!formData.location || formData.location.trim() === "") {
            newErrors.location = "Location is required";
            setErrors(newErrors);
            return false;
        }
        if (formData.latitude === "" || formData.longitude === "") {
            newErrors.location = "Please select a location on the map";
            setErrors(newErrors);
            return false;
        }

        try {
            setIsSubmitting(true);
            const submissionData = new FormData();
            submissionData.append("purpose", "meeting");
            submissionData.append("topic", formData.topic);
            submissionData.append("image", null);
            submissionData.append("amount", formData.amount);
            // ✅ Append hotel name to backend
            submissionData.append("hotelName", formData.hotelName);

            const chapterIds = formData.chapters.map((chapter) => chapter.value);
            chapterIds.forEach((id) => {
                submissionData.append("chapterId", id);
            });

            submissionData.append("paymentRequired", true);

            const formattedStartDate = formData.startDate
                ? new Date(formData.startDate).toISOString()
                : "";
            submissionData.append("startDate", formattedStartDate);

            const formattedEndDate = formData.endDate
                ? new Date(formData.endDate).toISOString()
                : "";
            submissionData.append("endDate", formattedEndDate);

            submissionData.append("address", formData.location);
            submissionData.append("latitude", parseFloat(formData.latitude) || 0);
            submissionData.append("longitude", parseFloat(formData.longitude) || 0);

            let response;
            if (isEditMode) {
                response = await paymentApiProvider.updatePayment(
                    currentPaymentId,
                    submissionData
                );
            } else {
                response = await paymentApiProvider.addPayment(submissionData);
            }

            if (response?.status) {
                toast(`Meeting ${isEditMode ? "updated" : "created"} successfully!`);
                resetForm();
                fetchPaymentData();
                setModalVisible(false);
            } else {
                throw new Error(
                    response?.message ||
                    `Failed to ${isEditMode ? "update" : "create"} meeting`
                );
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error(
                error.message ||
                `Error ${isEditMode ? "updating" : "creating"
                } meeting. Please try again.`
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            topic: "",
            amount: "",
            chapters: [],
            startDate: "",
            endDate: "",
            location: "",
            latitude: "",
            longitude: "",
        });
        setMapCenter(defaultCenter);
        setMarkerPosition(null);
        setIsEditMode(false);
        setCurrentPaymentId(null);
        setErrors({});

        if (isLoaded) {
            setMapCenter(defaultCenter);
            setMarkerPosition(null);
        }
    };

    const handleModalClose = () => {
        resetForm();
        setModalVisible(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'startDate' && value) {
            const selectedDate = new Date(value);
            const now = new Date();

            if (selectedDate < now) {
                setErrors(prev => ({
                    ...prev,
                    startDate: 'Please select a future date and time'
                }));
                return;
            }

            if (errors.startDate) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.startDate;
                    return newErrors;
                });
            }
        }

        setFormData({
            ...formData,
            [name]: value,
        });

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleChapterChange = (selectedOptions) => {
        const allChaptersSelected =
            selectedOptions &&
            selectedOptions.some((option) => option.value === "all");

        if (allChaptersSelected) {
            const allRealChapters = chapterList.filter(
                (chapter) => chapter.value !== "all"
            );
            setFormData({
                ...formData,
                chapters: allRealChapters,
            });
        } else {
            setFormData({
                ...formData,
                chapters: selectedOptions || [],
            });
        }

        if (errors.chapters) {
            setErrors({
                ...errors,
                chapters: null,
            });
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchQuery(searchInput);
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination((prev) => ({ ...prev, page: newPage }));
        }
    };

    const handleDelete = async (paymentId, paymentTopic) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `You are about to delete the meeting "${paymentTopic}". This action cannot be undone!`,
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
                const response = await paymentApiProvider.deletPayemnt(paymentId);

                if (response && response.status) {
                    await Swal.fire(
                        "Deleted!",
                        `The meeting "${paymentTopic}" has been deleted.`,
                        "success"
                    );
                    fetchPaymentData();
                } else {
                    throw new Error(response?.message || "Failed to delete meeting");
                }
            } catch (error) {
                Swal.fire(
                    "Error!",
                    error.message || "Something went wrong while deleting the meeting.",
                    "error"
                );
            }
        }
    };

    const getQRCodeUrl = (qrCodeData) => {
        if (!qrCodeData?.docName) {
            toast.error('QR Code data not available');
            return null;
        }
        return `${config.imageBaseUrl}${qrCodeData.docPath}/${qrCodeData.docName}`;
    };

    const downloadQRCode = async (qrCodeData) => {
        const url = getQRCodeUrl(qrCodeData);
        if (!url) return;

        const loadingToast = toast.loading('Downloading QR Code...');
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);

            const blobUrl = URL.createObjectURL(await response.blob());
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = qrCodeData.originalName || qrCodeData.docName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);

            toast.success('QR Code downloaded successfully!');
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Failed to download QR Code. Please try again.');
        } finally {
            toast.dismiss(loadingToast);
        }
    };

    const openQRCodeInNewTab = (qrCodeData) => {
        const url = getQRCodeUrl(qrCodeData);
        if (url) window.open(url, '_blank');
    };

    const handleHotelChange = (e) => {
        const { value } = e.target;

        // Optional: Add validation
        if (!/^[A-Za-z0-9\s]*$/.test(value)) {
            setErrors(prev => ({
                ...prev,
                hotelName: 'Only letters, numbers, and spaces are allowed'
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            hotelName: value,
        }));

        // Clear error if fixed
        if (errors.hotelName) {
            setErrors(prev => ({
                ...prev,
                hotelName: null
            }));
        }
    };


    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: "40px",
            borderColor: errors.chapters ? "#dc3545" : "#dee2e6",
            "&:hover": {
                borderColor: errors.chapters ? "#dc3545" : "#dee2e6",
            },
            boxShadow: "none",
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: "#f0f0f0",
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: "#333",
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: "#999",
            ":hover": {
                backgroundColor: "#e0e0e0",
                color: "#333",
            },
        }),
    };

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                <div className="d-flex align-items-center flex-wrap gap-3">
                    <form className="navbar-search" onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            className="bg-base h-40-px w-auto"
                            name="search"
                            placeholder="Search"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <Icon icon="ion:search-outline" className="icon" />
                    </form>
                </div>
                {hasPermission("payments-create") && (
                    <Link
                        to="#"
                        className="btn btn-primary grip text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                        onClick={() => {
                            resetForm();
                            setModalVisible(true);
                        }}
                    >
                        <Icon
                            icon="ic:baseline-plus"
                            className="icon text-xl line-height-1"
                        />
                        Make Meeting
                    </Link>
                )}
            </div>

            <div className="card-body p-24">
                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Topic</th>
                                <th>Amount</th>
                                <th>Chapter</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>QR Code</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentDetails.map((payment, index) => (
                                <tr key={payment._id}>
                                    <td>
                                        {(pagination.page - 1) * pagination.limit + index + 1}.
                                    </td>
                                    <td className="text-capitalize">{payment.topic}</td>
                                    <td>₹{payment.amount}</td>
                                    <td>
                                        <span className="text-md mb-0 fw-normal text-secondary-light">
                                            {payment.chapterId
                                                .map((chapter) => chapter.chapterName)
                                                .join(", ")}
                                        </span>
                                    </td>
                                    <td>{formatDate(payment.startDate)}</td>
                                    <td>{formatDate(payment.endDate)}</td>
                                    <td>
                                        {payment.qrCode ? (
                                            <div className="qr-code-container">
                                                <img
                                                    src={`${config.imageBaseUrl}${payment.qrCode.docPath}/${payment.qrCode.docName}`}
                                                    alt="QR Code"
                                                    style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                                                    className="qr-code-image cursor-pointer"
                                                    onClick={() => openQRCodeInNewTab(payment.qrCode)}
                                                    title="Click to view full size"
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary qr-code-download-btn"
                                                    onClick={() => downloadQRCode(payment.qrCode)}
                                                    title="Download QR Code"
                                                >
                                                    <Icon icon="mdi:download" className="icon text-sm" />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-muted">No QR Code</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-10 justify-content-center">
                                            {hasPermission("payments-list") && (
                                                <button
                                                    type="button"
                                                    className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                >
                                                    <Link
                                                        to={`/attedense-list/${payment._id}`}
                                                        className="text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                                                    >
                                                        <Icon
                                                            icon="majesticons:eye-line"
                                                            className="icon text-xl"
                                                        />
                                                    </Link>
                                                </button>
                                            )}
                                            {hasPermission("payments-update") && (
                                                <button
                                                    type="button"
                                                    className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                    onClick={() => handleEditPayment(payment._id)}
                                                >
                                                    <Icon icon="lucide:edit" className="menu-icon" />
                                                </button>
                                            )}
                                            {hasPermission("payments-delete") && (
                                                <button
                                                    type="button"
                                                    className="bg-danger-focus text-danger-600 bg-hover-danger-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                    onClick={() =>
                                                        handleDelete(payment._id, payment.topic)
                                                    }
                                                >
                                                    <Icon
                                                        icon="mdi:trash-can-outline"
                                                        className="menu-icon"
                                                    />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
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
                                            className={`btn btn-sm ${pagination.page === pageNum
                                                ? "btn btn-primary grip text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
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

            <Modal
                title={isEditMode ? "Edit Meeting" : "Meeting Creation"}
                open={modalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={500}
                centered
            >
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-12 mb-20">
                            <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                Topic <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                name="topic"
                                className={`form-control radius-8 ${errors.topic ? "is-invalid" : ""
                                    }`}
                                value={formData.topic}
                                onChange={(e) => {
                                    if (
                                        /^[A-Za-z\s]*$/.test(e.target.value) ||
                                        e.target.value === ""
                                    ) {
                                        handleInputChange(e);
                                        if (errors.topic) {
                                            setErrors((prev) => ({ ...prev, topic: "" }));
                                        }
                                    }
                                }}
                            />
                            {errors.topic && (
                                <div className="invalid-feedback">{errors.topic}</div>
                            )}
                        </div>

                        <div className="col-12 mb-20">
                            <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                Amount <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                name="amount"
                                className={`form-control radius-8 ${errors.amount ? "is-invalid" : ""
                                    }`}
                                value={formData.amount}
                                onChange={(e) => {
                                    if (
                                        /^\d*\.?\d*$/.test(e.target.value) ||
                                        e.target.value === ""
                                    ) {
                                        handleInputChange(e);
                                        if (errors.amount) {
                                            setErrors((prev) => ({ ...prev, amount: "" }));
                                        }
                                    }
                                }}
                            />
                            {errors.amount && (
                                <div className="invalid-feedback">{errors.amount}</div>
                            )}
                        </div>

                        <div className="col-12 mb-20">
                            <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                Chapter(s) <span className="text-danger">*</span>
                            </label>
                            <Select
                                isMulti
                                name="chapters"
                                options={chapterList}
                                components={animatedComponents}
                                className={`react-select-container ${errors.chapters ? "is-invalid" : ""
                                    }`}
                                classNamePrefix="react-select"
                                onChange={handleChapterChange}
                                value={formData.chapters}
                                styles={customStyles}
                                placeholder="Select chapters..."
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                isOptionSelected={(option) => {
                                    if (option.value === "all") {
                                        const allRealChapters = chapterList.filter(
                                            (ch) => ch.value !== "all"
                                        );
                                        return (
                                            formData.chapters.length === allRealChapters.length
                                        );
                                    }
                                    return formData.chapters.some(
                                        (ch) => ch.value === option.value
                                    );
                                }}
                            />
                            {errors.chapters && (
                                <div className="invalid-feedback">{errors.chapters}</div>
                            )}
                        </div>
                        <div className="col-12 mb-20">
                            <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                Hotel Name <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                name="hotelName"
                                className={`form-control radius-8 ${errors.hotelName ? "is-invalid" : ""}`}
                                value={formData.hotelName || ""}
                                onChange={handleHotelChange}
                                placeholder="Enter hotel name"
                            />
                            {errors.hotelName && (
                                <div className="invalid-feedback">{errors.hotelName}</div>
                            )}
                        </div>
                        <div className="col-12 mb-20">
                            <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                Start Date & Time <span className="text-danger">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                name="startDate"
                                className={`form-control radius-8 ${errors.startDate ? "is-invalid" : ""}`}
                                value={formData.startDate}
                                onChange={handleInputChange}
                                min={new Date().toISOString().slice(0, 16)}
                            />
                            {errors.startDate && (
                                <div className="invalid-feedback">{errors.startDate}</div>
                            )}
                        </div>

                        <div className="col-12 mb-20">
                            <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                End Date & Time <span className="text-danger">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                name="endDate"
                                className={`form-control radius-8 ${errors.endDate ? "is-invalid" : ""}`}
                                value={formData.endDate}
                                onChange={handleInputChange}
                                min={new Date().toISOString().slice(0, 16)}
                            />
                            {errors.endDate && (
                                <div className="invalid-feedback">{errors.endDate}</div>
                            )}
                        </div>

                        <div className="col-12 mb-20">
                            <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                Location <span className="text-danger">*</span>
                            </label>
                            {loadError ? (
                                <div className="alert alert-danger">Error loading Google Maps. Please try again later.</div>
                            ) : !isLoaded ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <div className="mt-2">Loading Google Maps...</div>
                                </div>
                            ) : (
                                <>
                                    <div className="autocomplete-container">
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                name="location"
                                                className={`form-control radius-8 ${errors.location ? "is-invalid" : ""}`}
                                                placeholder={isLoaded ? "Search for a location" : "Loading Google Maps..."}
                                                value={formData.location}
                                                disabled={!isLoaded}
                                                onChange={(e) => {
                                                    handleInputChange(e);
                                                    if (errors.location) {
                                                        setErrors(prev => ({ ...prev, location: "" }));
                                                    }
                                                }}
                                                ref={placeAutocompleteRef}
                                                onFocus={() => {
                                                    if (isLoaded && window.google && window.google.maps && window.google.maps.places) {
                                                        const autocomplete = new window.google.maps.places.Autocomplete(placeAutocompleteRef.current, {
                                                            types: ['geocode', 'establishment'],
                                                            componentRestrictions: { country: 'IN' }
                                                        });

                                                        autocomplete.addListener('place_changed', () => {
                                                            const place = autocomplete.getPlace();
                                                            handlePlaceSelect(place);
                                                        });
                                                    }
                                                }}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        if (formData.location && isLoaded && window.google && window.google.maps && window.google.maps.places) {
                                                            const geocoder = new window.google.maps.Geocoder();
                                                            geocoder.geocode({ address: formData.location }, (results, status) => {
                                                                if (status === 'OK' && results[0]) {
                                                                    const place = results[0];
                                                                    handlePlaceSelect(place);
                                                                } else {
                                                                    toast.error('Location not found. Please try a different search term.');
                                                                }
                                                            });
                                                        }
                                                    }
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                disabled={!isLoaded}
                                                onClick={() => {
                                                    if (formData.location && isLoaded && window.google && window.google.maps && window.google.maps.places) {
                                                        const geocoder = new window.google.maps.Geocoder();
                                                        geocoder.geocode({ address: formData.location }, (results, status) => {
                                                            if (status === 'OK' && results[0]) {
                                                                const place = results[0];
                                                                handlePlaceSelect(place);
                                                            } else {
                                                                toast.error('Location not found. Please try a different search term.');
                                                            }
                                                        });
                                                    }
                                                }}
                                            >
                                                <Icon icon="ion:search-outline" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-3" style={{ border: '1px solid #dee2e6', borderRadius: '8px', overflow: 'hidden' }}>
                                        <GoogleMap
                                            mapContainerStyle={containerStyle}
                                            center={mapCenter}
                                            zoom={markerPosition ? 15 : 5}
                                            onLoad={onMapLoad}
                                            onUnmount={onUnmount}
                                            onClick={isLoaded ? onMapClick : undefined}
                                            options={{
                                                streetViewControl: isLoaded,
                                                mapTypeControl: isLoaded,
                                                fullscreenControl: isLoaded,
                                                mapTypeId: 'hybrid',
                                                mapTypeControlOptions: {
                                                    mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain'],
                                                    style: isLoaded && window.google?.maps?.MapTypeControlStyle?.HORIZONTAL_BAR || 'HORIZONTAL_BAR',
                                                    position: isLoaded && window.google?.maps?.ControlPosition?.TOP_RIGHT || 'TOP_RIGHT'
                                                },
                                                styles: [
                                                    {
                                                        featureType: 'poi',
                                                        elementType: 'labels',
                                                        stylers: [{ visibility: 'on' }]
                                                    },
                                                    {
                                                        featureType: 'administrative.locality',
                                                        elementType: 'labels',
                                                        stylers: [{ visibility: 'on' }]
                                                    },
                                                    {
                                                        featureType: 'road',
                                                        elementType: 'labels',
                                                        stylers: [{ visibility: 'on' }]
                                                    }
                                                ]
                                            }}
                                        >
                                            {markerPosition && isLoaded && (
                                                <Marker
                                                    position={markerPosition}
                                                    draggable={true}
                                                    onDragEnd={(e) => {
                                                        if (!isLoaded || !window.google || !window.google.maps) return;
                                                        const lat = e.latLng.lat();
                                                        const lng = e.latLng.lng();
                                                        setMarkerPosition({ lat, lng });
                                                        updateLocationFromCoordinates(lat, lng);
                                                    }}
                                                />
                                            )}
                                        </GoogleMap>
                                    </div>
                                    {errors.location && (
                                        <div className="invalid-feedback d-block">{errors.location}</div>
                                    )}
                                    {(formData.latitude && formData.longitude) && (
                                        <div className="mt-2 text-muted small">
                                            Coordinates: {parseFloat(formData.latitude).toFixed(6)}, {parseFloat(formData.longitude).toFixed(6)}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="d-flex align-items-center gap-3 mt-24">
                            <button
                                type="button"
                                className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-40 py-11 radius-8"
                                onClick={handleModalClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary grip border border-primary-600 text-md px-48 py-12 radius-8"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>
            <ToastContainer />
            <style>{`
                select.no-arrow {
                    background-image: none !important;
                }
                .is-invalid {
                    border-color: #dc3545 !important;
                }
                .invalid-feedback {
                    color: #dc3545;
                    font-size: 0.875em;
                }
                .react-select-container {
                    font-size: 14px;
                }
                .react-select__control {
                    border-radius: 8px !important;
                    border: 1px solid #dee2e6 !important;
                    min-height: 40px !important;
                }
                .react-select__control--is-focused {
                    border-color: #86b7fe !important;
                    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
                }
                .react-select__value-container {
                    padding: 2px 8px !important;
                }
                .react-select__multi-value {
                    background-color: #f0f0f0 !important;
                    border-radius: 4px !important;
                }
                .react-select__multi-value__label {
                    color: #333 !important;
                    font-size: 13px !important;
                }
                .react-select__multi-value__remove {
                    color: #999 !important;
                }
                .react-select__multi-value__remove:hover {
                    background-color: #e0e0e0 !important;
                    color: #333 !important;
                }
                .react-select__multi-value {
                    background-color: #f0f0f0 !important;
                    border-radius: 4px !important;
                }
                .form-check-input:checked {
                    background-color: #0d6efd;
                    border-color: #0d6efd;
                }
                .form-check-label {
                    margin-left: 8px;
                }
                .input-group .btn {
                    border-left: 0;
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;
                }
                .input-group .form-control {
                    border-top-right-radius: 0;
                    border-bottom-right-radius: 0;
                }
                .autocomplete-container .input-group {
                    margin-bottom: 0;
                }
                .qr-code-container {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .qr-code-image {
                    border: 1px solid #dee2e6;
                    border-radius: 4px;
                    padding: 2px;
                    background: white;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .qr-code-image:hover {
                    border-color: #c02222;
                    box-shadow: 0 2px 8px rgba(13, 110, 253, 0.15);
                    transform: scale(1.05);
                }
                .qr-code-download-btn {
                    padding: 4px 8px;
                    font-size: 12px;
                }
            `}</style>
        </div>
    );
};

export default MeetingListLayer;
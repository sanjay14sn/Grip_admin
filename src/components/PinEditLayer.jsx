import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import pinApiProvider from "../apiProvider/pinApi";
import Swal from "sweetalert2";

const PinEditLayer = () => {
    const [pinData, setPinData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    console.log("pinData", pinData)

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [searchInput, setSearchInput] = useState("");

    // ✅ Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => setSearchQuery(searchInput), 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        fetchData(searchQuery !== "");
    }, [pagination.page, pagination.limit, searchQuery]);

    const fetchData = async (isSearch = false) => {
        try {
            setLoading(true);
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                search: searchQuery,
            };
            const response = await pinApiProvider.getPins(params);

            if (response && response.status) {
                const pins = response?.response?.data || [];
                const total = response?.response?.pagination?.total || pins.length;

                setPinData(pins);
                setPagination((prev) => ({
                    ...prev,
                    total,
                    totalPages: Math.ceil(total / pagination.limit),
                }));
            } else {
                setError(response?.response?.message || "Failed to fetch pins");
            }
        } catch (err) {
            console.error("Error fetching pins:", err);
            setError(err.message || "Failed to fetch pins");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (pinId) => {
        navigate(`/pins/edit/${pinId}`); // ✅ better route path for clarity
    };

    const handleDelete = async (pinId, pinName) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `You are about to delete the pin "${pinName}". This action cannot be undone!`,
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
                const response = await pinApiProvider.deletePin(pinId);
                if (response && response.status) {
                    Swal.fire({
                        title: "Deleted!",
                        text: `The pin "${pinName}" has been deleted.`,
                        icon: "success",
                        width: "400px",
                    });
                    fetchData(false);
                } else {
                    throw new Error(response?.message || "Failed to delete pin");
                }
            } catch (error) {
                Swal.fire({
                    title: "Error!",
                    text: error.message || "Something went wrong while deleting the pin.",
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

    if (loading) {
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

                {/* ✅ Always show Add Pin button */}
                <Link
                    to="/pins/add"
                    className="btn btn-primary grip text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                    disabled={loading}
                >
                    <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
                    Add Pin
                </Link>
            </div>

            <div className="card-body p-24">
                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr>
                                <th scope="col">S.No</th>
                                <th scope="col">Name</th>
                                <th scope="col">Image</th>
                                <th scope="col" className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pinData && pinData.length > 0 ? (
                                pinData.map((pin, index) => (
                                    <tr key={pin._id}>
                                        <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                                        <td>{pin.name}</td>
                                        <td>
                                            {pin.image && pin.image.docName ? (
                                                <img
                                                    // src={`http://localhost:4002/uploads/${pin.image.docPath}/${pin.image.docName}`}
                                                    src={`${process.env.REACT_APP_IMAGE_URL}${pin.image.docPath}/${pin.image.docName}`}
                                                    alt={pin.name}
                                                    width="60"
                                                    height="60"
                                                    style={{ objectFit: "cover", borderRadius: "8px" }}
                                                />
                                            ) : (
                                                "No Image"
                                            )}
                                        </td>
                                        <td className="text-center">
                                            <div className="d-flex align-items-center gap-10 justify-content-center">
                                                {/* ✅ Always allow edit & delete */}
                                                <button
                                                    type="button"
                                                    className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                    onClick={() => handleEdit(pin._id)}
                                                >
                                                    <Icon icon="lucide:edit" className="menu-icon" />
                                                </button>

                                                <button
                                                    type="button"
                                                    className="bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                    onClick={() => handleDelete(pin._id, pin.name)}
                                                >
                                                    <Icon icon="fluent:delete-24-regular" className="menu-icon" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-4">No pins found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination.totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <div>
                            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                            {pagination.total} entries
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
                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
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
                                            ? "btn-primary"
                                            : "btn-outline-danger"
                                            }`}
                                        onClick={() => handlePageChange(pageNum)}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
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
        </div>
    );
};

export default PinEditLayer;

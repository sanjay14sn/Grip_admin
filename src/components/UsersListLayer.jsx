import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import userApiProvider from "../apiProvider/userApi";
import Swal from "sweetalert2";
import { hasPermission } from "../utils/auth";

const UsersListLayer = () => {
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    });

    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const debounceTimer = useRef(null);

    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            setDebouncedSearch(searchInput.trim());
            setPagination((prev) => ({ ...prev, page: 1 })); // reset page
        }, 500);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [searchInput]);

    const fetchUserData = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                search: debouncedSearch,
            };

            const response = await userApiProvider.getUsers(params);
            if (response && response.status) {
                setUserList(response?.response?.data || []);
                setPagination((prev) => ({
                    ...prev,
                    total: response?.response?.pagination?.total || 0,
                    totalPages: Math.ceil(
                        (response?.response?.pagination?.total || 0) / pagination.limit
                    ),
                }));
            } else {
                setError(response?.response?.message || "Failed to fetch users");
            }
        } catch (error) {
            setError(error.message || "Failed to fetch users");
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [pagination.page, pagination.limit, debouncedSearch]);

    const handleView = (user) => {
        Swal.fire({
            title: `<div style="font-size: 24px; color: #2c3e50; margin-bottom: 20px;">${user.name}</div>`,
            html: `
                <div style="text-align: left; font-size: 15px; line-height: 2.2;">
                    <div style="display: flex; margin-bottom: 12px;">
                        <div style="flex: 0 0 120px; color: #7e8e9f; font-weight: 500;">Email:</div>
                        <div style="flex: 1;">${user.email || 'N/A'}</div>
                    </div>
                    <div style="display: flex; margin-bottom: 12px;">
                        <div style="flex: 0 0 120px; color: #7e8e9f; font-weight: 500;">Mobile:</div>
                        <div style="flex: 1;">${user.mobileNumber || 'N/A'}</div>
                    </div>
                    <div style="display: flex; margin-bottom: 12px;">
                        <div style="flex: 0 0 120px; color: #7e8e9f; font-weight: 500;">Company:</div>
                        <div style="flex: 1;">${user.companyName || 'N/A'}</div>
                    </div>
                    <div style="display: flex; margin-bottom: 12px;">
                        <div style="flex: 0 0 120px; color: #7e8e9f; font-weight: 500;">Status:</div>
                        <div style="flex: 1;">
                            <span style="display: inline-flex; align-items: center; padding: 2px 12px; border-radius: 20px; font-size: 13px; font-weight: 500; background-color: ${user.isActive ? '#e6f7ee' : '#feecec'}; color: ${user.isActive ? '#10b981' : '#ef4444'};">
                                ${user.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                </div>
            `,
            showCloseButton: true,
            showConfirmButton: false,
            width: "500px",
            padding: '30px',
            background: '#ffffff',
        });
    };

    const handleEdit = (userId) => {
        navigate(`/add-user/${userId}`);
    };

    const handleDelete = async (userId, userName) => {
        const result = await Swal.fire({
            title: "Delete User?",
            text: `Are you sure you want to delete ${userName}? This action cannot be undone.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            width: "400px",
        });

        if (result.isConfirmed) {
            try {
                setLoading(true);
                const response = await userApiProvider.deleteUser(userId);
                if (response && response.status) {
                    Swal.fire({
                        title: "Deleted!",
                        text: `${userName} has been deleted.`,
                        icon: "success",
                        width: "400px",
                    });
                    fetchUserData();
                }
            } catch (error) {
                Swal.fire({
                    title: "Error!",
                    text: error.message || "Failed to delete user.",
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

    if (error) {
        return <div className="alert alert-danger text-center">Error: {error}</div>;
    }

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                <div className="d-flex align-items-center flex-wrap gap-3">
                    <div className="navbar-search">
                        <input
                            type="text"
                            className="bg-base h-40-px w-auto"
                            name="search"
                            placeholder="Search"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <Icon icon="ion:search-outline" className="icon" />
                    </div>
                </div>
                {hasPermission("users-create") && (
                    <Link
                        to="/add-user"
                        className="btn btn-primary grip text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                        disabled={loading}
                    >
                        <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
                        Add New User
                    </Link>
                )}
            </div>
            <div className="card-body p-24">
                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Mobile Number</th>
                                <th>Company Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : userList.length > 0 ? (
                                userList.map((user, index) => (
                                    <tr key={user._id}>
                                        <td>{(pagination.page - 1) * pagination.limit + index + 1}.</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.mobileNumber}</td>
                                        <td>{user.companyName}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-10">
                                                <button
                                                    type="button"
                                                    className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                    onClick={() => handleView(user)}
                                                    disabled={loading}
                                                >
                                                    <Icon icon="majesticons:eye-line" className="icon text-xl" />
                                                </button>
                                                {hasPermission("users-update") && (
                                                    <button
                                                        type="button"
                                                        className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                        onClick={() => handleEdit(user._id)}
                                                        disabled={loading}
                                                    >
                                                        <Icon icon="lucide:edit" className="menu-icon" />
                                                    </button>
                                                )}
                                                {hasPermission("users-delete") && (
                                                    <button
                                                        type="button"
                                                        className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                        onClick={() => handleDelete(user._id, user.name)}
                                                        disabled={loading}
                                                    >
                                                        <Icon icon="fluent:delete-24-regular" className="menu-icon" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">
                                        No users found
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
                            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
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
        </div>
    );
};

export default UsersListLayer;

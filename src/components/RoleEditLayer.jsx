import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import roleApiProvider from "../apiProvider/roleApi";
import Swal from "sweetalert2";
import { hasPermission, getCurrentUser } from "../utils/auth";
import { toast, ToastContainer } from 'react-toastify';
import RequestAccessModal from "./child/RequestAccessModal";
import accessRequestApiProvider from "../apiProvider/accessRequestApi";

const RoleEditLayer = () => {
    const [roleData, setRoleData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // ── Role detection (same pattern as DashBoardLayer) ──────────────
    const sessionUser = getCurrentUser()?.data;
    const rawRole = sessionUser?.role;
    const roleName = (typeof rawRole === 'object' ? rawRole?.name : rawRole) || '';
    const roleNameLower = roleName.toLowerCase();
    const isED = roleNameLower === 'ed' || roleNameLower === 'executive director';
    const isSuperAdmin = roleNameLower === 'admin' || roleNameLower === 'super admin' || roleNameLower === 'super-admin';
    // ED = view-only; zone-admin (not ED) = can edit zone-scoped roles
    const isReadOnly = isED;

    // ── Request Access modal (for ED) ────────────────────────────────
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [myRequests, setMyRequests] = useState([]);
    const [loadingMyRequests, setLoadingMyRequests] = useState(false);

    const fetchMyRequests = async () => {
        if (!isED) return;
        setLoadingMyRequests(true);
        try {
            const res = await accessRequestApiProvider.myRequests();
            if (res.status) setMyRequests(res.response.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingMyRequests(false);
        }
    };

    const handleDeleteRequest = async (requestId) => {
        const result = await Swal.fire({
            title: "Cancel Request?",
            text: "Are you sure you want to cancel and delete this access request?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, cancel it!",
            cancelButtonText: "No, keep it",
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
                setLoadingMyRequests(true);
                const res = await accessRequestApiProvider.deleteRequest(requestId);
                if (res.status) {
                    toast.success("Request cancelled successfully!");
                    fetchMyRequests();
                } else {
                    toast.error(res.response?.message || "Failed to cancel request");
                }
            } catch (err) {
                console.error(err);
                toast.error("Something went wrong");
            } finally {
                setLoadingMyRequests(false);
            }
        }
    };

    useEffect(() => { fetchMyRequests(); }, [isED]);

    // Pagination state
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [searchInput, setSearchInput] = useState("");

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(searchInput);
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        // Check if this is a search query change
        const isSearch = searchQuery !== "";
        fetchData(isSearch);
    }, [pagination.page, pagination.limit]);

    // Separate effect for search to avoid conflicts
    useEffect(() => {
        if (searchQuery !== undefined) {
            fetchData(true);
        }
    }, [searchQuery]);

    const fetchData = async (isSearch = false) => {
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                search: searchQuery,
            };

            const response = await roleApiProvider.getRoles(params);
            if (response && response.status) {
                setRoleData(response?.response?.data || []);
                setPagination((prev) => ({
                    ...prev,
                    total: response?.response?.pagination?.total || 0,
                    totalPages: Math.ceil(
                        (response?.response?.pagination?.total || 0) / pagination.limit
                    ),
                }));
            } else {
                setError(response?.response?.message || "Failed to fetch roles");
            }
        } catch (err) {
            setError(err.message || "Failed to fetch roles");
            console.error("Error fetching roles:", err);
        } finally {
        }
    };

    const handleEdit = (roleId) => {
        navigate(`/roles-access/${roleId}`);
    };

    const handleDelete = async (roleId, roleName) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `You are about to delete the role "${roleName}". This action cannot be undone!`,
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
                const response = await roleApiProvider.deleteRole(roleId);

                if (response && response.status) {
                    Swal.fire({
                        title: "Deleted!",
                        text: `The role "${roleName}" has been deleted.`,
                        icon: "success",
                        customClass: {
                            popup: "small-swal-popup",
                            title: "small-swal-title",
                            htmlContainer: "small-swal-text",
                        },
                        width: "400px",
                    });
                    fetchData(false); // Refresh the list after deletion
                } else {
                    throw new Error(response?.message || "Failed to delete role");
                }
            } catch (error) {
                Swal.fire({
                    title: "Error!",
                    text:
                        error.message || "Something went wrong while deleting the role.",
                    icon: "error",
                    customClass: {
                        popup: "small-swal-popup",
                        title: "small-swal-title",
                        htmlContainer: "small-swal-text",
                    },
                    width: "400px",
                });
            } finally {
                setLoading(false);
            }
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

    const STATUS_COLORS = {
        pending:  { bg: '#fffaf0', text: '#dd6b20', border: '#ffe3b3', icon: 'lucide:clock', bgNote: '#fffaf0' },
        approved: { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0', icon: 'lucide:check-circle', bgNote: '#f0fdf4' },
        rejected: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca', icon: 'lucide:x-circle', bgNote: '#fef2f2' },
    };

    return (
        <>
        <ToastContainer />
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
                <div className="d-flex align-items-center gap-10">
                    {/* Add Role button — only for non-ED users */}
                    {!isReadOnly && hasPermission("users-create") && (
                        <Link
                            to="/roles-access"
                            className="btn btn-primary grip text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                            disabled={loading}
                        >
                            <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
                            Add Role
                        </Link>
                    )}
                    {/* Request Access button — only for ED */}
                    {isReadOnly && (
                        <button
                            type="button"
                            className="btn btn-primary grip text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                            onClick={() => setShowRequestModal(true)}
                        >
                            <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
                            Request Access
                        </button>
                    )}
                </div>
            </div>
            <div className="card-body p-24">
                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr>
                                <th scope="col">
                                    <div className="d-flex align-items-center gap-10">S.No</div>
                                </th>
                                <th scope="col">Role Name</th>
                                <th scope="col" className="text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {roleData && roleData.length > 0 ? (
                                roleData.map((ival, index) => (
                                    <tr key={ival._id}>
                                        <td>
                                            {(pagination.page - 1) * pagination.limit + index + 1}
                                        </td>
                                        <td>{ival.name}</td>
                                        <td className="text-center">
                                            {isReadOnly ? (
                                                <span className="text-secondary-light text-sm">—</span>
                                            ) : (
                                            <div className="d-flex align-items-center gap-10 justify-content-center">
                                                {hasPermission("users-update") && (
                                                    <button
                                                        type="button"
                                                        className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                        onClick={() => handleEdit(ival._id)}
                                                        disabled={loading}
                                                    >
                                                        <Icon icon="lucide:edit" className="menu-icon" />
                                                    </button>
                                                )}
                                                {hasPermission("users-delete") && !["CID", "RD", "GRIP", "ED", "MENTOR"].includes(ival.name.toUpperCase()) && (
                                                     <button
                                                         type="button"
                                                         className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                         onClick={() => handleDelete(ival._id, ival.name)}
                                                         disabled={loading}
                                                     >
                                                         <Icon
                                                             icon="fluent:delete-24-regular"
                                                             className="menu-icon"
                                                         />
                                                     </button>
                                                 )}
                                            </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center py-4">
                                        No roles found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
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
        </div>

        {/* ── My Requests panel — only for ED ── */}
        {isReadOnly && (
            <div className="card h-100 p-0 radius-12 mt-24">
                <style>{`
                    .access-request-card {
                        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                        border: 1px solid #e5e7eb;
                        background: #ffffff;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.02);
                    }
                    .access-request-card:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
                        border-color: #d1d5db;
                    }
                    .delete-request-btn {
                        color: #9ca3af;
                        transition: all 0.2s ease;
                        background: transparent;
                        border: none;
                        padding: 6px;
                        border-radius: 6px;
                    }
                    .delete-request-btn:hover {
                        color: #ef4444;
                        background-color: #fee2e2;
                    }
                `}</style>
                <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                    <div>
                        <h6 className="fw-bold text-dark mb-4">My Access Requests</h6>
                        <p className="text-secondary-light text-sm mb-0">Track the status of your submitted requests</p>
                    </div>
                    <button
                        className="btn btn-neutral text-sm px-14 py-8 radius-8 d-flex align-items-center gap-8"
                        onClick={fetchMyRequests}
                        disabled={loadingMyRequests}
                    >
                        <Icon icon="lucide:refresh-cw" className={loadingMyRequests ? "spin-animation" : ""} style={{ fontSize: '14px' }} />
                        Refresh
                    </button>
                </div>
                <div className="card-body p-24">
                    {loadingMyRequests ? (
                        <div className="text-center py-20"><div className="spinner-border spinner-border-sm text-primary" role="status" /></div>
                    ) : myRequests.length === 0 ? (
                        <div className="text-center py-20 text-secondary-light">
                            <Icon icon="lucide:inbox" style={{ fontSize: '32px', marginBottom: '8px', display: 'block', margin: '0 auto 8px' }} />
                            No requests submitted yet
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-16">
                            {myRequests.map(req => {
                                const colors = STATUS_COLORS[req.status] || STATUS_COLORS.pending;
                                return (
                                    <div
                                        key={req._id}
                                        className="access-request-card p-20 radius-12"
                                        style={{ borderLeft: `4px solid ${colors.text}` }}
                                    >
                                        <div className="d-flex align-items-start justify-content-between gap-12">
                                            <div className="flex-1">
                                                <div className="d-flex align-items-center flex-wrap gap-12 mb-10">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span className="d-inline-flex align-items-center justify-content-center p-6 rounded bg-light">
                                                            <Icon icon={req.requestType === 'permission' ? "lucide:shield" : "lucide:user"} className="text-secondary" style={{ fontSize: '16px' }} />
                                                        </span>
                                                        <span className="fw-bold text-dark text-sm">
                                                            {req.requestType === 'permission' ? 'Permission Request' : 'Role Request'}
                                                        </span>
                                                    </div>
                                                    
                                                    <span
                                                        className="px-10 py-4 radius-20 text-xs fw-bold d-inline-flex align-items-center gap-1"
                                                        style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
                                                    >
                                                        <Icon icon={colors.icon} style={{ fontSize: '12px' }} />
                                                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                                    </span>
                                                </div>
                                                
                                                <p className="mb-0 text-sm text-secondary-dark" style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                                    {req.description}
                                                </p>
                                                
                                                {req.responseNote && (
                                                    <div className="mt-12 p-12 radius-8 text-xs d-flex align-items-start gap-2" style={{ background: colors.bgNote, borderLeft: `3px solid ${colors.text}`, color: '#374151' }}>
                                                        <Icon icon="lucide:message-square" className="mt-1" style={{ fontSize: '14px', color: colors.text }} />
                                                        <div className="flex-1">
                                                            <strong className="text-dark">Admin Response:</strong> {req.responseNote}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="d-flex align-items-center gap-12">
                                                <span className="text-secondary-light text-xs" style={{ whiteSpace: 'nowrap' }}>
                                                    {new Date(req.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                                <button
                                                    type="button"
                                                    className="delete-request-btn d-flex align-items-center justify-content-center"
                                                    onClick={() => handleDeleteRequest(req._id)}
                                                    title="Cancel Access Request"
                                                >
                                                    <Icon icon="lucide:trash-2" style={{ fontSize: '16px' }} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Request Access Modal */}
        <RequestAccessModal
            show={showRequestModal}
            onClose={() => setShowRequestModal(false)}
            onSuccess={fetchMyRequests}
        />
        </>
    );
};

export default RoleEditLayer;

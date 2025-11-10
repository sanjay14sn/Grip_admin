import { Icon } from "@iconify/react";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import memberApiProvider from "../apiProvider/memberApi";
import { Modal, Button } from "react-bootstrap";
import { hasPermission } from "../utils/auth";

const AttedenseMemberListLayer = () => {
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [attendanceStatus, setAttendanceStatus] = useState("present");
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

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
            setPagination((prev) => ({ ...prev, page: 1 })); // Reset page on new search
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        fetchMembers();
    }, [pagination.page, pagination.limit, searchQuery]);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                search: searchQuery,
            };

            const response = await memberApiProvider.getMembersByEvents(params, id);
            if (response.status) {
                setMembers(response.data.data || []);
                const total = response.data.pagination?.total || 0;
                setPagination((prev) => ({
                    ...prev,
                    total,
                    totalPages: Math.ceil(total / pagination.limit),
                }));
            } else {
                setError(response.data?.message || "Failed to fetch members");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination((prev) => ({ ...prev, page: newPage }));
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
    };

    const handleAttendanceClick = (member) => {
        setSelectedMember(member);
        setAttendanceStatus("present"); // reset default
        setShowModal(true);
    };



    const handleSubmitAttendance = async () => {
        try {
            if (!selectedMember?._id) {
                alert("Member ID not found.");
                return;
            }

            const payload = {
                meetingId: id, // directly from URL params
                status: attendanceStatus,
                memberId: selectedMember._id,
            };

            console.log(payload, "payload");

            const response = await memberApiProvider.attedenseMark(payload);

            if (response.status) {
                setShowModal(false);
                fetchMembers(); // refresh the list
            } else {
                alert("Failed to mark attendance: " + (response.data?.message || ""));
            }
        } catch (error) {
            alert("Error submitting attendance: " + error.message);
        }
    };

    const [editingMemberId, setEditingMemberId] = useState(null);

    const handleEdit = (member) => {
        console.log(member)
        setEditingMemberId(member._id);
        setAttendanceStatus(member.status || "present"); // prefill current status
    };

    const handleStatusChange = (e, member) => {
        const newStatus = e.target.value;
        handleEditAttendanceClick(member,newStatus);
        setAttendanceStatus(newStatus);
        
    };

    const handleEditAttendanceClick = async (member,newStatus) => {
        try {
            const payload = {
                meetingId: id, // from URL params
                status: newStatus, // get status for this specific member
                memberId: member._id,
                from:"edit"
            };

            console.log(payload, "payload");

            const response = await memberApiProvider.attedenseMark(payload);

            if (response.status) {
               setEditingMemberId(null);
               fetchMembers(); // refresh the list
            } else {
                alert("Failed to mark attendance: " + (response.data?.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Error marking attendance:", error);
            alert("Something went wrong while marking attendance");
        }
    };




    if (loading)
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );

    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                <form className="navbar-search" onSubmit={handleSearch}>
                    <input
                        type="text"
                        className="bg-base h-40-px w-auto"
                        placeholder="Search"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <Icon icon="ion:search-outline" className="icon" />
                </form>
            </div>

            <div className="card-body p-24">
                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Name</th>
                                <th>Chapter Name</th>
                                <th>Mobile Number</th>
                                <th>Company name</th>
                                <th>Category</th>
                                <th>Status</th>
                                {/* ✅ Only show Action column if at least one member has status */}
                                {members.some((m) => m.status) && <th>Action</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {members.map((member, index) => (
                                <tr key={member._id}>
                                    <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                                    <td>{member.name}</td>
                                    <td>{member.chapterName}</td>
                                    <td>{member.mobileNumber}</td>
                                    <td>{member.companyName}</td>
                                    <td>{member.categoryRepresented}</td>

                                    <td>
                                        {member.status ? (
                                            // ✅ Show current status or editable dropdown
                                            editingMemberId === member._id ? (
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={attendanceStatus}
                                                    onChange={(e) => handleStatusChange(e, member)}
                                                    style={{ width: "120px" }}
                                                >
                                                    <option value="present">Present</option>
                                                    <option value="late">Late</option>
                                                    <option value="absent">Absent</option>
                                                    <option value="medical">Medical</option>
                                                    <option value="substitute">Substitute</option>
                                                </select>
                                            ) : (
                                                member.status
                                            )
                                        ) : (
                                            // 🟥 If no status yet, show "Mark Attendance" button
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleAttendanceClick(member)}
                                            >
                                                Mark Attendance
                                            </button>
                                        )}
                                    </td>

                                    {/* ✅ Show Action column only when member has status */}
                                    {hasPermission("payments-create") && member.status && (
                                        <td>
                                            <button
                                                type="button"
                                                className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                onClick={() => handleEdit(member)}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    aria-hidden="true"
                                                    role="img"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <g
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                    >
                                                        <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                        <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                                                    </g>
                                                </svg>
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
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
                                                ? "btn-primary grip text-sm px-12 py-12 radius-8"
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

            {/* Attendance Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Mark Attendance</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">Meeting/Event Name:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={selectedMember?.meetingName || "N/A"}
                            readOnly
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Chapter Name:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={selectedMember?.chapterName || "N/A"}
                            readOnly
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Attendance:</label>
                        <select
                            className="form-select"
                            value={attendanceStatus}
                            onChange={(e) => setAttendanceStatus(e.target.value)}
                        >
                            <option value="present">Present</option>
                            <option value="late">Late</option>
                            <option value="absent">Absent</option>
                            <option value="medical">Medical</option>
                            <option value="substitute">Substitute</option>
                        </select>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmitAttendance}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AttedenseMemberListLayer;

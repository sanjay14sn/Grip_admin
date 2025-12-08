import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import memberApiProvider from "../apiProvider/memberApi";
import Swal from "sweetalert2";
import { hasPermission } from "../utils/auth";

const UserRegisterMemberListLayer = () => {
    const navigate = useNavigate();
    const [resetStep, setResetStep] = useState(0);
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { id } = useParams();
    const [membersData, setMembersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMember, setSelectedMember] = useState(null);
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    });

    const handleSendOtp = () => {
        if (mobile.length >= 10) setResetStep(2);
        else alert("Enter a valid mobile number");
    };

    const handleVerifyOtp = () => {
        if (otp.length === 6) setResetStep(3);
        else alert("Enter valid 6-digit OTP");
    };

    const handleSavePassword = () => {
        if (newPassword !== confirmPassword) return alert("Passwords don't match!");
        setResetStep(4);
        setTimeout(() => {
            setResetStep(0);
            navigate("/sign-in");
        }, 3000);
    };

    const handleStatusChange = async (memberId, value) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: `You are about to ${value.toLowerCase()} this member`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: `Yes, ${value} it!`,
            });

            if (result.isConfirmed) {
                // Call API to update member status
                const response = await memberApiProvider.updateMemberStatus(memberId, {
                    status: value,
                });

                if (response && response.status) {
                    Swal.fire(
                        "Success!",
                        `Member has been ${value.toLowerCase()}.`,
                        "success"
                    );
                    fetchData();
                    // Update local state
                    fetchData();
                }
            }
        } catch (error) {
            console.error("Error updating member status:", error);
            Swal.fire("Error!", "Failed to update associate status.", "error");
        }
    };

    const handleViewMember = (member) => {
        setSelectedMember(member);
        setShowMemberModal(true);
    };

    const handleEditMember = (memberId) => {
        navigate(`/edit-primarymember/${memberId}`);
    };

    useEffect(() => {
        fetchData();
    }, [search, pagination.page, pagination.limit]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                search: search.trim() || undefined,
            };
            const response = await memberApiProvider.getRegisterUserList(params);
            if (response && response.status) {
                setMembersData(response.data.data.members || []);
                setPagination((prev) => ({
                    ...prev,
                    total: response.data.data.pagination?.total || 0,
                    totalPages: Math.ceil(
                        (response.data.data.pagination?.total || 0) / pagination.limit
                    ),
                }));
            }
        } catch (error) {
            console.error("Error fetching members:", error);
        } finally {
            setLoading(false);
        }
    };
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination((prev) => ({ ...prev, page: newPage }));
        }
    };

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
                            value={search} // controlled input
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Icon icon="ion:search-outline" className="icon" />
                    </div>

                    {/* <select
                        className="form-select form-select-sm w-auto"
                        defaultValue="Select Number"
                    >
                        <option value="Select Number">This Week</option>
                        <option value="10">This Month</option>
                        <option value="15">Last Week</option>
                        <option value="20">Last Month</option>
                        <option value="20">This Term</option>
                    </select> */}
                </div>
                {/* {hasPermission("associates-create") && (
                    <Link
                        to="/add-primarymember"
                        className="btn btn-primary grip text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                    >
                        <Icon
                            icon="ic:baseline-plus"
                            className="icon text-xl line-height-1"
                        />
                        Add New
                    </Link>
                )} */}
            </div>

            <div className="card-body p-24">
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="table-responsive scroll-sm">
                        <table className="table bordered-table sm-table mb-0">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Name</th>
                                    <th>Chapter name</th>
                                    <th>Company name</th>
                                    <th>Category</th>
                                    <th>Mobile Number</th>
                                    <th className="text-center">Status</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {membersData &&
                                    membersData.map((member, index) => (
                                        <tr key={member._id}>
                                            <td> {(pagination.page - 1) * pagination.limit + index + 1}.</td>
                                            <td>{member.name}</td>
                                            <td>{member.chapterInfo?.chapterId?.chapterName}</td>
                                            <td>{member.personalDetails.companyName}</td>
                                            <td>
                                                <span className="text-md mb-0 fw-normal text-secondary-light">
                                                    {member.personalDetails.categoryRepresented}
                                                </span>
                                            </td>
                                            <td>{member.contactDetails.mobileNumber}</td>
                                            <td className="text-center">
                                                <select
                                                    disabled={!hasPermission("associates-update")}
                                                    className={`form-select newonee form-select-sm w-auto radius-12 h-40-px custom-status-select ${member.status === "active"
                                                        ? "status-activate"
                                                        : member.status === "decline"
                                                            ? "status-decline"
                                                            : ""
                                                        }`}
                                                    value={member.status}
                                                    onChange={(e) =>
                                                        handleStatusChange(member._id, e.target.value)
                                                    }
                                                >
                                                    <option value="">Select Action</option>
                                                    <option value="active">Activate</option>
                                                    <option value="decline">Decline</option>
                                                </select>
                                            </td>
                                            <td className="text-center">
                                                <div className="d-flex align-items-center gap-10 justify-content-center">
                                                    {hasPermission("associates-list") && (
                                                        <button
                                                            type="button"
                                                            className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                            onClick={() => handleViewMember(member)}
                                                        >
                                                            <Icon
                                                                icon="majesticons:eye-line"
                                                                className="icon text-xl"
                                                            />
                                                        </button>
                                                    )}
                                                    {hasPermission("associates-update") && (
                                                        <button
                                                            type="button"
                                                            className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                            onClick={() => handleEditMember(member._id)}
                                                        >
                                                            <Icon icon="lucide:edit" className="menu-icon" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}
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

            {/* Member Details Modal */}
            <Modal
                show={showMemberModal}
                onHide={() => setShowMemberModal(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Associate Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedMember && (
                        <div className="row g-4">
                            {/* Left Column */}
                            <div className="col-md-6">
                                {/* Personal Information */}
                                <div className="card mb-3 p-3 shadow-sm">
                                    <h6 className="text-muted mb-3">Personal Information</h6>
                                    <dl className="row mb-0">
                                        <dt className="col-5">Name:</dt>
                                        <dd className="col-7">{selectedMember.name}</dd>

                                        <dt className="col-5">Date of Birth:</dt>
                                        <dd className="col-7">
                                            {new Date(selectedMember.personalDetails.dob).toLocaleDateString()}
                                        </dd>

                                        <dt className="col-5">Education:</dt>
                                        <dd className="col-7">{selectedMember.personalDetails.education}</dd>
                                    </dl>
                                </div>

                                {/* Chapter Information */}
                                <div className="card mb-3 p-3 shadow-sm">
                                    <h6 className="text-muted mb-3">Chapter Information</h6>
                                    <dl className="row mb-0">
                                        <dt className="col-5">Chapter:</dt>
                                        <dd className="col-7">{selectedMember.chapterInfo?.chapterId?.chapterName}</dd>

                                        <dt className="col-5">Zone:</dt>
                                        <dd className="col-7">{selectedMember.chapterInfo?.zoneId?.zoneName}</dd>

                                        <dt className="col-5">Invited By:</dt>
                                        <dd className="col-7">{selectedMember.chapterInfo?.whoInvitedYou}</dd>
                                    </dl>
                                </div>

                                {/* Business Information */}
                                <div className="card mb-3 p-3 shadow-sm">
                                    <h6 className="text-muted mb-3">Business Information</h6>
                                    <dl className="row mb-0">
                                        <dt className="col-5">Company:</dt>
                                        <dd className="col-7">{selectedMember.personalDetails.companyName}</dd>

                                        <dt className="col-5">Industry:</dt>
                                        <dd className="col-7">{selectedMember.personalDetails.industry}</dd>

                                        <dt className="col-5">Category:</dt>
                                        <dd className="col-7">{selectedMember.personalDetails.categoryRepresented}</dd>

                                        <dt className="col-5">Years in Business:</dt>
                                        <dd className="col-7">
                                            {selectedMember.businessDetails.yearsInBusiness
                                                .replace(/_/g, " ")
                                                .replace(/(\d+)\s+(\d+)/, "$1 to $2")}

                                        </dd>
                                    </dl>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="col-md-6">
                                {/* Contact Details */}
                                <div className="card mb-3 p-3 shadow-sm">
                                    <h6 className="text-muted mb-3">Contact Details</h6>
                                    <dl className="row mb-0">
                                        <dt className="col-5">Email:</dt>
                                        <dd className="col-7">{selectedMember.contactDetails.email}</dd>

                                        <dt className="col-5">Mobile:</dt>
                                        <dd className="col-7">{selectedMember.contactDetails.mobileNumber}</dd>

                                        <dt className="col-5">Secondary Phone:</dt>
                                        <dd className="col-7">{selectedMember.contactDetails.secondaryPhone}</dd>

                                        <dt className="col-5">Website:</dt>
                                        <dd className="col-7">{selectedMember.contactDetails.website}</dd>

                                        <dt className="col-5">GST Number:</dt>
                                        <dd className="col-7">{selectedMember.contactDetails.gstNumber}</dd>
                                    </dl>
                                </div>

                                {/* Business Address */}
                                <div className="card mb-3 p-3 shadow-sm">
                                    <h6 className="text-muted mb-3">Business Address</h6>
                                    <address className="mb-0">
                                        {selectedMember.businessAddress.addressLine1}<br />
                                        {selectedMember.businessAddress.addressLine2 && (
                                            <>
                                                {selectedMember.businessAddress.addressLine2}<br />
                                            </>
                                        )}
                                        {selectedMember.businessAddress.city}, {selectedMember.businessAddress.state}<br />
                                        Postal Code: {selectedMember.businessAddress.postalCode}
                                    </address>
                                </div>

                                {/* Business References */}
                                {selectedMember.businessReferences?.length > 0 && (
                                    <div className="card mb-3 p-3 shadow-sm">
                                        <h6 className="text-muted mb-3">Business References</h6>
                                        <ul className="list-unstyled mb-0">
                                            {selectedMember.businessReferences.map((ref, idx) => (
                                                <li key={idx} className="mb-2 border-bottom pb-2">
                                                    <strong>{ref.firstName} {ref.lastName}</strong><br />
                                                    Business: {ref.businessName}<br />
                                                    Phone: {ref.phoneNumber}<br />
                                                    Relationship: {ref.relationship}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowMemberModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>


            {/* Password Reset Modal */}
            <Modal
                show={resetStep > 0}
                onHide={() => setResetStep(0)}
                backdrop="static"
                centered
                dialogClassName="custom-reset-modal"
            >
                <Modal.Body className="p-50 text-center" style={{ fontSize: "0.9rem" }}>
                    {resetStep === 1 && (
                        <>
                            <h6 className="mb-5">Enter Mobile Number</h6>
                            <input
                                type="text"
                                className="form-control mb-3 mx-auto shadow-sm border border-secondary rounded"
                                style={{ maxWidth: "300px" }}
                                placeholder="Mobile Number"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                            />
                            <Button variant="primary grip" onClick={handleSendOtp}>
                                Send OTP
                            </Button>
                        </>
                    )}

                    {resetStep === 2 && (
                        <>
                            <h6 className="mb-5">Enter OTP</h6>
                            <input
                                type="text"
                                className="form-control mb-3 mx-auto shadow-sm border border-secondary rounded"
                                style={{ maxWidth: "300px" }}
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                            <Button variant="primary grip" onClick={handleVerifyOtp}>
                                Verify OTP
                            </Button>
                        </>
                    )}

                    {resetStep === 3 && (
                        <>
                            <h6 className="mb-5">Reset Password</h6>
                            <input
                                type="text"
                                className="form-control mb-3 mx-auto shadow-sm border border-secondary rounded"
                                style={{ maxWidth: "300px" }}
                                placeholder="User Name"
                                value="Anbu"
                                readOnly
                            />
                            <input
                                type="password"
                                className="form-control mb-3 pb-2 mx-auto shadow-sm border border-secondary rounded"
                                style={{ maxWidth: "300px" }}
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                className="form-control mb-3 pb-2 mx-auto shadow-sm border border-secondary rounded"
                                style={{ maxWidth: "300px" }}
                                placeholder="Repeat Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <Button variant="success grip" onClick={handleSavePassword}>
                                Save
                            </Button>
                        </>
                    )}

                    {resetStep === 4 && (
                        <div>
                            <h6 className="mb-2">Password changed successfully!</h6>
                            <p>Redirecting to login...</p>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            <style>{`
                select.no-arrow {
                    background-image: none !important;
                }
                .status-activate {
                    background-color: #e8f5e9;
                    color: #2e7d32;
                }
                .status-decline {
                    background-color: #ffebee;
                    color: #c62828;
                }
            `}</style>
        </div>
    );
};

export default UserRegisterMemberListLayer;

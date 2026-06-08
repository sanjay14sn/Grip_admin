import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom';
import chapterApiProvider from '../../apiProvider/chapterApi';
import { toast, ToastContainer } from 'react-toastify';
import { hasDeletePermission } from '../../utils/auth';
import Swal from 'sweetalert2';

const ReferralListLayer = () => {

    const [chapterMembers, setchapterMembers] = useState([]);
    const [chapterName, setChapterName] = useState("");

    const { id } = useParams();

    // ✅ PAGINATION STATE
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    });

    // ✅ UPDATED API CALL WITH PAGE + LIMIT
    const fetchChapters = async (id) => {
        try {
            const input = {
                page: pagination.page,
                limit: pagination.limit
            };

            const response = await chapterApiProvider.refferalListMember(id, input);

            const listData = response?.response?.data?.records || [];
            const paginationData = response?.response?.data?.pagination || {};
            const chapter = response?.response?.data?.chapter;

            setchapterMembers(listData);
            setChapterName(chapter?.chapterName || "-");

            setPagination((prev) => ({
                ...prev,
                total: paginationData.total || 0,
                totalPages: Math.ceil((paginationData.total || 0) / prev.limit),
            }));

        } catch (error) {
            console.error("Error fetching chapters:", error);
        }
    };

    useEffect(() => {
        fetchChapters(id);
    }, [id, pagination.page]);

    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const deleteReferralSlip = async (referralSlipId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `You are about to delete the referral slip . This action cannot be undone!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            width: "400px",
        });

        if (result.isConfirmed) {
            try {
                const response = await chapterApiProvider.deleteReferralSlipById(referralSlipId);

                if (response && response.status) {
                    await Swal.fire(
                        "Deleted!",
                        `The referral slip has been deleted successfully.`,
                        "success"
                    );

                    fetchChapters(id);
                } else {
                    throw new Error(response?.response?.message || "Failed to delete referral slip record.");
                }
            } catch (error) {
                await Swal.fire(
                    "Error!",
                    error.message || "Something went wrong while deleting.",
                    "error"
                );
            }
        }
    };

    const handleShowImage = (image) => {
        setSelectedImage(image);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedImage('');
    };

    const handleStatusChange = async (status, recordId) => {
        if (!status) return;
        try {
            let input = {
                status: status,
                id: recordId,
                formName: "referralslip"
            }
            const response = await chapterApiProvider.changeStatus(input);

            if (response) {
                toast("status updated successfully")
                fetchChapters(id);
            } else {
                toast("failed to update status")
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination((prev) => ({ ...prev, page: newPage }));
        }
    };

    return (
        <div className="col-xxl-12 col-xl-12">
            <div className="card h-100 p-0 radius-12">
                <div className="card-body p-24">
                    <div className="table-responsive scroll-sm">
                        <table className="table bordered-table sm-table mb-0">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Date</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Chapter Name</th>
                                    <th>Referral Name</th>
                                    <th>Referral Number</th>
                                    <th>Comments</th>

                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {chapterMembers?.map((referral, index) => (
                                    <tr key={referral._id}>
                                        <td>{(pagination.page - 1) * pagination.limit + index + 1}.</td>
                                        <td>{new Date(referral.createdAt).toLocaleDateString()}</td>

                                        <td>{referral.fromMember.name}</td>
                                        <td>{referral.toMember.name}</td>

                                        <td>{chapterName}</td>

                                        <td>{referral.referalDetails.name}</td>
                                        <td>{referral.referalDetails.mobileNumber}</td>
                                        <td>{referral.referalDetails.comments}</td>



                                        <td>
                                            {hasDeletePermission("delete") && (
                                                <button
                                                    type="button"
                                                    className="bg-danger-focus text-danger-600 bg-hover-danger-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                    onClick={() => deleteReferralSlip(referral._id)}
                                                >
                                                    <Icon icon="mdi:trash-can-outline" className="menu-icon" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <ToastContainer />
                    </div>

                    {/* ✅ PAGINATION UI */}
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

                    {/* Image Modal */}
                    <Modal show={showModal} onHide={handleClose} centered>
                        <Modal.Body className="text-center">
                            <img src={selectedImage} alt="Profile" className="img-fluid" />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>

                </div>
            </div>
        </div>
    );
};

export default ReferralListLayer;

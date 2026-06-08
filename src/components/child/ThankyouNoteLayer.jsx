import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import chapterApiProvider from '../../apiProvider/chapterApi';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import { hasDeletePermission } from '../../utils/auth';

const ThankyouNoteLayer = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [chapterMembers, setchapterMembers] = useState({});
    
    const { id } = useParams();

    // ✅ PAGINATION STATE (ONLY NEW ADDITION)
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    });

    const handleClose = () => {
        setShowModal(false);
        setSelectedImage('');
    };

    // ✅ UPDATED FETCH WITH PAGE & LIMIT
    const fetchChapters = async (id) => {
        try {
            const input = {
                page: pagination.page,
                limit: pagination.limit
            };

            const response = await chapterApiProvider.thankYouSlipListMember(id, input);

            const listData = response?.response?.data?.records || [];
            const paginationData = response?.response?.data?.pagination || {};

            setchapterMembers(response?.response?.data || {});

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

    const deleteThankYouSlip = async (thankYouSlipId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `You are about to delete the Thank You Slip. This action cannot be undone!`,
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
                const response = await chapterApiProvider.deleteThankYouSlipById(thankYouSlipId);

                if (response && response.status) {
                    await Swal.fire(
                        "Deleted!",
                        `The Thank You Slip has been deleted successfully.`,
                        "success"
                    );

                    fetchChapters(id);
                } else {
                    throw new Error(response?.response?.message || "Failed to delete record.");
                }
            } catch (error) {
                await Swal.fire(
                    "Error!",
                    error.message || "Something went wrong.",
                    "error"
                );
            }
        }
    };

    const handleStatusChange = async (status, recordId) => {
        if (!status) return;
        try {
            let input = {
                status: status,
                id: recordId,
                formName: "thankyouslips"
            };

            const response = await chapterApiProvider.changeStatus(input);

            if (response) {
                toast("Status updated successfully");
                fetchChapters(id);
            } else {
                toast("Failed to update status");
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
                                    <th>Value</th>
                                    <th>Chapter</th>
                                    <th>Comments</th>

                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {chapterMembers?.records?.map((item, index) => (
                                    <tr key={item._id}>
                                        {/* 🔥 Updated S.No — Correct with Pagination */}
                                        <td>{(pagination.page - 1) * pagination.limit + index + 1}.</td>

                                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                        <td>{item.fromMember.name}</td>
                                        <td>{item.toMember.name}</td>
                                        <td>{item.amount}</td>

                                        <td>
                                            <div>{chapterMembers?.chapter?.chapterName}</div>
                                            <small className="text-muted">
                                                Zone: {chapterMembers?.chapter?.zoneName}
                                            </small>
                                        </td>

                                        <td>{item.comments}</td>



                                        <td>
                                            {hasDeletePermission("delete") && (
                                                <button
                                                    type="button"
                                                    className="bg-danger-focus text-danger-600 bg-hover-danger-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                    onClick={() => deleteThankYouSlip(item._id)}
                                                >
                                                    <Icon icon="mdi:trash-can-outline" className="menu-icon" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ✅ PAGINATION UI (Simple, clean) */}
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

                    <Modal show={showModal} onHide={handleClose} centered>
                        <Modal.Body className="text-center">
                            <img src={selectedImage} alt="Popup" className="img-fluid" />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default ThankyouNoteLayer;

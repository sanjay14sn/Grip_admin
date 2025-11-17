import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom';
import chapterApiProvider from '../apiProvider/chapterApi';
import { IMAGE_BASE_URL } from '../network/apiClient';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { hasDeletePermission } from '../utils/auth';

const TestimonialLayer = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState('');

    const handleShowDoc = (docUrl) => {
        setSelectedDoc(docUrl);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedDoc('');
    };

    const [chapterMembers, setchapterMembers] = useState([]);

    const isImage = (url) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url || '');
    const isPdf = (url) => /\.(pdf)$/i.test(url || '');

    const { id } = useParams();

    // ------------------ PAGINATION STATE ------------------
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    });

    // ------------------ FETCH WITH PAGINATION ------------------
    const fetchChapters = async (id) => {
        try {
            const input = {
                page: pagination.page,
                limit: pagination.limit
            };

            const response = await chapterApiProvider.testimonialSlipListMember(id, input);

            const mainData = response?.response?.data;
            const paginationData = mainData?.pagination || {};

            // your original state setter
            setchapterMembers(mainData);

            // update pagination
            setPagination((prev) => ({
                ...prev,
                total: paginationData.total || 0,
                totalPages: Math.ceil((paginationData.total || 0) / pagination.limit),
            }));
        } catch (error) {
            console.error("Error fetching chapters:", error);
        }
    };

    useEffect(() => {
        fetchChapters(id);
    }, [id, pagination.page]);

    const deleteTestimonial = async (testimonialId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `You are about to delete this Testimonial. This action cannot be undone!`,
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
                const response = await chapterApiProvider.deleteTestimonialById(testimonialId);

                if (response && response.status) {
                    await Swal.fire(
                        "Deleted!",
                        `The testimonial has been deleted successfully.`,
                        "success"
                    );
                    fetchChapters(id);
                } else {
                    throw new Error(response?.response?.message || "Failed to delete testimonial record.");
                }
            } catch (error) {
                await Swal.fire(
                    "Error!",
                    error.message || "Something went wrong while deleting the testimonial record.",
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
                formName: "testimonialslips"
            };
            const response = await chapterApiProvider.changeStatus(input);

            if (response) {
                toast("status updated successfully");
                fetchChapters(id);
            } else {
                toast("failed to update status");
                fetchChapters(id);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
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
                                    <th>Testimonial to</th>
                                    <th>Chapter</th>
                                    <th>Comments</th>
                                    <th>Uploaded Doc</th>
                                    <th>Approval</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {chapterMembers?.records?.map((item, index) => (
                                    <tr key={item._id}>
                                        <td>{index + 1}.</td>
                                        <td>{new Date(item.createdAt).toLocaleDateString('en-IN')}</td>

                                        <td>
                                            <div className="d-flex flex-column">
                                                <span>{item.fromMember.name}</span>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="d-flex flex-column">
                                                <span>{item.toMember.name}</span>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="d-flex flex-column">
                                                <span>{chapterMembers?.chapter?.chapterName}</span>
                                                <small className="text-muted">{chapterMembers?.chapter?.zoneName}</small>
                                            </div>
                                        </td>

                                        <td>{item.comments || '-'}</td>

                                        <td>
                                            {item.images?.length > 0 ? (
                                                <button
                                                    className="btn btn-sm btn-outline-info"
                                                    onClick={() =>
                                                        handleShowDoc(
                                                            `${IMAGE_BASE_URL}/${item.images[0].docPath}/${item.images[0].docName}`
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>
                                            ) : (
                                                <span className="text-muted">No document</span>
                                            )}
                                        </td>

                                        <td>
                                            <select
                                                className="form-select form-select-sm w-auto"
                                                onChange={(e) => handleStatusChange(e.target.value, item._id)}
                                                value={item.status || ""}
                                            >
                                                <option value="">Select Action</option>
                                                <option value="approve">Approve</option>
                                                <option value="reject">Reject</option>
                                            </select>
                                        </td>

                                        <td>
                                            {hasDeletePermission("delete") && (
                                                <button
                                                    type="button"
                                                    className="bg-danger-focus text-danger-600 bg-hover-danger-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                    onClick={() => deleteTestimonial(item._id)}
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

                    {/* 🔥 PAGINATION UI */}
                    <div className="d-flex justify-content-end align-items-center mt-3 gap-3">

                        <button
                            className="btn btn-outline-primary"
                            disabled={pagination.page === 1}
                            onClick={() =>
                                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                            }
                        >
                            Previous
                        </button>

                        <span className="badge bg-danger text-white px-3 py-2">
                            {pagination.page}
                        </span>

                        <button
                            className="btn btn-outline-primary"
                            disabled={pagination.page === pagination.totalPages}
                            onClick={() =>
                                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                            }
                        >
                            Next
                        </button>
                    </div>

                    {/* Document Modal */}
                    <Modal show={showModal} onHide={handleClose} size="m" centered>
                        <Modal.Body className="text-center p-0">
                            {isImage(selectedDoc) ? (
                                <img src={selectedDoc} alt="Document" className="img-fluid" />
                            ) : (
                                (() => {
                                    if (selectedDoc) {
                                        window.open(selectedDoc, "_blank");
                                        handleClose();
                                    }
                                    return null;
                                })()
                            )}
                        </Modal.Body>
                    </Modal>

                </div>
            </div>
        </div>
    );
};

export default TestimonialLayer;

import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom';
import chapterApiProvider from '../apiProvider/chapterApi';
import { IMAGE_BASE_URL } from '../network/apiClient';
import { toast } from 'react-toastify';
import { hasDeletePermission } from "../utils/auth";
import Swal from 'sweetalert2';

const UsersListLayer = () => {

    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [chapterMembers, setchapterMembers] = useState([]);

    const { id } = useParams();

    // 🔥 PAGINATION STATE ADDED
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    });

    const handleShowImage = (image) => {
        setSelectedImage(image);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedImage('');
    };
    const [chapterName, setChapterName] = useState("");
    // 🔥 UPDATED API CALL (NOW SENDS PAGE + LIMIT)
    const fetchChapters = async (id) => {
        try {
            const input = {
                page: pagination.page,
                limit: pagination.limit
            };

            const response = await chapterApiProvider.onetooneSlipListMember(id, input);

            const listData = response?.response?.data?.records || [];
            const paginationData = response?.response?.data?.pagination || {};
            const chapter = response?.response?.data?.chapter;   // 👈 ADD THIS

            setchapterMembers(listData); // this stays SAME

            setChapterName(chapter?.chapterName || "-");  // 👈 STORE ONLY CHAPTER NAME

            setchapterMembers(listData);

            setPagination((prev) => ({
                ...prev,
                total: paginationData.total || 0,
                totalPages: Math.ceil((paginationData.total || 0) / prev.limit),
            }));

        } catch (error) {
            console.error("Error fetching chapters:", error);
        }
    };

    const deleteOneToOne = async (oneToOneId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `You are about to delete the one-to-one record. This action cannot be undone!`,
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
                const response = await chapterApiProvider.deleteOneToOneById(oneToOneId);

                if (response && response.status) {
                    await Swal.fire("Deleted!", `Record deleted successfully.`, "success");
                    fetchChapters(id);
                } else {
                    throw new Error("Failed to delete record.");
                }
            } catch (error) {
                await Swal.fire("Error!", error.message || "Something went wrong.", "error");
            }
        }
    };

    const handleStatusChange = async (status, recordId) => {
        try {
            let input = {
                status: status,
                id: recordId,
                formName: "onetoone"
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
        }
    };

    // 🔥 REFETCH WHEN PAGE CHANGES
    useEffect(() => {
        fetchChapters(id);
    }, [id, pagination.page]);

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-body p-24">
                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Date</th>
                                <th>From</th>
                                <th>121 To</th>
                                <th>Where</th>
                                <th>Chapter Name</th>
                                <th>Photo</th>
                                <th>Approval</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {chapterMembers?.map((item, index) => (
                                <tr key={item._id}>
                                    <td>{(pagination.page - 1) * pagination.limit + index + 1}.</td>
                                    <td>{new Date(item.date).toLocaleDateString('en-IN')}</td>

                                    <td>{item.fromMember?.name || 'N/A'}</td>

                                    <td>{item.toMember?.name || 'N/A'}</td>

                                    <td>
                                        {item.whereDidYouMeet
                                            ? item.whereDidYouMeet.charAt(0).toUpperCase() + item.whereDidYouMeet.slice(1).toLowerCase()
                                            : '-'}
                                    </td>

                                    <td>{chapterName||'-'}</td>

                                    <td>
                                        {item.images?.length > 0 ? (
                                            <button
                                                className="btn btn-sm btn-outline-info"
                                                onClick={() =>
                                                    handleShowImage(
                                                        `${IMAGE_BASE_URL}/${item.images[0].docPath}/${item.images[0].docName}`
                                                    )
                                                }
                                            >
                                                View
                                            </button>
                                        ) : (
                                            <span className="text-muted">No Image</span>
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
                                                onClick={() => deleteOneToOne(item._id)}
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

                {/* Image Modal */}
                <Modal show={showModal} onHide={handleClose} centered>
                    <Modal.Body className="text-center">
                        <img src={selectedImage} alt="Profile" className="img-fluid" />
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
};

export default UsersListLayer;

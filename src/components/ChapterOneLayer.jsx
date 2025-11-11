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

    const handleShowImage = (image) => {
        setSelectedImage(image);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedImage('');
    };
    const [chapterMembers, setchapterMembers] = useState([])
    const { id } = useParams();
    const fetchChapters = async (id) => {
        try {
            const response = await chapterApiProvider.onetooneSlipListMember(id);
            console.log(response, "responce-chapterApiProvider");
            setchapterMembers(response?.response?.data)

        } catch (error) {
            console.error("Error fetching chapters:", error);
            // Handle the error (e.g., show error message to user)
        }
    };
    const deleteOneToOne = async (oneToOneId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `You are about to delete the  oneToOneTopic. This action cannot be undone!`,
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
                const response = await chapterApiProvider.deleteOneToOneById(oneToOneId);

                if (response && response.status) {
                    await Swal.fire(
                        "Deleted!",
                        `The One-to-One  has been deleted.`,
                        "success"
                    );

                    // Refresh the list after successful deletion
                   fetchChapters(id);
                } else {
                    throw new Error(response?.response?.message || "Failed to delete One-to-One record.");
                }
            } catch (error) {
                await Swal.fire(
                    "Error!",
                    error.message || "Something went wrong while deleting the One-to-One record.",
                    "error"
                );
            }
        }
    };
    useEffect(() => {
        fetchChapters(id);
        console.log(chapterMembers, "chapters")

    }, [id]);
    const handleStatusChange = async (status, recordId) => {
        console.log(status, "status", recordId, "recordId")
        if (!status) return;
        try {
            let input = {
                status: status,
                id: recordId,
                formName: "onetoone"
            }
            const response = await chapterApiProvider.changeStatus(input);
            console.log(response, "responce-chapterApiProvider");
            // Handle success
            if (response) {
                toast("status updated successfully")
                fetchChapters(id);
            }
            else {
                toast("failed to update status")
                fetchChapters(id);
            }

        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        } finally {
        }
    };
    return (
        <div className="card h-100 p-0 radius-12">
            {/* <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between"> */}
            {/* <div className="d-flex align-items-center flex-wrap gap-3"> */}
            {/* <form className="navbar-search">
                        <input
                            type="text"
                            className="bg-base h-40-px w-auto"
                            name="search"
                            placeholder="Search"
                        />
                        <Icon icon="ion:search-outline" className="icon" />
                    </form> */}


            {/* </div> */}

            {/* <div className="d-flex align-items-center flex-wrap gap-3"> */}

            {/* <select className="form-select form-select-sm w-auto" defaultValue="Select Number">
                        <option value="Select Number" disabled>
                            Select Chapter
                        </option>
                        <option value="10">GRIP Aram</option>
                        <option value="15">GRIP Virutcham</option>
                        <option value="20">GRIP Madhuram</option>
                        <option value="20">GRIP Kireedam</option>
                        <option value="20">GRIP Amudham</option>

                    </select> */}

            {/* <select className="form-select form-select-sm w-auto" defaultValue="Select Number">
                        <option value="Select Number" >
                            This Week
                        </option>
                        <option value="10">This Month</option>
                        <option value="15">Last Week</option>
                        <option value="20">Last Month</option>
                        <option value="20">This Term</option>


                    </select>

                </div>
            </div> */}
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
                            {chapterMembers?.records?.map((item, index) => (
                                <tr key={item._id}>
                                    <td>{index + 1}.</td>
                                    <td>{new Date(item.date).toLocaleDateString('en-IN')}</td>
                                    <td>
                                        {item.fromMember?.name || 'N/A'}
                                    </td>
                                    <td>
                                        <span className="text-md mb-0 fw-normal text-secondary-light">
                                            {item.toMember?.name || 'N/A'}
                                        </span>
                                    </td>
                                    <td>
                                        {item.whereDidYouMeet
                                            ? item.whereDidYouMeet.charAt(0).toUpperCase() + item.whereDidYouMeet.slice(1).toLowerCase()
                                            : '-'}
                                    </td>

                                    <td>
                                        {chapterMembers.chapter?.chapterName || '-'}
                                    </td>
                                    <td>
                                        {item.images?.length > 0 ? (
                                            <button
                                                className="btn btn-sm btn-outline-info"
                                                onClick={() => handleShowImage(`${IMAGE_BASE_URL}/${item.images[0].docPath}/${item.images[0].docName}`)}
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
                                            value={item.status || ""}  // Set default to empty or current status
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
                                                <Icon
                                                    icon="mdi:trash-can-outline"
                                                    className="menu-icon"
                                                />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Image Modal */}
                <Modal show={showModal} onHide={handleClose} centered>
                    <Modal.Body className="text-center">
                        <img src={selectedImage} alt="Profile" className="img-fluid" />
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default UsersListLayer;

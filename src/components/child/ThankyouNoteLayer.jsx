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
    const [chapterMembers, setchapterMembers] = useState([])


    const handleClose = () => {
        setShowModal(false);
        setSelectedImage('');
    };
    const { id } = useParams();

    const fetchChapters = async (id) => {
        try {
            const response = await chapterApiProvider.thankYouSlipListMember(id);
            console.log(response, "responce-chapterApiProvider");
            setchapterMembers(response?.response?.data)
            // You can set the response to state here if needed
        } catch (error) {
            console.error("Error fetching chapters:", error);
            // Handle the error (e.g., show error message to user)
        }
    };
    useEffect(() => {
        fetchChapters(id);
    }, [id]);
    console.log(chapterMembers, "chapterMembers")

    const deleteThankYouSlip = async (thankYouSlipId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `You are about to delete the Thank You Slip . This action cannot be undone!`,
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
                // Make backend call
                const response = await chapterApiProvider.deleteThankYouSlipById(thankYouSlipId);

                if (response && response.status) {
                    await Swal.fire(
                        "Deleted!",
                        `The Thank You Slip  has been deleted successfully.`,
                        "success"
                    );

                    // Refresh the list after successful deletion
                    fetchChapters(id);
                } else {
                    throw new Error(response?.response?.message || "Failed to delete Thank You Slip record.");
                }
            } catch (error) {
                await Swal.fire(
                    "Error!",
                    error.message || "Something went wrong while deleting the Thank You Slip record.",
                    "error"
                );
            }
        }
    };


    const handleStatusChange = async (status, recordId) => {
        console.log(status, "status", recordId, "recordId")
        if (!status) return;
        try {
            let input = {
                status: status,
                id: recordId,
                formName: "thankyouslips"
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
        <div className="col-xxl-12 col-xl-12">
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
                                    <th>To</th>
                                    <th>Value</th>
                                    <th>Chapter</th>
                                    <th>Comments</th>
                                    <th>Approval</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chapterMembers?.records?.map((item, index) => (
                                    <tr key={item._id}>
                                        <td>{index + 1}.</td>
                                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            {item.fromMember.name}
                                        </td>
                                        <td>
                                            {item.toMember.name}
                                        </td>
                                        <td>{item.amount}</td>
                                        <td>
                                            {chapterMembers && (
                                                <>
                                                    <div>{chapterMembers?.chapter?.chapterName}</div>
                                                    <small className="text-muted">Zone: {chapterMembers?.chapter?.zoneName}</small>
                                                </>
                                            )}
                                        </td>
                                        <td>{item.comments}</td>
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
                                                    onClick={() => deleteThankYouSlip(item._id)}
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

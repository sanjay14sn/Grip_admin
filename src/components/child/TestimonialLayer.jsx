import React, { useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal'; // Bootstrap modal
import Button from 'react-bootstrap/Button'; // Bootstrap button

const TestimonialLayer = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const handleShowImage = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedImage('');
    };

    const data = [
        { id: 1, invitedBy: "Elankathir", chapter: "GRIP Aram", name: "Prathap", comment: "Lorem Ipsum", image: "assets/images/user-grid/user-grid-bg1.png" },
        { id: 2, invitedBy: "Vignesh", chapter: "GRIP Virutcham", name: "Surya", comment: "Lorem Ipsum", image: "assets/images/user-grid/user-grid-bg1.png" },
        { id: 3, invitedBy: "Naresh", chapter: "GRIP Aram", name: "Ramesh", comment: "Lorem Ipsum", image: "assets/images/user-grid/user-grid-bg1.pngg" },
        { id: 4, invitedBy: "Deepak", chapter: "GRIP Virutcham", name: "Abraham", comment: "Lorem Ipsum", image: "assets/images/user-grid/user-grid-bg1.pngg" },
        { id: 5, invitedBy: "Prakash", chapter: "GRIP Virutcham", name: "Adhi", comment: "Lorem Ipsum", image: "assets/images/user-grid/user-grid-bg1.png" },
    ];

    return (
        <div className="col-xxl-12 col-xl-12">
            <div className="card h-100 p-0 radius-12">
                <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                    <form className="navbar-search">
                        <input
                            type="text"
                            className="bg-base h-40-px w-auto"
                            name="search"
                            placeholder="Search"
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
                                    <th>Invited By</th>
                                    <th>Chapter</th>
                                    <th>Name</th>
                                    <th>Comments</th>
                                    <th>Image</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}.</td>
                                        <td>{item.invitedBy}</td>
                                        <td>{item.chapter}</td>
                                        <td>{item.name}</td>
                                        <td>{item.comment}</td>
                                        <td>
                                            <button
                                                type="button"
                                                className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                onClick={() => handleShowImage(item.image)}
                                            >
                                                <Icon icon="majesticons:eye" className="icon text-xl" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Image Modal */}
                    <Modal show={showModal} onHide={handleClose} centered>

                        <Modal.Body className="text-center">
                            <img src={selectedImage} alt="Popup"  className="img-fluid" />
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

export default TestimonialLayer;

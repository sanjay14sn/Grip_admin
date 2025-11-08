import { Icon } from '@iconify/react/dist/iconify.js';
import React from 'react';
import { Link } from 'react-router-dom';

const users = [
    {
        id: 1,
        name: 'Kesavan',
        namee: 'Dhandabani',
        email: 'kesavan@gmail.com',
        phone: '9876543210',
        company: 'Iriscoders',
        status: 'Active',
    },
    {
        id: 2,
        name: 'Elankathir',
        namee: 'Muthukumar',
        email: 'kathir@gmail.com',
        phone: '8907654345',
        company: 'Brandkiter',
        status: 'Inactive',
    },
    {
        id: 3,
        name: 'Aravind',
        namee: 'Ramadas',
        email: 'aravind@mail.ru',
        phone: '7890654321',
        company: 'Topvfx',
        status: 'Active',
    },
    {
        id: 4,
        name: 'Vignesh',
        namee: 'Prathap',
        email: 'vicky@mail.ru',
        phone: '98544321456',
        company: 'Indsam',
        status: 'Active',
    },
    {
        id: 5,
        name: 'Richard',
        namee: 'Arokyam',
        email: 'richard@gmail.com',
        phone: '90443217865',
        company: 'VK Architect',
        status: 'Inactive',
    },
];

const EnquiryListLayer = () => {
    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                <div className="d-flex align-items-center flex-wrap gap-3">
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

            </div>
            <div className="card-body p-24">
                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>First Name</th>
                                <th>Last name</th>
                                <th>Email</th>
                                <th>Mobile Number</th>
                                <th>Company Name</th>

                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user.id}>
                                    <td>{index + 1}.</td>
                                    <td>{user.name}</td>
                                     <td>{user.namee}</td>
                                    <td>
                                        <span className="text-md mb-0 fw-normal text-secondary-light">
                                            {user.email}
                                        </span>
                                    </td>
                                    <td>{user.phone}</td>
                                    <td>{user.company}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EnquiryListLayer;

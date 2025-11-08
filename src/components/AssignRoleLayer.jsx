import { Icon } from '@iconify/react/dist/iconify.js';
import React from 'react';
import { Link } from 'react-router-dom';



const AssignRoleLayer = () => {

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
                    <select
                        className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
                        defaultValue="Status"
                    >
                        <option value="Status" disabled>
                            Status
                        </option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>
            <div className="card-body p-24">
                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr>
                                <th scope="col">

                                    S.No

                                </th>
                                <th scope="col">Username</th>
                                <th scope="col" className="text-center">
                                    Role Permission
                                </th>
                                <th scope="col" className="text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>


                                    01

                                </td>
                                <td>

                                    Vinodkumar

                                </td>
                                <td className="text-center">Waiter</td>
                                <td className="text-center">
                                    <div className="dropdown">
                                        <button
                                            className="btn btn-outline-primary-600 not-active px-18 py-11 dropdown-toggle toggle-icon"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            Assign Role
                                        </button>
                                        <ul className="dropdown-menu" style={{}}>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                    Waiter
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                    Manager
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                    Project Manager
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                    Game Developer
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                    Head
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                    Management
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>

                                    02

                                </td>
                                <td>

                                   Arjun

                                </td>
                                <td className="text-center">manager</td>
                                <td className="text-center">
                                    <div className="dropdown">
                                        <button
                                            className="btn btn-outline-primary-600 not-active px-18 py-11 dropdown-toggle toggle-icon"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            Assign Role
                                        </button>
                                        <ul className="dropdown-menu" style={{}}>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                    Waiter
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                    Manager
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                    Project Manager
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                    Game Developer
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                    Head
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                    Management
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>

                                    03

                                </td>
                                <td>

                                    Prakash

                                </td>
                                <td className="text-center">Project Manager</td>
                                <td className="text-center">
                                    <div className="dropdown">
                                        <button
                                            className="btn btn-outline-primary-600 not-active px-18 py-11 dropdown-toggle toggle-icon"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            Assign Role
                                        </button>
                                        <ul className="dropdown-menu" style={{}}>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                    Waiter
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                    Manager
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                    Project Manager
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                    Game Developer
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                    Head
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                    Management
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>

                                    04

                                </td>
                                <td>
                                    Kesavan
                                </td>
                                <td className="text-center">K7 Enterprise</td>
                                <td className="text-center">
                                    <div className="dropdown">
                                        <button
                                            className="btn btn-outline-primary-600 not-active px-18 py-11 dropdown-toggle toggle-icon"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            Assign Role
                                        </button>
                                        <ul className="dropdown-menu" style={{}}>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                   Founder
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                   Admin
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                   Staff
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                   ED
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                   RD
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                   President
                                                </Link>
                                            </li>
                                                 <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                   Vice President
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>

                                    05

                                </td>
                                <td>

                                    Sugarshini
                                </td>
                                <td className="text-center">Head</td>
                                <td className="text-center">
                                    <div className="dropdown">
                                        <button
                                            className="btn btn-outline-primary-600 not-active px-18 py-11 dropdown-toggle toggle-icon"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            Assign Role
                                        </button>
                                        <ul className="dropdown-menu" style={{}}>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                    Waiter
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                    Manager
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                    Project Manager
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                    Game Developer
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                    Head
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                    to="#"
                                                >
                                                    Management
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>


                        </tbody>
                    </table>
                </div>

            </div>
        </div>


    );
};

export default AssignRoleLayer;
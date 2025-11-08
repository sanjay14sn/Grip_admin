import { Icon } from '@iconify/react/dist/iconify.js';
import React from 'react';
import { Link } from 'react-router-dom';

const RolesAccessLayer = () => {
    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                <div className="d-flex align-items-center flex-wrap gap-3">
                    {/* <span className="text-md fw-medium text-secondary-light mb-0">Show</span> */}
                    {/* <select className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px" defaultValue="Select Number">
                        <option value="Select Number" disabled>
                            Select Number
                        </option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select> */}
                    <form className="navbar-search">
                        <input
                            type="text"
                            className="bg-base h-40-px w-auto"
                            name="search"
                            placeholder="Search"
                        />
                        <Icon icon="ion:search-outline" className="icon" />
                    </form>
                    {/* <select className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px" defaultValue="Select Status">
                        <option value="Select Status" disabled>
                            Select Status
                        </option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select> */}
                </div>
                <Link
                    to="/add-user"
                    className="btn btn-primary grip text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                >
                    <Icon
                        icon="ic:baseline-plus"
                        className="icon text-xl line-height-1"
                    />
                    Add Role
                </Link>
            </div>
            <div className="card-body p-24">
                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr>
                                <th scope="col">
                                    <div className="d-flex align-items-center gap-10">

                                        S.No
                                    </div>
                                </th>

                                <th scope="col">Role</th>

                                <th scope="col" className="text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="d-flex align-items-center gap-10">

                                        01
                                    </div>
                                </td>

                                <td>Iriscoders</td>

                                <td className="text-center">
                                    <div className="d-flex align-items-center gap-10 justify-content-center">

                                        <button
                                            type="button"
                                            className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                        >
                                            <Icon icon="lucide:edit" className="menu-icon" />
                                        </button>
                                        <button
                                            type="button"
                                            className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                        >
                                            <Icon
                                                icon="fluent:delete-24-regular"
                                                className="menu-icon"
                                            />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="d-flex align-items-center gap-10">

                                        02
                                    </div>
                                </td>


                                <td>Brandkiter</td>
  <td className="text-center">
                                    <div className="d-flex align-items-center gap-10 justify-content-center">

                                        <button
                                            type="button"
                                            className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                        >
                                            <Icon icon="lucide:edit" className="menu-icon" />
                                        </button>
                                        <button
                                            type="button"
                                            className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                        >
                                            <Icon
                                                icon="fluent:delete-24-regular"
                                                className="menu-icon"
                                            />
                                        </button>
                                    </div>
                                </td>

                            </tr>
                            <tr>
                                <td>
                                    <div className="d-flex align-items-center gap-10">

                                        03
                                    </div>
                                </td>

                                <td>Topvfx</td>

                                <td className="text-center">
                                    <div className="d-flex align-items-center gap-10 justify-content-center">

                                        <button
                                            type="button"
                                            className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                        >
                                            <Icon icon="lucide:edit" className="menu-icon" />
                                        </button>
                                        <button
                                            type="button"
                                            className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                        >
                                            <Icon
                                                icon="fluent:delete-24-regular"
                                                className="menu-icon"
                                            />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="d-flex align-items-center gap-10">

                                        04
                                    </div>
                                </td>


                                <td>Indsam</td>

                                <td className="text-center">
                                    <div className="d-flex align-items-center gap-10 justify-content-center">

                                        <button
                                            type="button"
                                            className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                        >
                                            <Icon icon="lucide:edit" className="menu-icon" />
                                        </button>
                                        <button
                                            type="button"
                                            className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                        >
                                            <Icon
                                                icon="fluent:delete-24-regular"
                                                className="menu-icon"
                                            />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="d-flex align-items-center gap-10">

                                        05
                                    </div>
                                </td>


                                <td>VK Architect</td>

                                <td className="text-center">
                                    <div className="d-flex align-items-center gap-10 justify-content-center">

                                        <button
                                            type="button"
                                            className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                        >
                                            <Icon icon="lucide:edit" className="menu-icon" />
                                        </button>
                                        <button
                                            type="button"
                                            className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                        >
                                            <Icon
                                                icon="fluent:delete-24-regular"
                                                className="menu-icon"
                                            />
                                        </button>
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

export default RolesAccessLayer;
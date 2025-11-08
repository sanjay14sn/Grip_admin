import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { Link } from 'react-router-dom'

const PowerDateLayer = () => {
    return (

        <div className="col-xxl-12 col-xl-12">
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
                    {/* <Link
                                    to="/add-user"
                                    className="btn btn-primary grip text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                                >
                                    <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
                                    Add New User
                                </Link> */}
                </div>
                <div className="card-body p-24">


                    <div className="table-responsive scroll-sm">
                        <table className="table bordered-table sm-table mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">S.No </th>
                                    <th scope="col">Invited By </th>

                                    <th scope="col">Chapter </th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Company Name</th>
                                    <th scope="col">Category</th>

                                    <th scope="col">Nember</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Address</th>
                                     <th scope="col">Visit Date</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1.</td>
                                    <td>

                                        Elankathir

                                    </td>

                                    <td>GRIP Aram</td>
                                    <td>Prathap</td>
                                    <td>Suthik Pvt Ltd</td>
                                    <td>Solar</td>
                                    <td>96754 38907</td>
                                    <td>prathap@gmail.com</td>
                                    <td>Anna nagar</td>
                                    <td>12 MAy 2025</td>

                                </tr>
                                <tr>
                                    <td>2.</td>
                                    <td>

                                        Vignesh

                                    </td>

                                    <td>GRIP Virutcham</td>
                                    <td>Surya</td>
                                    <td>Brigade Manufactures</td>
                                    <td>Interior</td>
                                    <td>96754 38907</td>
                                    <td>prathap@gmail.com</td>
                                    <td>KK nagar</td>
                                    <td>12 MAy 2025</td>

                                </tr>
                                <tr>
                                     <td>3.</td>
                                    <td>
                                        Naresh
                                    </td>

                                    <td>GRIP Aram</td>
                                    <td>Ramesh</td>
                                    <td>Deep Consultancy</td>
                                    <td>Recruitment</td>
                                    <td>96754 38907</td>
                                    <td>prathap@gmail.com</td>
                                    <td>Guindy</td>
                                    <td>12 MAy 2025</td>
                                </tr>
                                <tr>
                                     <td>4.</td>
                                    <td>
                                        Deepak
                                    </td>

                                    <td>GRIP Virutcham</td>
                                    <td>Abraham</td>
                                 <td>Iriscoders</td>
                                    <td>Software</td>
                                    <td>96754 38907</td>
                                    <td>prathap@gmail.com</td>
                                    <td>Adyar</td>
                                    <td>12 MAy 2025</td>
                                </tr>
                                <tr>
                                     <td>5.</td>
                                    <td>
                                        Prakash
                                    </td>

                                    <td>GRIP Virutcham</td>
                                    <td>Adhi</td>
                                    <td>Bonwiz</td>
                                    <td>Stocks</td>
                                    <td>96754 38907</td>
                                    <td>prathap@gmail.com</td>
                                    <td>Besant nagar</td>
                                    <td>12 MAy 2025</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>


                </div>
            </div>
        </div>

    )
}

export default PowerDateLayer
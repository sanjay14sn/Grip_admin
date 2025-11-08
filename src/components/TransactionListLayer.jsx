import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';




const initialMembers = [
  {
    id: 1,
    name: "Anbu",
    chapter: "GRIP Aram",
    number: "9876543210",
    purpose: "Monthly meeting fee",
    amount: "₹1000",
    transactionNo: "TXN123456",
    status: "Paid"
  },
  {
    id: 2,
    name: "Venukumar",
    chapter: "GRIP Virutcham",
    number: "8907654345",
    purpose: "Event Entry",
    amount: "₹500",
    transactionNo: "TXN234567",
    status: "Pending"
  },
  {
    id: 3,
    name: "Deepika",
    chapter: "GRIP Madhuram",
    number: "7890654321",
    purpose: "Membership Renewal",
    amount: "₹2000",
    transactionNo: "TXN345678",
    status: "Paid"
  },
  {
    id: 4,
    name: "Vignesh",
    chapter: "GRIP Kireedam",
    number: "9854432145",
    purpose: "Special Contribution",
    amount: "₹1500",
    transactionNo: "TXN456789",
    status: "Failed"
  },
  {
    id: 5,
    name: "Muthukumar",
    chapter: "GRIP Amudham",
    number: "9044321786",
    purpose: "Charity Support",
    amount: "₹3000",
    transactionNo: "TXN567890",
    status: "Paid"
  }
];


const TransactionListLayer = () => {






  const [members, setMembers] = useState(initialMembers);

  const handleStatusChange = (index, value) => {
    const updated = [...members];
    updated[index].status = value;
    setMembers(updated);
  };



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


                    </select> */}

        </div>

      </div>

      <div className="card-body p-24">
        <div className="table-responsive scroll-sm">
          <table className="table bordered-table sm-table mb-0">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>

                <th>Chapter</th>
                <th>Number</th>
                <th>Purpose</th>
                <th>Amount</th>
                <th>Transaction No</th>
                <th>Status</th>

              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr key={member.id}>
                  <td>{index + 1}.</td>
                  <td>{member.name}</td>
                  <td>{member.chapter}</td>
                  <td>{member.number}</td>
                  <td>{member.purpose}</td>
                  <td>{member.amount}</td>
                  <td>{member.transactionNo}</td>
                  <td>
                    <span
                      className={`badge ${member.status === "Paid"
                          ? "bg-success"
                          : member.status === "Pending"
                            ? "bg-warning text-dark"
                            : "bg-danger"
                        }`}
                    >
                      {member.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>


          </table>
        </div>
      </div>




    </div>
  );
};

export default TransactionListLayer;

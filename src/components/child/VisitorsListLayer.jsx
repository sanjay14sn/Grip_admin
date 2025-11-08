import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import chapterApiProvider from '../../apiProvider/chapterApi'
import { toast } from 'react-toastify'

const VisitorsListLayer = () => {

  const [chapterMembers, setchapterMembers] = useState([])
  const { id } = useParams();
  const fetchChapters = async (id) => {
    try {
      const response = await chapterApiProvider.refferalListMember(id);
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
  const handleStatusChange = async (status, recordId) => {
    console.log(status, "status", recordId, "recordId")
    if (!status) return;
    try {
      let input = {
        status: status,
        id: recordId,
        formName: "visitors"
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
        {/* <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
          <div className="d-flex align-items-center flex-wrap gap-3">
          </div>

          <div className="d-flex align-items-center flex-wrap gap-3">

            <select className="form-select form-select-sm w-auto" defaultValue="Select Number">
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
                  <th scope="col">S.No</th>
                  <th scope="col">Date</th>
                  <th scope="col">Member</th>
                  <th scope="col">Chapter</th>
                  <th scope="col">Visitor Name</th>
                  <th scope="col">Visitor Mobile</th>
                  {/* <th scope="col">Email</th> */}
                  <th scope="col">Address</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {chapterMembers?.records?.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}.</td>
                    <td>{new Date(item.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      {item.fromMember.name}
                    </td>
                    <td>
                      {chapterMembers && chapterMembers?.chapter?.chapterName}
                    </td>
                    <td>{item.referalDetails.name}</td>
                    <td>{item.referalDetails.mobileNumber}</td>
                    {/* <td>{item.referalDetails.email || '-'}</td> */}
                    <td>{item.referalDetails.address}</td>

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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  )
}

export default VisitorsListLayer
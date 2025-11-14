import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import chapterApiProvider from '../../apiProvider/chapterApi'
import { toast } from 'react-toastify'

const VisitorsListLayer = () => {

   const [chapterMembers, setChapterMembers] = useState([]);
  const [chapterInfo, setChapterInfo] = useState({});
  const { id } = useParams();
  const fetchChapters = async (id) => {
    try {
      const response = await chapterApiProvider.visitorsSlipListMember(id);
      console.log(response, "response - visitorsListMember");

      const data = response?.response?.data;
      if (data) {
        setChapterInfo(data.chapter || {});
        // handle both formats: sometimes may include 'records'
        if (Array.isArray(data.records)) {
          setChapterMembers(data.records);
        } else if (Array.isArray(data.visitors)) {
          setChapterMembers(data.visitors);
        } else {
          // if visitor data directly inside data (flat array)
          setChapterMembers(data.members || []);
        }
      }
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
        <div className="card-body p-24">
          <div className="table-responsive scroll-sm">
            <table className="table bordered-table sm-table mb-0">
              <thead>
                <tr>
                  <th scope="col">S.No</th>
                  <th scope="col">Date</th>
                  <th scope="col">Chapter</th>
                  <th scope="col">Visitor Name</th>
                  <th scope="col">Category</th>
                  <th scope="col">Company</th>
                  <th scope="col">Mobile</th>
                  <th scope="col">Email</th>
                  <th scope="col">Address</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {chapterMembers?.length > 0 ? (
                  chapterMembers.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}.</td>
                      <td>{new Date(item.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>{chapterInfo?.chapterName || '-'}</td>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>{item.company}</td>
                      <td>{item.mobile}</td>
                      <td>{item.email}</td>
                      <td>{item.address}</td>
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center text-muted">
                      No visitors found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VisitorsListLayer
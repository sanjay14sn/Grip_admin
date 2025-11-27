import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import chapterApiProvider from '../../apiProvider/chapterApi';
import { toast } from 'react-toastify';
import { hasDeletePermission } from '../../utils/auth';
import Swal from 'sweetalert2';

const VisitorsListLayer = () => {
  const [chapterMembers, setChapterMembers] = useState([]);
  const [chapterInfo, setChapterInfo] = useState({});
  const { id } = useParams();

  // 🔥 PAGINATION STATE
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

const fetchChapters = async (id) => {
  try {
    const input = {
      page: pagination.page,
      limit: pagination.limit,
    };

    const response = await chapterApiProvider.visitorsSlipListMember(id, input);
    const full = response?.response || {};

    const chapter = full.chapter || {};
    const visitors = full.data || [];  // ← IMPORTANT FIX

    setChapterInfo(chapter);
    setChapterMembers(visitors);

    const total = full.pagination?.total || visitors.length;

    setPagination((prev) => ({
      ...prev,
      total,
      totalPages: Math.ceil(total / prev.limit),
    }));

  } catch (error) {
    console.error("Error fetching chapters:", error);
  }
};

  const deleteVisitor = async (visitorId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this Visitor. This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      width: '400px',
    });

    if (result.isConfirmed) {
      try {
        const response = await chapterApiProvider.deleteVisitorById(visitorId);
        if (response && response.status) {
          await Swal.fire('Deleted!', 'The visitor has been deleted successfully.', 'success');
          fetchChapters(id);
        } else {
          throw new Error(response?.response?.message || 'Failed to delete visitor record.');
        }
      } catch (error) {
        await Swal.fire('Error!', error.message || 'Something went wrong.', 'error');
      }
    }
  };

  const handleStatusChange = async (status, recordId) => {
    if (!status) return;
    try {
      const input = { status, id: recordId, formName: 'visitors' };
      const response = await chapterApiProvider.changeStatus(input);
      if (response) {
        toast('Status updated successfully');
        fetchChapters(id);
      } else {
        toast('Failed to update status');
        fetchChapters(id);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  // 🔥 REFRESH DATA ON PAGE CHANGE
  useEffect(() => {
    fetchChapters(id);
  }, [id, pagination.page]);

return (
  <div className="col-xxl-12 col-xl-12">
    <div className="card h-100 p-0 radius-12">
      <div className="card-body p-24">
        <div className="table-responsive scroll-sm">
          <table className="table bordered-table sm-table mb-0">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Date</th>
                <th>Chapter</th>
                <th>Visitor Name</th>
                <th>Category</th>
                <th>Company</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Address</th>
                <th>Who Invited - FED</th>
                <th>Approval</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {chapterMembers?.length > 0 ? (
                chapterMembers.map((item, index) => {
                  const inviter = item.invitedBy;
                  const inviterName =
                    inviter
                      ? `${inviter.personalDetails?.firstName || ""} ${inviter.personalDetails?.lastName || ""}`.trim()
                      : "-";

                  return (
                    <tr key={item._id}>
                      <td>{(pagination.page - 1) * pagination.limit + index + 1}.</td>
                      <td>{new Date(item.createdAt).toLocaleDateString("en-IN")}</td>
                      <td>{chapterInfo?.chapterName || "-"}</td>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>{item.company}</td>
                      <td>{item.mobile}</td>
                      <td>{item.email}</td>
                      <td>{item.address}</td>

                      {/* Who invited */}
                      <td>{inviterName}</td>

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
                            onClick={() => deleteVisitor(item._id)}
                          >
                            <Icon icon="mdi:trash-can-outline" className="menu-icon" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="12" className="text-center text-muted">
                    No visitors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-end align-items-center mt-3 gap-3">
          <button
            className="btn btn-outline-primary"
            disabled={pagination.page === 1}
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
            }
          >
            Previous
          </button>

          <span className="badge bg-danger text-white px-3 py-2">
            {pagination.page}
          </span>

          <button
            className="btn btn-outline-primary"
            disabled={pagination.page === pagination.totalPages}
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
);
};

export default VisitorsListLayer;

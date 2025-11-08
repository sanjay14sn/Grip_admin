import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import memberApiProvider from "../apiProvider/memberApi";
import roleApiProvider from "../apiProvider/roleApi";
import Swal from "sweetalert2";
import { Modal, Button } from "react-bootstrap";
import { hasPermission } from "../utils/auth";

const PrimaryMemberListLayer = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (pagination.page !== 1) {
      setPagination((prev) => ({ ...prev, page: 1 }));
    } else {
      fetchMembers();
    }
    fetchRoles();
  }, [searchQuery]);

  useEffect(() => {
    fetchMembers();
  }, [pagination.page, pagination.limit]);

  const fetchMembers = async () => {
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery,
      };

      const response = await memberApiProvider.getMembers(params);
      if (response.status) {
        setMembers(response.data.data || []);
        setPagination((prev) => ({
          ...prev,
          total: response.data.pagination?.total || 0,
          totalPages: Math.ceil(
            (response.data.pagination?.total || 0) / pagination.limit
          ),
        }));
      } else {
        setError(response.data?.message || "Failed to fetch members");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await roleApiProvider.getRoles();
      if (response && response.status) {
        setRoleData(response?.response?.data || []);
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const handleStatusChange = async (memberId, value) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `You are about to ${value.toLowerCase()} this member`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Yes, ${value} it!`,
      });

      if (result.isConfirmed) {
        const response = await memberApiProvider.updateMemberStatus(memberId, {
          status: value === "Activate" ? "active" : "decline",
        });

        if (response && response.status) {
          Swal.fire(
            "Success!",
            `Member has been ${value.toLowerCase()}.`,
            "success"
          );
          fetchMembers();
        }
      }
    } catch (error) {
      console.error("Error updating member status:", error);
      Swal.fire("Error!", "Failed to update member status.", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this member",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await memberApiProvider.deleteMember(id);
        if (response.status) {
          Swal.fire("Deleted!", "Member has been deleted.", "success");
          // Refresh data after deletion
          fetchMembers();
        } else {
          throw new Error(response.data?.message || "Failed to delete member");
        }
      } catch (err) {
        Swal.fire("Error!", err.message, "error");
      }
    }
  };


  const handleEditClick = (member) => {
    setSelectedMember(member);
    setSelectedRole(member.role || "");
    setShowEditModal(true);
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleRoleSubmit = async () => {
    if (!selectedRole) {
      Swal.fire("Error!", "Please select a role", "error");
      return;
    }

    try {
      setEditLoading(true);
      let selectedRoleName = roleData.find(
        (role) => role._id === selectedRole
      )?.name;
      const payload = {
        type: selectedRole === "member" ? "member" : selectedRoleName,
        role: selectedRole === selectedRole ? selectedRole : "",
      };

      const response = await memberApiProvider.updateMemberRole(
        selectedMember._id,
        payload
      );
      if (response && response.status) {
        Swal.fire("Success!", "Member role updated successfully", "success");
        fetchMembers();
        setShowEditModal(false);
      } else {
        throw new Error(response.data?.message || "Failed to update role");
      }
    } catch (err) {
      Swal.fire("Error!", err.message, "error");
    } finally {
      setEditLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Reset to page 1 when searching
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <form className="navbar-search" onSubmit={handleSearch}>
            <input
              type="text"
              className="bg-base h-40-px w-auto"
              name="search"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Icon icon="ion:search-outline" className="icon" />
          </form>
        </div>
        {hasPermission("users-create") && (
          <Link
            to="/add-primarymember"
            className="btn btn-primary grip text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
          >
            <Icon
              icon="ic:baseline-plus"
              className="icon text-xl line-height-1"
            />
            Add New
          </Link>
        )}
      </div>

      <div className="card-body p-24">
        <div className="table-responsive scroll-sm">
          <table className="table bordered-table sm-table mb-0">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Chapter Name</th>
                <th>Role</th>
                <th>Company name</th>
                <th>Category</th>
                <th>Mobile Number</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr key={member._id}>
                  <td>
                    {(pagination.page - 1) * pagination.limit + index + 1}.
                  </td>
                  <td>
                    {member.personalDetails?.firstName}{" "}
                    {member.personalDetails?.lastName}
                  </td>
                  <td>
                    <span className="text-md mb-0 fw-normal text-secondary-light">
                      {member.chapterInfo?.chapterId?.chapterName}
                    </span>
                  </td>
                  <td>
                    {member.type
                      ? member.type.charAt(0).toUpperCase() + member.type.slice(1).toLowerCase()
                      : '-'}
                  </td>

                  <td>{member.personalDetails?.companyName}</td>
                  <td>
                    <span className="text-md mb-0 fw-normal text-secondary-light">
                      {member.personalDetails?.categoryRepresented || '-'}
                    </span>
                  </td>
                  <td>{member.contactDetails?.mobileNumber}</td>
                  <td>
                    <select
                      disabled={!hasPermission("users-update")}
                      className={`form-select newonee form-select-sm w-auto radius-12 h-40-px custom-status-select ${member.status === "active"
                        ? "status-activate"
                        : member.status === "decline"
                          ? "status-decline"
                          : ""
                        }`}
                      value={
                        member.status === "active"
                          ? "Activate"
                          : member.status === "decline"
                            ? "Decline"
                            : "Select Status"
                      }
                      onChange={(e) =>
                        handleStatusChange(member._id, e.target.value)
                      }
                    >
                      <option value="Activate">Activate</option>
                      <option value="Decline">Decline</option>
                    </select>
                  </td>
                  <td>
                    <div className="d-flex gap-10 justify-content-start">
                      {hasPermission("users-update") && (
                        <button
                          type="button"
                          className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                          onClick={() => handleEditClick(member)}
                        >
                          <Icon
                            icon="majesticons:eye-line"
                            className="icon text-xl"
                          />
                        </button>
                      )}
                      {hasPermission("users-update") && (
                        <Link to={`/edit-primarymember/${member._id}`}>
                          <button
                            type="button"
                            className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                          >
                            <Icon icon="lucide:edit" className="menu-icon" />
                          </button>
                        </Link>
                      )}
                      {hasPermission("users-delete") && (
                        <button
                          type="button"
                          className="bg-danger-focus text-danger-600 bg-hover-danger-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                          onClick={() => handleDelete(member._id)}
                        >
                          <Icon
                            icon="mdi:trash-can-outline"
                            className="menu-icon"
                          />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} entries
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-danger"
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(1)}
              >
                First
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                Previous
              </button>
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      className={`btn btn-sm ${pagination.page === pageNum
                        ? "btn btn-primary grip text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                        : "btn-outline-danger"
                        }`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}
              <button
                className="btn btn-sm btn-outline-danger"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Next
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => handlePageChange(pagination.totalPages)}
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      <div
        className="modal fade"
        id="viewModal"
        tabIndex={-1}
        aria-labelledby="viewModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-m modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border-bottom">
              <h1 className="modal-title fs-5" id="viewModalLabel">
                Member Details
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body p-24">
              {selectedMember && (
                <div className="mb-3 row">
                  <div className="col-md-6">
                    <p className="font-size-14 py-2">Name:</p>
                  </div>
                  <div className="col-md-6">
                    <span className="fw-normal text-body">
                      {selectedMember.personalDetails?.firstName}{" "}
                      {selectedMember.personalDetails?.lastName}
                    </span>
                  </div>

                  <div className="col-md-6">
                    <p className="font-size-14 py-2">Chapter Name:</p>
                  </div>
                  <div className="col-md-6">
                    <span className="fw-normal text-body">
                      {selectedMember.chapterInfo?.chapterId?.chapterName}
                    </span>
                  </div>

                  <div className="col-md-6">
                    <p className="font-size-14 py-2">Company Name:</p>
                  </div>
                  <div className="col-md-6">
                    <span className="fw-normal text-body">
                      {selectedMember.personalDetails?.companyName}
                    </span>
                  </div>

                  <div className="col-md-6">
                    <p className="font-size-14 py-2">Category:</p>
                  </div>
                  <div className="col-md-6">
                    <span className="fw-normal text-body">
                      {selectedMember.personalDetails?.categoryRepresented || '-'}
                    </span>
                  </div>

                  <div className="col-md-6">
                    <p className="font-size-14 py-2">Mobile Number:</p>
                  </div>
                  <div className="col-md-6">
                    <span className="fw-normal text-body">
                      {selectedMember.contactDetails?.mobileNumber}
                    </span>
                  </div>

                  <div className="col-md-6">
                    <p className="font-size-14 py-2">Email:</p>
                  </div>
                  <div className="col-md-6">
                    <span className="fw-normal text-body">
                      {selectedMember.contactDetails?.email}
                    </span>
                  </div>

                  <div className="col-md-6">
                    <p className="font-size-14 py-2">Status:</p>
                  </div>
                  <div className="col-md-6">
                    <span className="fw-normal text-body">
                      {selectedMember.status || "Not Set"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Role Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Member Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMember && (
            <div className="mb-3 row">
              <div className="col-md-6">
                <p className="font-size-14 py-2">Name:</p>
              </div>
              <div className="col-md-6">
                <span className="fw-normal text-body">
                  {selectedMember.personalDetails?.firstName}{" "}
                  {selectedMember.personalDetails?.lastName}
                </span>
              </div>

              <div className="col-md-6">
                <p className="font-size-14 py-2">Chapter Name:</p>
              </div>
              <div className="col-md-6">
                <span className="fw-normal text-body">
                  {selectedMember.chapterInfo?.chapterId?.chapterName}
                </span>
              </div>

              <div className="col-md-6">
                <p className="font-size-14 py-2">Company Name:</p>
              </div>
              <div className="col-md-6">
                <span className="fw-normal text-body">
                  {selectedMember.personalDetails?.companyName}
                </span>
              </div>

              <div className="col-md-6">
                <p className="font-size-14 py-2">Category:</p>
              </div>
              <div className="col-md-6">
                <span className="fw-normal text-body">
                  {selectedMember.personalDetails?.categoryRepresented || '-'}
                </span>
              </div>

              <div className="col-md-6">
                <p className="font-size-14 py-2">Mobile Number:</p>
              </div>
              <div className="col-md-6">
                <span className="fw-normal text-body">
                  {selectedMember.contactDetails?.mobileNumber}
                </span>
              </div>

              <div className="col-md-6">
                <p className="font-size-14 py-2">Email:</p>
              </div>
              <div className="col-md-6">
                <span className="fw-normal text-body">
                  {selectedMember.contactDetails?.email}
                </span>
              </div>

              <div className="col-md-6">
                <p className="font-size-14 py-2">Status:</p>
              </div>
              <div className="col-md-6">
                <span className="fw-normal text-body">
                  {selectedMember.status
                    ? selectedMember.status.charAt(0).toUpperCase() + selectedMember.status.slice(1).toLowerCase()
                    : "Not Set"}

                </span>
              </div>

              <div className="col-md-6">
                <p className="font-size-14 py-2">Role:</p>
              </div>
              <div className="col-md-6">
                <select
                  className="form-select form-select-sm"
                  value={selectedRole}
                  onChange={handleRoleChange}
                >
                  <option value="member">Member</option>
                  {roleData
                    .filter((role) => !["admin", "cid", "mentor"].includes(role.name.toLowerCase()))
                    .map((role) => (
                      <option key={role._id} value={role._id}>
                        {role.name}
                      </option>
                    ))}
                </select>
              </div>

            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleRoleSubmit}
            disabled={editLoading}
          >
            {editLoading ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PrimaryMemberListLayer;

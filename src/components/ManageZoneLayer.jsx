import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import userApiProvider from "../apiProvider/userApi";
import roleApiProvider from "../apiProvider/roleApi";
import Swal from "sweetalert2";
import { hasPermission } from "../utils/auth";

const ManageZoneLayer = ({ isModal, zoneId: propZoneId }) => {
  const { zoneId: paramZoneId } = useParams();
  const zoneId = propZoneId || paramZoneId;
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchRoleData();
  }, []);

  const fetchRoleData = async () => {
    try {
      const response = await roleApiProvider.getRoles();
      if (response && response.status) {
        setRoles(response.response.data || []);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchUserData = async () => {
    if (roles.length === 0 || !zoneId) return; // Wait for roles and zoneId to load
    
    setLoading(true);
    try {
      const targetRoles = [
        getRoleIdByName("FED/ED"),
        getRoleIdByName("Mentor"),
        getRoleIdByName("RD")
      ].filter(Boolean).join(',');

      const params = {
        page: pagination.page,
        limit: pagination.limit
      };

      if (targetRoles) {
        params.role = targetRoles;
      }

      if (zoneId) {
        params.zoneId = zoneId;
      }

      const response = await userApiProvider.getUsers(params);
      if (response && response.status) {
        const users = response?.response?.data || [];
        setUserList(users);
        setPagination((prev) => ({
          ...prev,
          total: response?.response?.pagination?.total || 0,
          totalPages: Math.ceil(
            (response?.response?.pagination?.total || 0) / pagination.limit
          ),
        }));
      } else {
        const errorMsg = response?.response?.message || JSON.stringify(response?.response?.errors || response?.response) || "Failed to fetch users";
        setError(errorMsg);
        console.error("Fetch users API Error:", response?.response);
      }
    } catch (error) {
      setError(error.message || "Failed to fetch users");
      console.error("Catch Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [pagination.page, pagination.limit, zoneId, roles]);

  const handleEdit = (userId) => {
    navigate(`/add-user/${userId}`);
  };

  const handleDelete = async (userId, userName) => {
    const result = await Swal.fire({
      title: "Delete User?",
      text: `Are you sure you want to delete ${userName}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      width: "400px",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const response = await userApiProvider.deleteUser(userId);
        if (response && response.status) {
          Swal.fire({
            title: "Deleted!",
            text: `${userName} has been deleted.`,
            icon: "success",
            width: "400px",
          });
          fetchUserData();
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to delete user.",
          icon: "error",
          width: "400px",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const getRoleIdByName = (roleName) => {
    const role = roles.find((r) => r.name.toLowerCase() === roleName.toLowerCase());
    return role ? role._id : "";
  };

  if (error) {
    return <div className="alert alert-danger text-center">Error: {error}</div>;
  }

  return (
    <div className={`p-0 ${isModal ? '' : 'card h-100 radius-12'}`}>
      <div className={`border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between ${isModal ? '' : 'card-header'}`}>
        <h6 className="mb-0 text-lg">Zone Members</h6>
        <div className="d-flex align-items-center flex-wrap gap-2">
          {hasPermission("chapters-list") && (
            <button
              type="button"
              className="btn btn-warning grip text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2 text-white"
              style={{ backgroundColor: "#707784", borderColor: "#707784" }}
              data-bs-toggle="modal"
              data-bs-target="#inactiveChaptersModal"
              onClick={() => document.querySelector('.modal-backdrop')?.remove()}
            >
              <Icon
                icon="mdi:eye-off-outline"
                className="icon text-xl line-height-1"
              />
              Inactive Chapters
            </button>
          )}
          <Link
            to={`/add-user?role=${getRoleIdByName("FED/ED")}&zoneId=${zoneId}`}
            className="btn btn-primary grip text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
            onClick={() => document.querySelector('.modal-backdrop')?.remove()}
          >
            <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
            Add FED/ED
          </Link>
          <Link
            to={`/add-user?role=${getRoleIdByName("Mentor")}&zoneId=${zoneId}`}
            className="btn btn-primary grip text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
            onClick={() => document.querySelector('.modal-backdrop')?.remove()}
          >
            <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
            Add Mentor
          </Link>
          <Link
            to={`/add-user?role=${getRoleIdByName("RD")}&zoneId=${zoneId}`}
            className="btn btn-primary grip text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
            onClick={() => document.querySelector('.modal-backdrop')?.remove()}
          >
            <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
            Add RD
          </Link>
        </div>
      </div>
      <div className={`p-24 ${isModal ? '' : 'card-body'}`}>
        <div className="table-responsive scroll-sm">
          <table className="table bordered-table sm-table mb-0">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Role</th>
                <th>Email</th>
                <th>Mobile Number</th>
                <th>Company Name</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : userList.length > 0 ? (
                userList.map((user, index) => (
                  <tr key={user._id}>
                    <td>{(pagination.page - 1) * pagination.limit + index + 1}.</td>
                    <td>{user.name}</td>
                    <td>
                      <span className="badge bg-primary-focus text-primary-600">
                        {user.role?.name || "Unknown"}
                      </span>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.mobileNumber}</td>
                    <td>{user.companyName}</td>
                    <td className="text-center">
                      <div className="d-flex align-items-center gap-10 justify-content-center">
                        <button
                          type="button"
                          className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                          onClick={() => {
                            document.querySelector('.modal-backdrop')?.remove();
                            handleEdit(user._id);
                          }}
                          disabled={loading}
                          title="Edit"
                        >
                          <Icon icon="lucide:edit" className="menu-icon" />
                        </button>
                        <button
                          type="button"
                          className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                          onClick={() => handleDelete(user._id, user.name)}
                          disabled={loading}
                          title="Delete"
                        >
                          <Icon icon="fluent:delete-24-regular" className="menu-icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} entries
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
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
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
                    className={`btn btn-sm ${
                      pagination.page === pageNum ? "btn-primary" : "btn-outline-danger"
                    }`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
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
    </div>
  );
};

export default ManageZoneLayer;

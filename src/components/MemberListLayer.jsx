import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import memberApiProvider from '../apiProvider/memberApi';
import chapterApiProvider from '../apiProvider/chapterApi';
import { getCurrentUser } from '../utils/auth';

const MemberListLayer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [accessChecked, setAccessChecked] = useState(false);

  const [resetStep, setResetStep] = useState(0);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [membersData, setMembersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDeactivated, setShowDeactivated] = useState(false);
  const [activating, setActivating] = useState(null);
  const handleResetClick = () => setResetStep(1);

  const handleSendOtp = () => {
    if (mobile.length >= 10) setResetStep(2);
    else alert('Enter a valid mobile number');
  };

  const handleVerifyOtp = () => {
    if (otp.length === 6) setResetStep(3);
    else alert('Enter valid 6-digit OTP');
  };

  const handleSavePassword = () => {
    if (newPassword !== confirmPassword) return alert("Passwords don't match!");
    setResetStep(4);
    setTimeout(() => {
      setResetStep(0);
      navigate('/sign-in');
    }, 3000);
  };

  const handleStatusChange = async (memberId, value) => {
    try {
      const response = await memberApiProvider.updateMemberStatus(memberId, { status: value });
      if (response && response.status) {
        await fetchData(id);
      }
    } catch (error) {
      console.error("Error updating member status:", error);
    }
  };

  useEffect(() => {
    const checkAccess = async () => {
      if (!id) return;
      try {
        const user = getCurrentUser()?.data;
        if (!user) {
          navigate('/sign-in');
          return;
        }

        const rawRole = user?.role;
        const roleName = (typeof rawRole === 'object' ? rawRole?.name : rawRole) || '';
        const roleNameLower = roleName.toLowerCase();
        const isSuperAdmin = roleNameLower === 'admin' || roleNameLower === 'super admin' || roleNameLower === 'super-admin';
        const isED = roleNameLower === 'ed' || roleNameLower === 'executive director';
        const isZoneAdmin = roleNameLower === 'zone-admin';
        const isZoneLevel = isZoneAdmin || isED;
        const isChapterUser = !isSuperAdmin && !isZoneLevel;

        if (isSuperAdmin) {
          setAccessChecked(true);
          return;
        }

        if (isChapterUser) {
          const userChapterIds = user?.chapterIds || [];
          const allowedChapterIds = Array.isArray(userChapterIds)
            ? userChapterIds.map(c => typeof c === 'object' ? c?._id || c?.id : c)
            : [];
          const hasAccess = allowedChapterIds.some(cid => String(cid) === String(id));
          if (!hasAccess) {
            navigate('/access-denied');
          } else {
            setAccessChecked(true);
          }
          return;
        }

        const res = await chapterApiProvider.getChaptersById(id);
        if (res && res.status && res.response?.data) {
          const chapter = res.response.data;
          const rawZoneId = user?.zoneId;
          const userZoneId = typeof rawZoneId === 'object' ? rawZoneId?._id || rawZoneId?.id : rawZoneId;

          const rawChapterZoneId = chapter?.zoneId;
          const chapterZoneId = typeof rawChapterZoneId === 'object' ? rawChapterZoneId?._id || rawChapterZoneId?.id : rawChapterZoneId;

          if (String(chapterZoneId) !== String(userZoneId)) {
            navigate('/access-denied');
          } else {
            setAccessChecked(true);
          }
        } else {
          navigate('/access-denied');
        }
      } catch (err) {
        console.error("Error during access check:", err);
        navigate('/access-denied');
      }
    };

    checkAccess();
  }, [id, navigate]);

  useEffect(() => {
    if (id && accessChecked) {
      fetchData(id);
    }
  }, [id, search, pagination.page, pagination.limit, showDeactivated, accessChecked]);

  const handleActivateMember = async (memberId) => {
    setActivating(memberId);
    try {
      const response = await memberApiProvider.updateMemberStatus(memberId, { status: 'active' });
      if (response && response.status) {
        await fetchData(id);
      }
    } catch (error) {
      console.error("Error activating member:", error);
    } finally {
      setActivating(null);
    }
  };

  const fetchData = async (chapterId) => {
    if (!accessChecked) return;
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: search.trim() || undefined,
        status: showDeactivated ? 'decline' : 'active',
      };
      const response = await memberApiProvider.getMemberByChapterId(params, chapterId);
      if (response && response.status) {
        setMembersData(response.data.data.members || []);
        setPagination((prev) => ({
          ...prev,
          total: response.data.data.pagination?.total || 0,
          totalPages: Math.ceil(
            (response.data.data.pagination?.total || 0) / pagination.limit
          ),
        }));
      }
    } catch (error) {
      console.error("Error fetching associates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  if (!accessChecked) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <div className="navbar-search">
            <input
              type="text"
              className="bg-base h-40-px w-auto"
              name="search"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Icon icon="ion:search-outline" className="icon" />
          </div>
          <button
            type="button"
            className={`btn btn-sm ${showDeactivated ? 'btn-danger' : 'btn-outline-danger'} d-flex align-items-center gap-2`}
            onClick={() => { setShowDeactivated(!showDeactivated); setPagination(prev => ({...prev, page: 1})); }}
          >
            <Icon icon={showDeactivated ? 'solar:user-block-linear' : 'solar:user-block-linear'} className="text-lg" />
            {showDeactivated ? 'Viewing Deactivated' : 'Show Deactivated'}
          </button>
        </div>
      </div>

      <div className="card-body p-24">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="table-responsive scroll-sm">
            {showDeactivated && (
              <div className="alert alert-warning d-flex align-items-center gap-2 mb-3 py-2" role="alert">
                <Icon icon="solar:user-block-linear" className="text-lg" />
                <span>Showing <strong>deactivated</strong> associates. Click "Activate" to restore them.</span>
              </div>
            )}
            <table className="table bordered-table sm-table mb-0">
              <thead>
                <tr>
                  <th className="text-nowrap">S.No</th>
                  <th>Name</th>
                  <th>Company name</th>
                  <th>Category</th>
                  <th className="text-nowrap">Mobile Number</th>
                  <th className="text-nowrap">Status</th>
                  <th className="text-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {membersData.map((member, index) => (
                  <tr key={member._id}>
                    <td className="text-nowrap"> {(pagination.page - 1) * pagination.limit + index + 1}.</td>
                    <td>
                      <Link to={`/associate/${member._id}/report`} className="text-primary-600 fw-semibold text-hover-primary">
                        {member.name}
                      </Link>
                    </td>
                    <td>{member.personalDetails.companyName}</td>
                    <td>
                      <span className="text-md mb-0 fw-normal text-secondary-light">
                        {member.personalDetails.categoryRepresented}
                      </span>
                    </td>
                    <td className="text-nowrap">{member.contactDetails.mobileNumber}</td>
                    <td className="text-nowrap">
                      {showDeactivated ? (
                        <button
                          type="button"
                          className="btn btn-sm btn-success d-flex align-items-center gap-1"
                          disabled={activating === member._id}
                          onClick={() => handleActivateMember(member._id)}
                        >
                          {activating === member._id ? (
                            <span className="spinner-border spinner-border-sm" />
                          ) : (
                            <Icon icon="solar:check-circle-linear" className="text-md" />
                          )}
                          Activate
                        </button>
                      ) : (
                        <select
                          className={`form-select newonee form-select-sm w-auto radius-12 h-40-px custom-status-select ${member.status === 'active'
                            ? 'status-activate'
                            : member.status === 'decline'
                              ? 'status-decline'
                              : ''
                            }`}
                          value={member.status}
                          onChange={(e) => handleStatusChange(member._id, e.target.value)}
                        >
                          <option value="active">Activate</option>
                          <option value="decline">Decline</option>
                        </select>
                      )}
                    </td>
                    <td className="text-nowrap">
                      <div className="d-flex align-items-center gap-10 justify-content-center">
                        <Link to={`/associate/${member._id}/report`}>
                          <button
                            type="button"
                            className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                          >
                            <Icon icon="majesticons:eye-line" className="icon text-xl" />
                          </button>
                        </Link>
                        <Link to={`/edit-primarymember/${member._id}`}>
                        <button
                          type="button"
                          className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                        >
                          <Icon icon="lucide:edit" className="menu-icon" />
                        </button>
                        </Link>
                        <button
                          type="button"
                          onClick={handleResetClick}
                          className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                        >
                          <Icon icon="fluent:arrow-clockwise-24-regular" className="menu-icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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
                        ? "btn btn-primary grip text-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
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

      {/* ✅ Member Details Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Member Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMember && (
            <div className="mb-3 row">
              <div className="col-md-6"><p>Name:</p></div>
              <div className="col-md-6"><span>{selectedMember.name}</span></div>

              <div className="col-md-6"><p>Company Name:</p></div>
              <div className="col-md-6"><span>{selectedMember.personalDetails?.companyName}</span></div>

              <div className="col-md-6"><p>Category:</p></div>
              <div className="col-md-6"><span>{selectedMember.personalDetails?.categoryRepresented}</span></div>

              <div className="col-md-6"><p>Mobile Number:</p></div>
              <div className="col-md-6"><span>{selectedMember.contactDetails?.mobileNumber}</span></div>

              <div className="col-md-6"><p>Status:</p></div>
              <div className="col-md-6"><span>{selectedMember.status === "active" ? 'Active' : 'Decline'}</span></div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Password Reset Modal (same as before) */}
      <Modal
        show={resetStep > 0}
        onHide={() => setResetStep(0)}
        backdrop={true}
        centered
        dialogClassName="custom-reset-modal"
      >
        <Modal.Body className="p-50 text-center" style={{ fontSize: '0.9rem' }}>
          {resetStep === 1 && (
            <>
              <h6 className="mb-5">Enter Mobile Number</h6>
              <input
                type="text"
                className="form-control mb-3 mx-auto shadow-sm border border-secondary rounded"
                style={{ maxWidth: '300px' }}
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
              <Button variant="primary grip" onClick={handleSendOtp}>Send OTP</Button>
            </>
          )}

          {resetStep === 2 && (
            <>
              <h6 className="mb-5">Enter OTP</h6>
              <input
                type="text"
                className="form-control mb-3 mx-auto shadow-sm border border-secondary rounded"
                style={{ maxWidth: '300px' }}
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button variant="primary grip" onClick={handleVerifyOtp}>Verify OTP</Button>
            </>
          )}

          {resetStep === 3 && (
            <>
              <h6 className="mb-5">Reset Password</h6>
              <input
                type="text"
                className="form-control mb-3 mx-auto shadow-sm border border-secondary rounded"
                style={{ maxWidth: '300px' }}
                placeholder="User Name"
                value="Anbu"
                readOnly
              />
              <input
                type="password"
                className="form-control mb-3 pb-2 mx-auto shadow-sm border border-secondary rounded"
                style={{ maxWidth: '300px' }}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                className="form-control mb-3 pb-2 mx-auto shadow-sm border border-secondary rounded"
                style={{ maxWidth: '300px' }}
                placeholder="Repeat Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button variant="success grip" onClick={handleSavePassword}>Save</Button>
            </>
          )}

          {resetStep === 4 && (
            <div>
              <h6 className="mb-2">Password changed successfully!</h6>
              <p>Redirecting to login...</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <style>{`
        select.no-arrow { background-image: none !important; }
        .status-activate { background-color: #e8f5e9; color: #2e7d32; }
        .status-decline { background-color: #ffebee; color: #c62828; }
      `}</style>
    </div>
  );
};

export default MemberListLayer;

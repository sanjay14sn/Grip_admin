import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { toast, ToastContainer } from 'react-toastify';
import accessRequestApiProvider from '../apiProvider/accessRequestApi';

const STATUS_COLORS = {
  pending:  { bg: '#fff7ed', text: '#c2410c', border: '#fdba74' },
  approved: { bg: '#f0fdf4', text: '#15803d', border: '#86efac' },
  rejected: { bg: '#fff1f2', text: '#be123c', border: '#fda4af' },
};

const STATUS_ICONS = {
  pending:  '⏳',
  approved: '✅',
  rejected: '❌',
};

const AccessRequestsLayer = () => {
  const [requests, setRequests]         = useState([]);
  const [loading, setLoading]           = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination]     = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });

  // Respond modal state
  const [respondModal, setRespondModal] = useState(null); // { request }
  const [responseStatus, setResponseStatus] = useState('approved');
  const [responseNote, setResponseNote]     = useState('');
  const [respondLoading, setRespondLoading] = useState(false);

  const fetchRequests = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: pagination.limit };
      if (statusFilter) params.status = statusFilter;
      const res = await accessRequestApiProvider.listRequests(params);
      if (res.status) {
        setRequests(res.response.data || []);
        setPagination(prev => ({
          ...prev,
          page,
          total: res.response.pagination?.total || 0,
          totalPages: res.response.pagination?.totalPages || 1,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, pagination.limit]);

  useEffect(() => { fetchRequests(1); }, [statusFilter]);

  const handleRespond = async () => {
    if (!respondModal) return;
    setRespondLoading(true);
    try {
      const res = await accessRequestApiProvider.respondToRequest(respondModal._id, {
        status: responseStatus,
        responseNote,
      });
      if (res.status) {
        toast.success(`Request ${responseStatus}!`);
        setRespondModal(null);
        setResponseNote('');
        fetchRequests(pagination.page);
      } else {
        toast.error(res.response?.message || 'Failed to respond');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setRespondLoading(false);
    }
  };

  const openRespondModal = (req) => {
    setRespondModal(req);
    setResponseStatus('approved');
    setResponseNote('');
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  return (
    <div className="card h-100 p-0 radius-12">
      <ToastContainer />

      {/* ── Header ── */}
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-12">
        <div>
          <h5 className="fw-bold text-dark mb-4">Access Requests</h5>
          <p className="text-secondary-light text-sm mb-0">Review and respond to access requests from ED and zone-level users</p>
        </div>
        <div className="d-flex align-items-center gap-12">
          {/* Status filter */}
          <select
            className="form-select form-control h-40-px radius-8 text-sm"
            style={{ minWidth: '140px' }}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Requests</option>
            <option value="pending">⏳ Pending</option>
            <option value="approved">✅ Approved</option>
            <option value="rejected">❌ Rejected</option>
          </select>
          <button
            className="btn btn-neutral h-40-px px-16 radius-8 text-sm d-flex align-items-center gap-8"
            onClick={() => fetchRequests(pagination.page)}
            disabled={loading}
          >
            <Icon icon="lucide:refresh-cw" className={loading ? 'spin-animation' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table bordered-table sm-table mb-0">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Requester</th>
                <th>Role</th>
                <th>Type</th>
                <th>Description</th>
                <th>Requested On</th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-40">
                  <div className="spinner-border text-primary" role="status" />
                </td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-40 text-secondary-light">
                  No access requests found
                </td></tr>
              ) : requests.map((req, index) => {
                const colors = STATUS_COLORS[req.status];
                return (
                  <tr key={req._id}>
                    <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                    <td>
                      <div className="fw-semibold text-dark">{req.requesterName}</div>
                    </td>
                    <td>
                      <span
                        className="px-10 py-4 radius-4 text-xs fw-semibold"
                        style={{ background: '#f3f4f6', color: '#374151' }}
                      >
                        {req.requesterRole}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm">
                        {req.requestType === 'permission' ? '🛡️ Permission' : '👤 Role'}
                      </span>
                    </td>
                    <td style={{ maxWidth: '260px' }}>
                      <p className="mb-0 text-sm" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {req.description}
                      </p>
                      {req.responseNote && (
                        <div className="mt-4 p-8 radius-6 text-xs" style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>
                          <strong>Response:</strong> {req.responseNote}
                        </div>
                      )}
                    </td>
                    <td className="text-sm text-secondary-light">{fmtDate(req.createdAt)}</td>
                    <td>
                      <span className="text-sm fw-semibold text-capitalize" style={{ color: colors.text }}>
                        {STATUS_ICONS[req.status]} {req.status}
                      </span>
                    </td>
                    <td className="text-center">
                      {req.status === 'pending' ? (
                        <button
                          className="btn btn-primary grip text-sm px-14 py-8 radius-8"
                          onClick={() => openRespondModal(req)}
                        >
                          Respond
                        </button>
                      ) : (
                        <span className="text-secondary-light text-sm">
                          {fmtDate(req.respondedAt)}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Pagination ── */}
      {pagination.totalPages > 1 && (
        <div className="card-footer bg-base border-top py-16 px-24 d-flex justify-content-between align-items-center">
          <span className="text-sm text-secondary-light">
            Showing {(pagination.page - 1) * pagination.limit + 1}–
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
          </span>
          <div className="d-flex gap-8">
            <button className="btn btn-sm btn-outline-danger" disabled={pagination.page === 1} onClick={() => fetchRequests(pagination.page - 1)}>Prev</button>
            <button className="btn btn-sm btn-outline-danger" disabled={pagination.page === pagination.totalPages} onClick={() => fetchRequests(pagination.page + 1)}>Next</button>
          </div>
        </div>
      )}

      {/* ── Respond Modal ── */}
      {respondModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content radius-16 border-0 shadow-lg">
              <div
                className="modal-header border-0 py-20 px-24"
                style={{ background: 'linear-gradient(135deg, #c02221 0%, #454442 100%)', borderRadius: '16px 16px 0 0' }}
              >
                <div>
                  <h6 className="fw-bold text-white mb-4">Respond to Access Request</h6>
                  <p className="text-white mb-0 opacity-75 text-sm">From: {respondModal.requesterName} ({respondModal.requesterRole})</p>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setRespondModal(null)} />
              </div>
              <div className="modal-body p-24">
                {/* Request summary */}
                <div className="p-12 radius-8 mb-20" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                  <div className="text-xs text-secondary-light mb-4">REQUEST</div>
                  <p className="mb-0 text-sm">{respondModal.description}</p>
                </div>

                {/* Approve / Reject toggle */}
                <div className="mb-20">
                  <label className="form-label fw-semibold text-secondary-light text-sm mb-10">Decision</label>
                  <div className="d-flex gap-12">
                    {[
                      { val: 'approved', label: '✅ Approve', bg: '#f0fdf4', border: '#86efac', text: '#15803d' },
                      { val: 'rejected', label: '❌ Reject',  bg: '#fff1f2', border: '#fda4af', text: '#be123c' },
                    ].map(opt => (
                      <div
                        key={opt.val}
                        onClick={() => setResponseStatus(opt.val)}
                        className="flex-1 text-center py-14 radius-8 fw-semibold"
                        style={{
                          cursor: 'pointer',
                          border: `2px solid ${responseStatus === opt.val ? opt.border : '#e5e7eb'}`,
                          background: responseStatus === opt.val ? opt.bg : '#fafafa',
                          color: responseStatus === opt.val ? opt.text : '#9ca3af',
                          transition: 'all 0.2s',
                        }}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="form-label fw-semibold text-secondary-light text-sm mb-8">
                    Response Note <span className="text-secondary-light">(optional)</span>
                  </label>
                  <textarea
                    className="form-control radius-8"
                    rows={3}
                    placeholder={responseStatus === 'approved'
                      ? "e.g., Access granted. Please contact IT to configure your new permissions."
                      : "e.g., This request requires further justification. Please discuss with your zone coordinator."}
                    value={responseNote}
                    onChange={e => setResponseNote(e.target.value)}
                    style={{ resize: 'none', fontSize: '13px' }}
                  />
                </div>
              </div>
              <div className="modal-footer border-top py-16 px-24 d-flex justify-content-end gap-12">
                <button className="btn btn-neutral text-sm px-20 py-11 radius-8" onClick={() => setRespondModal(null)} disabled={respondLoading}>Cancel</button>
                <button
                  className={`btn text-sm px-24 py-11 radius-8 ${responseStatus === 'approved' ? 'btn-success' : 'btn-danger'}`}
                  onClick={handleRespond}
                  disabled={respondLoading}
                >
                  {respondLoading ? <span><span className="spinner-border spinner-border-sm me-8" />Processing...</span>
                    : responseStatus === 'approved' ? '✅ Approve Request' : '❌ Reject Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessRequestsLayer;

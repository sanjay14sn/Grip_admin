import React, { useState } from 'react';
import { toast } from 'react-toastify';
import accessRequestApiProvider from '../../apiProvider/accessRequestApi';

const RequestAccessModal = ({ show, onClose, onSuccess }) => {
  const [requestType, setRequestType] = useState('permission');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error('Please describe what access you need and why.');
      return;
    }
    setLoading(true);
    try {
      const res = await accessRequestApiProvider.submitRequest({ requestType, description });
      if (res.status) {
        toast.success('Access request sent to Super Admin!');
        setDescription('');
        setRequestType('permission');
        onSuccess?.();
        onClose();
      } else {
        toast.error(res.response?.message || 'Failed to submit request');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 1055 }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content radius-16 border-0 shadow-lg" style={{ background: '#fff' }}>

          {/* Header */}
          <div
            className="modal-header border-0 py-20 px-24"
            style={{
              background: 'linear-gradient(135deg, #c02221 0%, #454442 100%)',
              borderRadius: '16px 16px 0 0',
            }}
          >
            <div>
              <h6 className="fw-bold text-white mb-4" style={{ fontSize: '16px' }}>
                🔐 Request Additional Access
              </h6>
              <p className="text-white mb-0 opacity-75" style={{ fontSize: '13px' }}>
                Your request will be reviewed by Super Admin
              </p>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
              style={{ boxShadow: 'none' }}
            />
          </div>

          {/* Body */}
          <div className="modal-body p-24">

            {/* Request Type */}
            <div className="mb-20">
              <label className="form-label fw-semibold text-secondary-light text-sm mb-10">
                What are you requesting?
              </label>
              <div className="d-flex gap-12">
                {[
                  { val: 'permission', label: '🛡️ Additional Permission', desc: 'Access to a specific feature' },
                  { val: 'role', label: '👤 New Role Assignment', desc: 'A different role in the system' },
                ].map(opt => (
                  <div
                    key={opt.val}
                    onClick={() => setRequestType(opt.val)}
                    className="flex-1 p-12 radius-8 cursor-pointer"
                    style={{
                      border: requestType === opt.val
                        ? '2px solid #c02221'
                        : '2px solid #e5e7eb',
                      background: requestType === opt.val ? '#fff5f5' : '#fafafa',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div className="fw-semibold text-sm mb-4">{opt.label}</div>
                    <div className="text-secondary-light" style={{ fontSize: '11px' }}>{opt.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <label className="form-label fw-semibold text-secondary-light text-sm mb-8">
                Describe what you need and why
                <span className="text-danger ms-4">*</span>
              </label>
              <textarea
                className="form-control radius-8"
                rows={4}
                placeholder="Example: I need access to the Reports section to generate monthly analytics for my zone..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                maxLength={500}
                style={{ resize: 'none', fontSize: '13px' }}
              />
              <div className="text-end text-secondary-light mt-4" style={{ fontSize: '11px' }}>
                {description.length}/500
              </div>
            </div>

            {/* Info note */}
            <div
              className="d-flex align-items-start gap-10 p-12 radius-8 mt-4"
              style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}
            >
              <span style={{ fontSize: '16px', marginTop: '1px' }}>ℹ️</span>
              <p className="mb-0 text-secondary-light" style={{ fontSize: '12px' }}>
                Super Admin will review your request and respond. You can track your requests from the Roles page.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer border-top py-16 px-24 d-flex justify-content-end gap-12">
            <button
              type="button"
              className="btn btn-neutral text-sm px-20 py-11 radius-8"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary grip text-sm px-24 py-11 radius-8"
              onClick={handleSubmit}
              disabled={loading || !description.trim()}
            >
              {loading ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-8" role="status" />
                  Sending...
                </span>
              ) : '📨 Send Request'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestAccessModal;

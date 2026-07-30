import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast } from "react-toastify";
import websiteApiProvider from "../apiProvider/websiteApi";
import { IMAGE_BASE_URL } from "../network/apiClient";

const EMPTY_FORM = { title: "", description: "", imagePreview: null, imageFile: null };

const WebsiteEventsLayer = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const imageInputRef = useRef(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    const res = await websiteApiProvider.getWebsiteEvents();
    if (res.status) setEvents(res.data);
    else toast.error(res.message || "Failed to load events");
    setLoading(false);
  };

  const openCreate = () => {
    setEditEvent(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (event) => {
    setEditEvent(event);
    setForm({
      title: event.title || "",
      description: event.description || "",
      imagePreview: null,
      imageFile: null,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditEvent(null);
    setForm(EMPTY_FORM);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((f) => ({ ...f, imageFile: file }));
    const reader = new FileReader();
    reader.onload = (ev) => setForm((f) => ({ ...f, imagePreview: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      imageFile: form.imageFile,
    };

    const res = editEvent
      ? await websiteApiProvider.updateWebsiteEvent(editEvent._id, payload)
      : await websiteApiProvider.createWebsiteEvent(payload);

    if (res.status) {
      toast.success(editEvent ? "Event updated" : "Event created");
      closeModal();
      loadEvents();
    } else {
      toast.error(res.message || "Failed to save event");
    }
    setSaving(false);
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Delete this event?")) return;
    const res = await websiteApiProvider.deleteWebsiteEvent(eventId);
    if (res.status) {
      toast.success("Event deleted");
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
    } else {
      toast.error(res.message || "Failed to delete event");
    }
  };

  const getImageUrl = (event) => {
    if (!event?.image?.docPath) return null;
    return `${IMAGE_BASE_URL}/${event.image.docPath}/${event.image.docName}`;
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div className="card h-100 p-0 radius-12">
        <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary radius-8 d-flex align-items-center gap-1"
              onClick={() => navigate("/website")}
            >
              <Icon icon="mdi:arrow-left" /> Back
            </button>
            <div>
              <h5 className="card-title mb-0">Website Events</h5>
              <p className="text-sm text-muted mb-0">
                {loading
                  ? "Loading…"
                  : `${events.length} event${events.length !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary grip text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
            onClick={openCreate}
          >
            <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
            Add Event
          </button>
        </div>

        <div className="card-body p-24">
          {loading ? (
            <div className="d-flex align-items-center justify-content-center py-40 gap-2 text-secondary">
              <div className="spinner-border spinner-border-sm" role="status" />
              <span>Loading events…</span>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-40 text-muted">
              No events yet. Click <strong>+ Add Event</strong> to create one.
            </div>
          ) : (
            <div className="row g-4">
              {events.map((event) => {
                const imgUrl = getImageUrl(event);
                return (
                  <div key={event._id} className="col-lg-6 col-md-6">
                    <div className="border radius-12 overflow-hidden h-100" style={{ background: "#fff" }}>
                      <div
                        className="position-relative"
                        style={{
                          height: 220,
                          background: imgUrl
                            ? `url(${imgUrl}) center/cover no-repeat`
                            : "#f0f0f0",
                        }}
                      >
                        {!imgUrl && (
                          <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
                            <Icon icon="mdi:image-outline" style={{ fontSize: "2.5rem" }} />
                          </div>
                        )}
                      </div>
                      <div className="p-20">
                        <h5 className="fw-bold mb-2" style={{ color: "#c1272d" }}>
                          {event.title}
                        </h5>
                        <p className="text-secondary mb-16" style={{ fontSize: 14, lineHeight: 1.55 }}>
                          {event.description || "No description"}
                        </p>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary radius-8 d-flex align-items-center gap-1"
                            onClick={() => openEdit(event)}
                          >
                            <Icon icon="lucide:edit" /> Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger radius-8 d-flex align-items-center gap-1"
                            onClick={() => handleDelete(event._id)}
                          >
                            <Icon icon="mdi:trash-can-outline" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1055 }}
          onClick={closeModal}
        >
          <div
            className="bg-white radius-12 shadow-lg"
            style={{ width: "100%", maxWidth: 520, margin: "0 16px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex align-items-center justify-content-between px-24 py-16 border-bottom">
              <h6 className="mb-0 fw-bold">{editEvent ? "Edit Event" : "Add Event"}</h6>
              <button type="button" className="btn-close" onClick={closeModal} />
            </div>

            <div className="p-24 d-flex flex-column gap-3" style={{ maxHeight: "70vh", overflowY: "auto" }}>
              <div>
                <label className="form-label fw-semibold text-sm mb-2">Image</label>
                {(() => {
                  const existing = getImageUrl(editEvent);
                  const active = form.imagePreview || existing;
                  return (
                    <>
                      <div
                        className="d-flex align-items-center justify-content-center radius-8 overflow-hidden position-relative"
                        style={{
                          height: 160,
                          background: active ? `url(${active}) center/cover no-repeat` : "#f5f5f5",
                          cursor: "pointer",
                          border: "2px dashed #ddd",
                        }}
                        onClick={() => imageInputRef.current?.click()}
                      >
                        {!active && (
                          <div className="text-center text-muted">
                            <Icon icon="mdi:image-plus-outline" style={{ fontSize: "2rem" }} />
                            <p className="text-xs mt-1 mb-0">Click to upload image</p>
                          </div>
                        )}
                        {active && (
                          <div
                            className="position-absolute bottom-0 start-0 end-0 d-flex align-items-center justify-content-center py-1"
                            style={{ background: "rgba(0,0,0,0.45)", color: "#fff", fontSize: 12 }}
                          >
                            <Icon icon="mdi:pencil" className="me-1" /> Change image
                          </div>
                        )}
                      </div>
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        className="d-none"
                        onChange={handleImageChange}
                      />
                    </>
                  );
                })()}
              </div>

              <div>
                <label className="form-label fw-semibold text-sm mb-1">
                  Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control radius-8"
                  placeholder="e.g. GRIP NEXOR - Launch"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  autoFocus
                />
              </div>

              <div>
                <label className="form-label fw-semibold text-sm mb-1">Description</label>
                <textarea
                  className="form-control radius-8"
                  rows={3}
                  placeholder="e.g. An exclusive chapter for young entrepreneurs aged between 18 to 22 years"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
            </div>

            <div className="px-24 py-16 border-top d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary radius-8" onClick={closeModal}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary grip radius-8 d-flex align-items-center gap-2"
                onClick={handleSave}
                disabled={saving || !form.title.trim()}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm" /> Saving…
                  </>
                ) : (
                  <>
                    <Icon icon="mdi:content-save-outline" />
                    {editEvent ? "Save Changes" : "Create Event"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsiteEventsLayer;

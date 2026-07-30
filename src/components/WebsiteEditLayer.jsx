import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast } from "react-toastify";
import chapterApiProvider from "../apiProvider/chapterApi";
import memberApiProvider from "../apiProvider/memberApi";
import websiteApiProvider from "../apiProvider/websiteApi";
import paymentApiProvider from "../apiProvider/paymentApi";
import { IMAGE_BASE_URL } from "../network/apiClient";

// ── Gallery helpers ─────────────────────────────────────────────────────────
const EMPTY_ALBUM_FORM = { name: "", description: "", coverPreview: null, coverFile: null };

const GallerySection = ({ chapterId }) => {
  const [albums, setAlbums] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editAlbum, setEditAlbum] = useState(null); // null = create, album obj = edit
  const [form, setForm] = useState(EMPTY_ALBUM_FORM);
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const coverInputRef = useRef(null);
  const editCoverInputRef = useRef(null);
  const fileInputRefs = useRef({});

  useEffect(() => {
    if (chapterId) loadAlbums();
  }, [chapterId]);

  const loadAlbums = async () => {
    const res = await websiteApiProvider.getGallery(chapterId);
    if (res.status) setAlbums(res.data);
  };

  const openModal = () => { setEditAlbum(null); setForm(EMPTY_ALBUM_FORM); setShowModal(true); };
  const openEditModal = (album) => {
    setEditAlbum(album);
    setForm({ name: album.name, description: album.description || "", coverPreview: null, coverFile: null });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditAlbum(null); };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((f) => ({ ...f, coverFile: file }));
    const reader = new FileReader();
    reader.onload = (ev) => setForm((f) => ({ ...f, coverPreview: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleCreateAlbum = async () => {
    if (!form.name.trim()) return;
    setAdding(true);
    const res = await websiteApiProvider.createAlbum(chapterId, {
      name: form.name.trim(),
      description: form.description.trim(),
      coverImageFile: form.coverFile,
    });
    if (res.status) {
      setAlbums((prev) => [...prev, { ...res.data, images: res.data?.images || [] }]);
      closeModal();
      toast.success("Album created");
    } else {
      toast.error(res.message || "Failed to create album");
    }
    setAdding(false);
  };

  const handleUpdateAlbum = async () => {
    if (!form.name.trim() || !editAlbum) return;
    setSaving(true);
    const res = await websiteApiProvider.updateAlbum(chapterId, editAlbum._id, {
      name: form.name.trim(),
      description: form.description.trim(),
      coverImageFile: form.coverFile,
    });
    if (res.status) {
      setAlbums((prev) =>
        prev.map((a) =>
          a._id === editAlbum._id
            ? { ...a, name: form.name.trim(), description: form.description.trim(), ...(res.data || {}) }
            : a
        )
      );
      closeModal();
      toast.success("Album updated");
    } else {
      toast.error(res.message || "Failed to update album");
    }
    setSaving(false);
  };

  const handleDeleteAlbum = async (albumId) => {
    if (!window.confirm("Delete this album and all its images?")) return;
    const res = await websiteApiProvider.deleteAlbum(chapterId, albumId);
    if (res.status) {
      setAlbums((prev) => prev.filter((a) => a._id !== albumId));
      toast.success("Album deleted");
    } else {
      toast.error(res.message || "Failed to delete album");
    }
  };

  const handleUploadImages = async (albumId, files) => {
    if (!files.length) return;
    const fileArr = Array.from(files);
    const res = await websiteApiProvider.uploadImages(chapterId, albumId, fileArr);
    if (res.status) {
      setAlbums((prev) =>
        prev.map((a) =>
          a._id === albumId ? { ...a, images: [...(a.images || []), ...res.data] } : a
        )
      );
      toast.success(`${fileArr.length} image(s) uploaded`);
    } else {
      toast.error(res.message || "Failed to upload images");
    }
  };

  const handleDeleteImage = async (albumId, imageId) => {
    const res = await websiteApiProvider.deleteImage(chapterId, albumId, imageId);
    if (res.status) {
      setAlbums((prev) =>
        prev.map((a) =>
          a._id === albumId
            ? { ...a, images: a.images.filter((img) => img._id !== imageId) }
            : a
        )
      );
    }
  };

  return (
    <div className="card radius-12">
      <div className="card-header bg-base py-16 px-24 border-bottom d-flex align-items-center justify-content-between">
        <h6 className="mb-0 fw-bold">Gallery</h6>
        <button
          type="button"
          className="btn btn-sm btn-primary grip radius-8 d-flex align-items-center gap-1"
          onClick={openModal}
        >
          <Icon icon="mdi:plus" />
          Add Album
        </button>
      </div>

      {/* ── Add Album Modal ── */}
      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          onClick={closeModal}
        >
          <div
            className="bg-white radius-12 shadow-lg"
            style={{ width: "100%", maxWidth: 480, margin: "0 16px" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="d-flex align-items-center justify-content-between px-24 py-16 border-bottom">
              <h6 className="mb-0 fw-bold">{editAlbum ? "Edit Album" : "Add Album"}</h6>
              <button type="button" className="btn-close" onClick={closeModal} />
            </div>

            {/* Modal body */}
            <div className="p-24 d-flex flex-column gap-3">
              {/* Cover image */}
              <div>
                <label className="form-label fw-semibold text-sm mb-2">Cover Image</label>
                {(() => {
                  const existingCover = editAlbum?.coverImage?.docPath
                    ? `${IMAGE_BASE_URL}/${editAlbum.coverImage.docPath}/${editAlbum.coverImage.docName}`
                    : null;
                  const activeCover = form.coverPreview || existingCover;
                  return (
                    <>
                      <div
                        className="d-flex align-items-center justify-content-center radius-8 overflow-hidden position-relative"
                        style={{
                          height: 160,
                          background: activeCover ? `url(${activeCover}) center/cover no-repeat` : "#f5f5f5",
                          cursor: "pointer",
                          border: "2px dashed #ddd",
                        }}
                        onClick={() => coverInputRef.current?.click()}
                      >
                        {!activeCover && (
                          <div className="text-center text-muted">
                            <Icon icon="mdi:image-plus-outline" style={{ fontSize: "2rem" }} />
                            <p className="text-xs mt-1 mb-0">Click to upload cover image</p>
                          </div>
                        )}
                        {activeCover && (
                          <div
                            className="position-absolute bottom-0 start-0 end-0 d-flex align-items-center justify-content-center py-1"
                            style={{ background: "rgba(0,0,0,0.45)", color: "#fff", fontSize: 12 }}
                          >
                            <Icon icon="mdi:pencil" className="me-1" /> Change image
                          </div>
                        )}
                      </div>
                      <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/*"
                        className="d-none"
                        onChange={handleCoverChange}
                      />
                    </>
                  );
                })()}
              </div>

              {/* Title */}
              <div>
                <label className="form-label fw-semibold text-sm mb-1">Title <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control radius-8"
                  placeholder="Album name…"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateAlbum()}
                  autoFocus
                />
              </div>

              {/* Description */}
              <div>
                <label className="form-label fw-semibold text-sm mb-1">Description</label>
                <textarea
                  className="form-control radius-8"
                  rows={3}
                  placeholder="Optional description…"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-24 py-16 border-top d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary radius-8" onClick={closeModal}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary grip radius-8 d-flex align-items-center gap-2"
                onClick={editAlbum ? handleUpdateAlbum : handleCreateAlbum}
                disabled={(editAlbum ? saving : adding) || !form.name.trim()}
              >
                {editAlbum
                  ? saving
                    ? <><span className="spinner-border spinner-border-sm" /> Saving…</>
                    : <><Icon icon="mdi:content-save-outline" /> Save Changes</>
                  : adding
                    ? <><span className="spinner-border spinner-border-sm" /> Creating…</>
                    : <><Icon icon="mdi:plus" /> Create Album</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card-body p-24 d-flex flex-column gap-4">
        {albums.length === 0 && (
          <div className="text-center py-32 text-muted">
            No albums yet. Click <strong>+ Add Album</strong> to create one.
          </div>
        )}

        {albums.map((album) => (
          <div key={album._id} className="border radius-8 overflow-hidden">
            {/* Album header */}
            <div
              className="d-flex align-items-center justify-content-between px-16 py-12 gap-3"
              style={{ background: "#f4f4f4", borderBottom: "1px solid #e5e5e5" }}
            >
              <div className="d-flex align-items-center gap-3 flex-grow-1 overflow-hidden">
                {/* Cover thumbnail */}
                {album.coverImage?.docPath ? (
                  <img
                    src={`${IMAGE_BASE_URL}/${album.coverImage.docPath}/${album.coverImage.docName}`}
                    alt=""
                    className="rounded-2 flex-shrink-0"
                    style={{ width: 48, height: 48, objectFit: "cover", border: "1px solid #ddd" }}
                  />
                ) : (
                  <div
                    className="rounded-2 flex-shrink-0 d-flex align-items-center justify-content-center"
                    style={{ width: 48, height: 48, background: "#ddd" }}
                  >
                    <Icon icon="mdi:folder-image" style={{ fontSize: "1.4rem", color: "#999" }} />
                  </div>
                )}
                <div className="overflow-hidden">
                  <div className="fw-semibold text-sm d-flex align-items-center gap-2">
                    {album.name}
                    <span className="badge bg-secondary-focus text-secondary-600">
                      {album.images?.length || 0} photos
                    </span>
                  </div>
                  {album.description && (
                    <div className="text-xs text-muted text-truncate">{album.description}</div>
                  )}
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                {/* Upload photos */}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary radius-8 d-flex align-items-center gap-1"
                  onClick={() => fileInputRefs.current[album._id]?.click()}
                  title="Upload photos"
                >
                  <Icon icon="mdi:upload" />
                  Upload
                </button>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="d-none"
                  ref={(el) => (fileInputRefs.current[album._id] = el)}
                  onChange={(e) => handleUploadImages(album._id, e.target.files)}
                />
                {/* Edit album */}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary radius-8"
                  onClick={() => openEditModal(album)}
                  title="Edit album"
                >
                  <Icon icon="lucide:edit" />
                </button>
                {/* Delete album */}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger radius-8"
                  onClick={() => handleDeleteAlbum(album._id)}
                  title="Delete album"
                >
                  <Icon icon="mdi:trash-can-outline" />
                </button>
              </div>
            </div>

            {/* Images grid */}
            {album.images?.length > 0 ? (
              <div
                className="p-12 d-flex flex-wrap gap-2"
                style={{ background: "#fff" }}
              >
                {album.images.map((img) => (
                  <div
                    key={img._id}
                    className="position-relative"
                    style={{ width: 90, height: 90 }}
                  >
                    <img
                      src={`${IMAGE_BASE_URL}/${img.docPath}/${img.docName}`}
                      alt=""
                      className="w-100 h-100 rounded-2 object-fit-cover"
                      style={{ border: "1px solid #ddd" }}
                    />
                    <button
                      type="button"
                      className="position-absolute d-flex align-items-center justify-content-center rounded-circle border-0"
                      style={{
                        top: 3, right: 3, width: 20, height: 20,
                        background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 10, cursor: "pointer",
                      }}
                      onClick={() => handleDeleteImage(album._id, img._id)}
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted text-sm" style={{ background: "#fff" }}>
                No images yet — click Upload to add photos.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Events helpers ──────────────────────────────────────────────────────────
const EMPTY_EVENT_FORM = { topic: "", startDate: "", endDate: "", location: "", imagePreview: null, imageFile: null };

const EventsSection = ({ chapterId }) => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null); // null = create, event obj = edit
  const [form, setForm] = useState(EMPTY_EVENT_FORM);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const imageInputRef = useRef(null);

  useEffect(() => {
    if (chapterId) loadEvents();
  }, [chapterId]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await paymentApiProvider.getPaymentDetails({ page: 1, limit: 100, purpose: "event" });
      if (res.status && Array.isArray(res.data?.data)) {
        const filtered = res.data.data.filter((e) =>
          e.chapterId?.some((ch) => (ch._id || ch) === chapterId)
        );
        setEvents(filtered);
      }
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => { setEditEvent(null); setForm(EMPTY_EVENT_FORM); setShowModal(true); };
  const openEditModal = (event) => {
    setEditEvent(event);
    const startStr = event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : "";
    const endStr = event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "";

    setForm({
      topic: event.topic || "",
      startDate: startStr,
      endDate: endStr,
      location: event.address || "",
      imagePreview: null,
      imageFile: null,
    });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditEvent(null); };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((f) => ({ ...f, imageFile: file }));
    const reader = new FileReader();
    reader.onload = (ev) => setForm((f) => ({ ...f, imagePreview: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSaveEvent = async () => {
    if (!form.topic.trim() || !form.startDate || !form.endDate || !form.location.trim()) {
      toast.error("Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      const submissionData = new FormData();
      submissionData.append("purpose", "event");
      submissionData.append("topic", form.topic.trim());
      if (form.imageFile) {
        submissionData.append("image", form.imageFile);
      }
      submissionData.append("amount", 0);
      submissionData.append("chapterId", chapterId);
      submissionData.append("paymentRequired", false);
      submissionData.append("startDate", new Date(form.startDate).toISOString());
      submissionData.append("endDate", new Date(form.endDate).toISOString());
      submissionData.append("address", form.location.trim());
      submissionData.append("latitude", 0);
      submissionData.append("longitude", 0);

      let res;
      if (editEvent) {
        res = await paymentApiProvider.updatePayment(editEvent._id, submissionData);
      } else {
        res = await paymentApiProvider.addPayment(submissionData);
      }

      if (res.status) {
        toast.success(`Event ${editEvent ? "updated" : "created"} successfully`);
        closeModal();
        loadEvents();
      } else {
        toast.error(res.data?.message || `Failed to ${editEvent ? "update" : "create"} event`);
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await paymentApiProvider.deletPayemnt(eventId);
      if (res.status) {
        toast.success("Event deleted");
        loadEvents();
      } else {
        toast.error("Failed to delete event");
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred");
    }
  };

  return (
    <div className="card radius-12 mt-4">
      <div className="card-header bg-base py-16 px-24 border-bottom d-flex align-items-center justify-content-between">
        <h6 className="mb-0 fw-bold">Upcoming Events</h6>
        <button
          type="button"
          className="btn btn-sm btn-primary grip radius-8 d-flex align-items-center gap-1"
          onClick={openModal}
        >
          <Icon icon="mdi:plus" />
          Add Event
        </button>
      </div>

      {/* ── Add/Edit Event Modal ── */}
      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          onClick={closeModal}
        >
          <div
            className="bg-white radius-12 shadow-lg"
            style={{ width: "100%", maxWidth: 480, margin: "0 16px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex align-items-center justify-content-between px-24 py-16 border-bottom">
              <h6 className="mb-0 fw-bold">{editEvent ? "Edit Event" : "Add Event"}</h6>
              <button type="button" className="btn-close" onClick={closeModal} />
            </div>

            <div className="p-24 d-flex flex-column gap-3" style={{ maxHeight: "70vh", overflowY: "auto" }}>
              {/* Event Image */}
              <div>
                <label className="form-label fw-semibold text-sm mb-2">Event Image</label>
                {(() => {
                  const existingImg = editEvent?.image?.docPath
                    ? `${IMAGE_BASE_URL}/${editEvent.image.docPath}/${editEvent.image.docName}`
                    : null;
                  const activeImg = form.imagePreview || existingImg;
                  return (
                    <>
                      <div
                        className="d-flex align-items-center justify-content-center radius-8 overflow-hidden position-relative"
                        style={{
                          height: 160,
                          background: activeImg ? `url(${activeImg}) center/cover no-repeat` : "#f5f5f5",
                          cursor: "pointer",
                          border: "2px dashed #ddd",
                        }}
                        onClick={() => imageInputRef.current?.click()}
                      >
                        {!activeImg && (
                          <div className="text-center text-muted">
                            <Icon icon="mdi:image-plus-outline" style={{ fontSize: "2rem" }} />
                            <p className="text-xs mt-1 mb-0">Click to upload event image</p>
                          </div>
                        )}
                        {activeImg && (
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

              {/* Title / Topic */}
              <div>
                <label className="form-label fw-semibold text-sm mb-1">Event Title <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control radius-8"
                  placeholder="Event title or topic…"
                  value={form.topic}
                  onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="form-label fw-semibold text-sm mb-1">Start Date &amp; Time <span className="text-danger">*</span></label>
                <input
                  type="datetime-local"
                  className="form-control radius-8"
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                />
              </div>

              {/* End Date */}
              <div>
                <label className="form-label fw-semibold text-sm mb-1">End Date &amp; Time <span className="text-danger">*</span></label>
                <input
                  type="datetime-local"
                  className="form-control radius-8"
                  value={form.endDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                />
              </div>

              {/* Location */}
              <div>
                <label className="form-label fw-semibold text-sm mb-1">Location / Address <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control radius-8"
                  placeholder="Venue address…"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
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
                onClick={handleSaveEvent}
                disabled={saving || !form.topic.trim() || !form.startDate || !form.endDate || !form.location.trim()}
              >
                {saving ? (
                  <><span className="spinner-border spinner-border-sm" /> Saving…</>
                ) : (
                  <><Icon icon="mdi:content-save-outline" /> {editEvent ? "Save Changes" : "Post Event"}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card-body p-24 d-flex flex-column gap-4">
        {loading ? (
          <div className="text-center py-32 text-muted">
            <span className="spinner-border spinner-border-sm me-2" />
            Loading events…
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-32 text-muted">
            No events posted yet. Click <strong>+ Add Event</strong> to post one.
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {events.map((event) => (
              <div key={event._id} className="d-flex align-items-center gap-3 p-16 radius-8 border" style={{ background: "#fafafa" }}>
                {event.image?.docPath ? (
                  <img
                    src={`${IMAGE_BASE_URL}/${event.image.docPath}/${event.image.docName}`}
                    alt=""
                    className="rounded-2 flex-shrink-0"
                    style={{ width: 64, height: 64, objectFit: "cover", border: "1px solid #ddd" }}
                  />
                ) : (
                  <div
                    className="rounded-2 flex-shrink-0 d-flex align-items-center justify-content-center"
                    style={{ width: 64, height: 64, background: "#ddd" }}
                  >
                    <Icon icon="mdi:calendar" style={{ fontSize: "1.8rem", color: "#999" }} />
                  </div>
                )}

                <div className="flex-grow-1 overflow-hidden">
                  <div className="fw-semibold text-sm text-truncate">{event.topic}</div>
                  <div className="text-xs text-muted mt-1 text-truncate">
                    <Icon icon="mdi:calendar-clock" className="me-1" />
                    {event.startDate ? new Date(event.startDate).toLocaleString() : "—"}
                  </div>
                  <div className="text-xs text-muted mt-1 text-truncate">
                    <Icon icon="mdi:map-marker" className="me-1" />
                    {event.address || "—"}
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary radius-8"
                    onClick={() => openEditModal(event)}
                    title="Edit event"
                  >
                    <Icon icon="lucide:edit" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger radius-8"
                    onClick={() => handleDeleteEvent(event._id)}
                    title="Delete event"
                  >
                    <Icon icon="mdi:trash-can-outline" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const WebsiteEditLayer = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();

  const [chapterData, setChapterData] = useState(null);
  const [members, setMembers] = useState([]);
  const [loadingChapter, setLoadingChapter] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // BG image state
  const [bgPreview, setBgPreview] = useState(null);   // base64 preview
  const [bgFile, setBgFile] = useState(null);          // actual File object
  const [existingBgUrl, setExistingBgUrl] = useState(null); // saved URL from API
  const bgInputRef = useRef(null);

  // profileLinks: { [memberId]: url }
  const [profileLinks, setProfileLinks] = useState({});

  useEffect(() => {
    if (chapterId) {
      fetchChapter();
      fetchMembers();
      fetchExistingWebsite();
    }
  }, [chapterId]);

  const fetchChapter = async () => {
    setLoadingChapter(true);
    try {
      const res = await chapterApiProvider.getChaptersById(chapterId);
      if (res.status) setChapterData(res.response?.data);
    } catch (err) {
      console.error("Failed to fetch chapter:", err);
    } finally {
      setLoadingChapter(false);
    }
  };

  const fetchMembers = async () => {
    setLoadingMembers(true);
    try {
      const res = await memberApiProvider.getMemberByChapterId({ limit: 200 }, chapterId);
      if (res.status) {
        const list = res.data?.data?.members || res.data?.data || [];
        setMembers(list);
      }
    } catch (err) {
      console.error("Failed to fetch members:", err);
    } finally {
      setLoadingMembers(false);
    }
  };

  const fetchExistingWebsite = async () => {
    try {
      const res = await websiteApiProvider.getChapterWebsite(chapterId);
      if (res.status) {
        const data = res.response?.data;

        // Reconstruct bg image URL from { docPath, docName }
        if (data?.bgImage?.docPath && data?.bgImage?.docName) {
          setExistingBgUrl(`${IMAGE_BASE_URL}/${data.bgImage.docPath}/${data.bgImage.docName}`);
        }

        // Restore member profile links
        if (Array.isArray(data?.memberLinks) && data.memberLinks.length > 0) {
          const linksMap = {};
          data.memberLinks.forEach(({ memberId, profileLink }) => {
            if (memberId && profileLink) {
              linksMap[String(memberId)] = profileLink;
            }
          });
          setProfileLinks(linksMap);
        }
      }
    } catch (err) {
      console.error("Failed to load existing website data:", err);
    }
  };

  const handleBgChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBgFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setBgPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleLinkChange = (memberId, value) => {
    setProfileLinks((prev) => ({ ...prev, [String(memberId)]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const memberLinks = members.map((m) => ({
        memberId: String(m._id),
        profileLink: profileLinks[String(m._id)] || "",
      }));

      const res = await websiteApiProvider.saveChapterWebsite(chapterId, {
        bgImageFile: bgFile || null,
        memberLinks,
      });

      if (res.status) {
        toast.success("Website updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        // Clear the local file so the saved URL is used next time
        setBgFile(null);
        if (bgPreview) setExistingBgUrl(bgPreview);
      } else {
        toast.error(res.response?.message || "Failed to update website.", {
          position: "top-right",
        });
      }
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() || "")
      .join("");

  const getMemberAvatar = (member) => {
    if (member.profilePicture?.docPath && member.profilePicture?.docName) {
      return `${IMAGE_BASE_URL}/${member.profilePicture.docPath}/${member.profilePicture.docName}`;
    }
    return null;
  };

  const activeBg = bgPreview || existingBgUrl;

  return (
    <div className="d-flex flex-column gap-4">

      {/* ── Top Bar ── */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary radius-8 d-flex align-items-center gap-1"
            onClick={() => navigate(-1)}
          >
            <Icon icon="mdi:arrow-left" />
            Back
          </button>
          <h5 className="mb-0 fw-bold">
            {loadingChapter ? "Loading…" : `Edit Website — ${chapterData?.chapterName || ""}`}
          </h5>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          className="btn btn-primary grip text-sm px-20 py-12 radius-8 d-flex align-items-center gap-2"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" />
              Saving…
            </>
          ) : (
            <>
              <Icon icon="mdi:content-save-outline" className="icon text-xl line-height-1" />
              Save &amp; Publish
            </>
          )}
        </button>
      </div>

      {/* ── BG Image Section ── */}
      <div className="card p-0 radius-12 overflow-hidden">
        <div
          className="position-relative d-flex align-items-center justify-content-center"
          style={{
            height: "220px",
            background: activeBg
              ? `url(${activeBg}) center/cover no-repeat`
              : "linear-gradient(135deg, #d23b3b 0%, #8b0000 100%)",
            cursor: "pointer",
          }}
          onClick={() => bgInputRef.current?.click()}
        >
          <div
            className="d-flex flex-column align-items-center gap-2 text-white"
            style={{ pointerEvents: "none", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
          >
            <Icon icon="mdi:image-edit-outline" style={{ fontSize: "2.5rem" }} />
            <span className="fw-semibold">Click to change background image</span>
          </div>

          <span
            className="position-absolute d-flex align-items-center gap-1 px-10 py-4 radius-8"
            style={{
              top: "12px",
              right: "12px",
              background: "rgba(0,0,0,0.45)",
              color: "#fff",
              fontSize: "0.78rem",
              pointerEvents: "none",
            }}
          >
            <Icon icon="lucide:edit" style={{ fontSize: "0.9rem" }} />
            Edit BG
          </span>

          <input
            ref={bgInputRef}
            type="file"
            accept="image/*"
            className="d-none"
            onChange={handleBgChange}
          />
        </div>

        <div className="px-24 py-16 bg-base">
          <h6 className="mb-1 fw-bold text-lg">
            GRIP – {chapterData?.chapterName || "…"} Chapter
          </h6>
          <p className="text-muted text-sm mb-0">
            India's 1st Digital Business Networking &amp; Referral Platform
          </p>
        </div>
      </div>

      {/* ── Associates ── */}
      <div className="card p-0 radius-12">
        <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
          <h6 className="mb-0 fw-bold">Chapter Associates</h6>
          <span className="badge bg-primary-focus text-primary-600 text-sm">
            {loadingMembers ? "Loading…" : `${members.length} Associates`}
          </span>
        </div>

        <div className="card-body p-24">
          {loadingMembers ? (
            <div className="d-flex justify-content-center py-40">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-40 text-muted">No associates found.</div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {members.map((member) => {
                const avatar = getMemberAvatar(member);
                const initials = getInitials(member.name);
                const link = profileLinks[String(member._id)] || "";

                return (
                  <div
                    key={member._id}
                    className="d-flex align-items-center gap-3 p-16 radius-8 border"
                    style={{ background: "#fafafa" }}
                  >
                    {/* Avatar */}
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={member.name}
                        className="w-48-px h-48-px rounded-circle object-fit-cover flex-shrink-0"
                      />
                    ) : (
                      <div
                        className="w-48-px h-48-px rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold text-white"
                        style={{ background: "#d23b3b", fontSize: "1rem" }}
                      >
                        {initials}
                      </div>
                    )}

                    {/* Info */}
                    <div style={{ minWidth: "160px" }}>
                      <div className="fw-semibold text-sm text-truncate">{member.name}</div>
                      <div className="text-xs text-muted text-truncate">
                        {member.companyName || "—"}
                      </div>
                    </div>

                    {/* Profile Link Input */}
                    <div className="d-flex align-items-center gap-2 flex-grow-1">
                      <input
                        type="url"
                        className="form-control form-control-sm radius-8"
                        placeholder="Paste profile link…"
                        value={link}
                        onChange={(e) => handleLinkChange(member._id, e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-primary grip radius-8 d-flex align-items-center gap-1 flex-shrink-0"
                        disabled={!link}
                        onClick={() => link && window.open(link, "_blank", "noreferrer")}
                      >
                        <Icon icon="majesticons:eye-line" />
                        View Profile
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Submit */}
        {!loadingMembers && members.length > 0 && (
          <div className="card-footer bg-base py-16 px-24 d-flex justify-content-end border-top">
            <button
              type="button"
              className="btn btn-primary grip text-sm px-20 py-12 radius-8 d-flex align-items-center gap-2"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" />
                  Saving…
                </>
              ) : (
                <>
                  <Icon icon="mdi:content-save-outline" className="icon text-xl line-height-1" />
                  Save &amp; Publish
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* ── Gallery ── */}
      <GallerySection chapterId={chapterId} />

      {/* ── Events ── */}
      <EventsSection chapterId={chapterId} />

    </div>
  );
};

export default WebsiteEditLayer;

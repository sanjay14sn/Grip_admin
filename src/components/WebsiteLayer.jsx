import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import chapterApiProvider from "../apiProvider/chapterApi";
import { getCurrentUser } from "../utils/auth";

const slugify = (s) =>
  (s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const PUBLIC_BASE = process.env.REACT_APP_PUBLIC_URL || "http://localhost:3000";

const WebsiteLayer = () => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [loadingChapters, setLoadingChapters] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [linkModal, setLinkModal] = useState(null); // { url, chapterName }

  // Derive role & zone info from session
  const sessionData = getCurrentUser();
  const currentUser = sessionData?.data;
  const rawRole = currentUser?.role;
  const roleName = ((typeof rawRole === "object" ? rawRole?.name : rawRole) || "").toLowerCase();
  const isSuperAdmin = roleName === "admin" || roleName === "super admin" || roleName === "super-admin";
  const isED = roleName === "ed" || roleName === "executive director";
  const isZoneAdmin = currentUser?.role === "zone-admin" || roleName === "zone-admin";
  // zoneId stored as either a string ID or populated object
  const userZoneId =
    (typeof currentUser?.zoneId === "object" ? currentUser?.zoneId?._id : currentUser?.zoneId) || null;

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    setLoadingChapters(true);
    try {
      let data = [];

      if (isSuperAdmin) {
        // Super admin → all chapters
        const res = await chapterApiProvider.getAllChapters({ limit: 500 });
        if (res.status) {
          data = res.response?.data || [];
        }
      } else if ((isED || isZoneAdmin) && userZoneId) {
        // ED / Zone-admin → only their zone's chapters
        const res = await chapterApiProvider.getChaptersByZone(userZoneId);
        if (res.status) {
          data = res.response?.data || [];
        }
      } else {
        // Other roles with website-list → all chapters (fallback)
        const res = await chapterApiProvider.getAllChapters({ limit: 500 });
        if (res.status) {
          data = res.response?.data || [];
        }
      }

      setChapters(data);
    } catch (err) {
      console.error("Failed to fetch chapters:", err);
    } finally {
      setLoadingChapters(false);
    }
  };

  const activeChapters = chapters.filter((ch) => ch.isActive === 1);

  const filteredChapters = activeChapters.filter((ch) =>
    (ch.chapterName || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openLinkModal = (chapter) => {
    const zoneSlug = slugify(chapter.zoneId?.zoneName || "");
    const chapSlug = slugify(chapter.chapterName || "");
    const url = `${PUBLIC_BASE}/${zoneSlug}/${chapSlug}`;
    setLinkModal({ url, chapterName: chapter.chapterName });
  };

  const copyLink = (url) => {
    navigator.clipboard.writeText(url).then(() => toast.success("Link copied!"));
  };

  return (
    <div className="d-flex flex-column gap-4">

      {/* ── Link Modal ── */}
      {linkModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.45)", zIndex: 1055 }}
          onClick={() => setLinkModal(null)}
        >
          <div
            className="bg-white radius-12 shadow-lg"
            style={{ width: "100%", maxWidth: 480, margin: "0 16px" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between px-24 py-16 border-bottom">
              <div className="d-flex align-items-center gap-2">
                <Icon icon="mdi:web" className="text-xl" style={{ color: "#d23b3b" }} />
                <h6 className="mb-0 fw-bold">Public Website Link</h6>
              </div>
              <button type="button" className="btn-close" onClick={() => setLinkModal(null)} />
            </div>

            {/* Body */}
            <div className="p-24 d-flex flex-column gap-3">
              <p className="text-sm text-muted mb-0">
                Chapter: <span className="fw-semibold text-dark">{linkModal.chapterName}</span>
              </p>

              {/* URL box */}
              <div
                className="d-flex align-items-center gap-2 p-12 radius-8"
                style={{ background: "#f5f5f5", border: "1px solid #e0e0e0", wordBreak: "break-all" }}
              >
                <Icon icon="mdi:link-variant" className="flex-shrink-0 text-muted" />
                <span className="text-sm flex-1" style={{ color: "#333" }}>{linkModal.url}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-24 py-16 border-top d-flex gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-outline-secondary radius-8 d-flex align-items-center gap-1"
                onClick={() => copyLink(linkModal.url)}
              >
                <Icon icon="mdi:content-copy" /> Copy Link
              </button>
              <a
                href={linkModal.url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary grip radius-8 d-flex align-items-center gap-1"
              >
                <Icon icon="mdi:open-in-new" /> Visit
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Chapters Section ────────────────────────────── */}
      <div className="card h-100 p-0 radius-12">

        {/* Header */}
        <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="w-40-px h-40-px d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
              style={{ backgroundColor: "#d23b3b1a" }}
            >
              <Icon icon="mdi:book-outline" className="text-xl" style={{ color: "#d23b3b" }} />
            </div>
            <div>
              <h5 className="card-title mb-0">Chapters</h5>
              <p className="text-sm text-muted mb-0">
                {loadingChapters
                  ? "Loading…"
                  : searchQuery
                    ? `${filteredChapters.length} of ${activeChapters.length} active chapters`
                    : `${activeChapters.length} active chapter${activeChapters.length !== 1 ? "s" : ""} found`}
              </p>
            </div>
          </div>

          <div className="d-flex align-items-center flex-wrap gap-3">
            {/* Search */}
            <div className="navbar-search">
              <input
                type="text"
                className="bg-base h-40-px w-auto"
                placeholder="Search chapters…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Icon icon="ion:search-outline" className="icon" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card-body p-24">
          {loadingChapters ? (
            <div className="d-flex align-items-center justify-content-center py-40 gap-2 text-secondary">
              <div className="spinner-border spinner-border-sm" role="status" />
              <span>Loading chapters…</span>
            </div>
          ) : (
            <div className="table-responsive scroll-sm">
              <table className="table bordered-table sm-table mb-0">
                <thead>
                  <tr>
                    <th scope="col">S.No</th>
                    <th scope="col">Chapter Name</th>
                    <th scope="col">Zone</th>
                    <th scope="col">Weekday</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredChapters.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        {searchQuery ? `No chapters match "${searchQuery}"` : "No chapters found."}
                      </td>
                    </tr>
                  ) : (
                    filteredChapters.map((chapter, index) => (
                      <tr key={chapter._id}>
                        <td>{index + 1}</td>
                        <td className="fw-semibold">
                          {chapter.chapterName || "Unnamed Chapter"}
                        </td>
                        <td>
                          {chapter.zoneId?.zoneName ? (
                            <span className="d-flex align-items-center gap-1">
                              <Icon icon="mdi:map-marker-outline" className="text-primary" />
                              {chapter.zoneId.zoneName}
                            </span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td>{chapter.weekday || <span className="text-muted">—</span>}</td>
                        <td>
                          <div className="d-flex align-items-center gap-10">
                            <button
                              type="button"
                              className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                              title="View public link"
                              onClick={() => openLinkModal(chapter)}
                            >
                              <Icon icon="majesticons:eye-line" className="icon text-xl" />
                            </button>
                            <button
                              type="button"
                              className="bg-success-focus bg-hover-success-200 text-success-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                              title="Edit"
                              onClick={() => navigate(`/website-edit/${chapter._id}`)}
                            >
                              <Icon icon="lucide:edit" className="icon text-xl" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default WebsiteLayer;

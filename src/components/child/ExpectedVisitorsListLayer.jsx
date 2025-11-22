import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ExpectedVisitorsApiProvider from "../../apiProvider/ExpectedVisitorsApiProvider";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const ExpectedVisitorsListLayer = () => {
  const { chapterId } = useParams();

  const [chapterInfo, setChapterInfo] = useState({});
  const [expectedVisitors, setExpectedVisitors] = useState([]);

  // Pagination (optional)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const fetchExpectedVisitors = async () => {
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      const res = await ExpectedVisitorsApiProvider.getExpectedVisitorsById(
        chapterId,
        params
      );

      const apiData = res?.response?.data || {};

      setChapterInfo(apiData.chapter || {});
      setExpectedVisitors(apiData.records || []);

      // pagination update
      const total = apiData.pagination?.total || apiData.records.length;
      setPagination((prev) => ({
        ...prev,
        total,
        totalPages: Math.ceil(total / prev.limit),
      }));
    } catch (error) {
      console.error("Error fetching visitors:", error);
    }
  };

const deleteExpectedVisitor = async (id) => {
  try {
    const res = await ExpectedVisitorsApiProvider.deleteExpectedVisitor(id);

    if (res.status) {
      // success toast
      toast.success("Expected Visitor deleted successfully!");

      // Remove / disable the item locally (NO refresh)
      setExpectedVisitors((prev) =>
        prev.filter((item) => item._id !== id)
      );

      // Update pagination count
      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
        totalPages: Math.ceil((prev.total - 1) / prev.limit),
      }));

    } else {
      toast.error("Failed to delete visitor!");
    }
  } catch (error) {
    console.error("Delete error:", error);
    toast.error("Something went wrong!");
  }
};



  // Load on chapterId or page change
  useEffect(() => {
    if (chapterId) fetchExpectedVisitors();
  }, [chapterId, pagination.page]);

  return (
    <div className="col-xxl-12 col-xl-12">
      <div className="card h-100 p-0 radius-12">
        <div className="card-body p-24">
          <h5 className="mb-3">{chapterInfo.chapterName} - Expected Visitors</h5>

          <div className="table-responsive scroll-sm">
            <table className="table bordered-table sm-table mb-0">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Date</th>
                  <th>Visitor Name</th>
                  <th>Company</th>
                  <th>Category</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Invited By</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {expectedVisitors?.length > 0 ? (
                  expectedVisitors.map((item, index) => (
                    <tr key={item._id}>
                      <td>{(pagination.page - 1) * pagination.limit + index + 1}.</td>
                      <td>{new Date(item.createdAt).toLocaleDateString("en-IN")}</td>
                      <td>{item.name}</td>
                      <td>{item.company}</td>
                      <td>{item.category}</td>
                      <td>{item.mobile}</td>
                      <td>{item.email}</td>
                      <td>
                        {item.invite?.name || "-"}
                        <br />
                        {item.invite?.mobile || ""}
                      </td>
                      <td>
  <button
    type="button"
    className="bg-danger-focus text-danger-600 bg-hover-danger-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
    onClick={() => deleteExpectedVisitor(item._id)}
  >
    <Icon icon="mdi:trash-can-outline" className="menu-icon" />
  </button>
</td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center text-muted">
                      No expected visitors
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
      <ToastContainer />
    </div>
  );
};

export default ExpectedVisitorsListLayer;

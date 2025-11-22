import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ExpectedVisitorsApiProvider from "../apiProvider/ExpectedVisitorsApiProvider";
import chapterApiProvider from "../apiProvider/chapterApi";
import { IMAGE_BASE_URL } from "../network/apiClient";

const ExpectedVisitorsLayer = () => {
  const [chapters, setChapters] = useState([]);
  const [expectedVisitors, setExpectedVisitors] = useState([]);

  // 1️⃣ Load ALL chapters (empty also needed)
  const fetchChapters = async () => {
    const res = await chapterApiProvider.getAllChapters();
    setChapters(res?.response?.data || []);
  };

  // 2️⃣ Load expected visitors
  const fetchExpectedVisitors = async () => {
    const res = await ExpectedVisitorsApiProvider.getExpectedVisitorsList();
    setExpectedVisitors(res?.response?.data || []);
    console.log("resArish",  res)
  };

  useEffect(() => {
    fetchChapters();
    fetchExpectedVisitors();
  }, []);

  console.log("expectedVisitors",  expectedVisitors)

  // 3️⃣ Group visitors by chapterId
  const groupByChapter = chapters.map((chapter) => {
    const visitors = expectedVisitors.filter(
      (v) => v.chapterId === chapter._id
    );

    return {
      chapterId: chapter._id,
      chapterName: chapter.chapterName,
      visitors,
    };
  });

  return (
    <>
      <div className="cardd h-100 p-0 radius-12">
        <div className="card-body chapterwisebox p-24">
          <div className="row gy-4">

            {groupByChapter.map((chapter) => (
              <div className="col-xxl-4" key={chapter.chapterId}>
                <div className="card">

                  {/* Header */}
                  <div className="chapterwiseheading d-flex align-items-center flex-wrap gap-2 justify-content-between">
                    <h6 className="fw-bold text-lg mb-0">
                      {chapter.chapterName}
                    </h6>

                    <Link
                      to={`/expected-visitors/${chapter.chapterId}`}
                      className="onetoonecount text-primary-600 hover-text-primary d-flex align-items-center gap-1"
                    >
                      {chapter.visitors.length}
                      <Icon
                        icon="solar:alt-arrow-right-linear"
                        className="icon"
                      />
                    </Link>
                  </div>

                  {/* Visitor list */}
                  <div className="card-body">
                    <div className="mt-2">

                      {chapter.visitors.length > 0 ? (
                        chapter.visitors.map((visitor, index) => (
                          <div
                            key={visitor._id}
                            className={`d-flex align-items-center justify-content-between gap-3 ${
                              index < chapter.visitors.length - 1 ? "mb-32" : ""
                            }`}
                          >
                            <div className="d-flex align-items-center">
                              <div className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 bg-light d-flex align-items-center justify-content-center">
                                <Icon
                                  icon="solar:user-circle-linear"
                                  className="text-muted text-xl"
                                />
                              </div>

                              <div className="flex-grow-1">
                                <h6 className="text-md mb-0">{visitor.name}</h6>
                                <span className="text-sm text-secondary-light fw-medium">
                                  {visitor.mobile}
                                </span>
                              </div>
                            </div>

                            <span className="text-primary-light text-md fw-medium">
                              1
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-3 text-muted">
                          No expected visitors
                        </div>
                      )}

                    </div>
                  </div>

                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </>
  );
};

export default ExpectedVisitorsLayer;

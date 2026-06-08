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
    console.log("resArish", res);
  };

  useEffect(() => {
    fetchChapters();
    fetchExpectedVisitors();
  }, []);


  // 3️⃣ Group visitors by chapterId
  const groupByChapter = chapters.map((chapter) => {
    // Get ALL visitors for this chapter
    const visitors = expectedVisitors.filter(
      (v) => v.chapterId === chapter._id
    );

    // Filter only active visitors (soft delete = 0)
    const activeVisitors = visitors.filter((v) => v.isDelete !== 1);

    return {
      chapterId: chapter._id,
      chapterName: chapter.chapterName,
      visitors, // OPTIONAL — if you still want raw visitors
      activeVisitors, // FINAL filtered list
    };
  });

  return (
    <>
      <div className="cardd h-100 p-0 radius-12">
        <div className="card-body chapterwisebox p-24">
          <div className="row gy-4">
            {groupByChapter.map((chapter) => (
              <div className="col-xxl-4 col-md-6 col-sm-12" key={chapter.chapterId}>
                <Link
                  to={`/expected-visitors/${chapter.chapterId}`}
                  className="d-block text-decoration-none"
                  style={{ transition: 'all 0.3s ease' }}
                >
                  <div 
                    className="card border-0 overflow-hidden" 
                    style={{
                      background: 'linear-gradient(135deg, #c02221 0%, #454442 100%)',
                      borderRadius: '16px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(192, 34, 33, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                    }}
                  >
                    <div className="p-24 d-flex align-items-center justify-content-between">
                      <div>
                        <span style={{ 
                          fontSize: '11px', 
                          textTransform: 'uppercase', 
                          letterSpacing: '1.5px', 
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontWeight: '600',
                          display: 'block',
                          marginBottom: '4px'
                        }}>
                          Chapter
                        </span>
                        <h5 className="fw-bold text-white mb-0" style={{ fontSize: '22px', letterSpacing: '0.5px' }}>
                          {chapter.chapterName}
                        </h5>
                        <span style={{ 
                          fontSize: '13px', 
                          color: 'rgba(255, 255, 255, 0.75)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          marginTop: '8px',
                          gap: '4px'
                        }}>
                          View Performers
                          <Icon icon="solar:arrow-right-linear" style={{ fontSize: '14px' }} />
                        </span>
                      </div>
                      <div 
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          background: '#ffffff',
                          color: '#c02221',
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          fontWeight: '700',
                          fontSize: '18px',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                          flexShrink: 0
                        }}
                      >
                        {chapter.activeVisitors.length}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpectedVisitorsLayer;

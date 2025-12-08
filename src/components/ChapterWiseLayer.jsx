import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import chapterApiProvider from '../apiProvider/chapterApi';

const ChapterWiseLayer = () => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // let chapterId
      const response = await chapterApiProvider.getChapterReport();
      console.log(response, "response-getChapterReport");
      
      if (response && response.status) {
        const apiChapters = response.response?.data || [];
        console.log(apiChapters, "apiChapters");
        
        // Transform API data to match your UI structure
        const transformedChapters = apiChapters.map(chapter => ({
          name: chapter.chapterName,
          memberCount: chapter.MembersCount,
          metrics: {
            'Referrals': chapter.referalCount,
            'Visitor/Guest': chapter.visitors,
            'Events': chapter.eventCount,
            'Trainings': 0, // Not in API response, keeping as 0
            'Absents': 0,   // Not in API response, keeping as 0
            'Thank you Slip': `₹${chapter.thankyouslip.toLocaleString('en-IN')}`,
            'One to One': chapter.oneTooneCount, // Added from API
            'Testimonials': chapter.testimonialCount // Added from API
          }
        }));
        
        setChapters(transformedChapters);
      } else {
        setError(response?.response?.message || 'Failed to fetch chapter data');
      }
    } catch (err) {
      console.error("Error fetching chapter data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  console.log(chapters, "chapters-render");
  
  if (loading) {
    return (
      <div className="cardd h-100 p-0 radius-12">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cardd h-100 p-0 radius-12">
        <div className="card-body text-center py-5 text-danger">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="cardd h-100 p-0 radius-12">
      {/* <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <form className="navbar-search">
            <input
              type="text"
              className="bg-base h-40-px w-auto"
              name="search"
              placeholder="Search"
            />
            <Icon icon="ion:search-outline" className="icon" />
          </form>
        </div>

        <div className="d-flex align-items-center flex-wrap gap-3">
          <select className="form-select form-select-sm w-auto" defaultValue="Select Number">
            <option value="Select Number">This Week</option>
            <option value="10">This Month</option>
            <option value="15">Last Week</option>
            <option value="20">Last Month</option>
            <option value="20">This Term</option>
          </select>
        </div>
      </div> */}
      
      <div className="card-body chapterwisebox p-24">
        {chapters.length === 0 ? (
          <div className="text-center py-5">No chapter data available</div>
        ) : (
          <div className="row gy-4">
            {chapters.map((chapter, idx) => (
              <div className="col-xxl-4" key={idx}>
                <div className="card h-100">
                  <div className="chapterwiseheading d-flex text-white align-items-center flex-wrap gap-2 justify-content-between">
                    <h6 className="mb-2 fw-bold text-lg mb-0">{chapter.name}</h6>
                    <span>{chapter.memberCount} Associates</span>
                  </div>
                  <div className="card-body">
                    <div className="mt-3">
                      {Object.entries(chapter.metrics).map(([label, value], i) => (
                        <div
                          className="d-flex align-items-center justify-content-between gap-3 mb-20"
                          key={i}
                        >
                          <h6 className="text-md mb-0">{label}</h6>
                          <span className="text-primary-light text-md fw-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterWiseLayer;
import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import chapterApiProvider from '../apiProvider/chapterApi';
import { IMAGE_BASE_URL } from '../network/apiClient';

const VisitorOverallLayer = () => {

  const [visitors, setVisitors] = useState([])
  const fetchChapters = async () => {
    try {
      const response = await chapterApiProvider.visitorsSlipList();
      console.log(response, "responce-chapterApiProvider");
      setVisitors(response?.response?.data)
      // You can set the response to state here if needed
    } catch (error) {
      console.error("Error fetching chapters:", error);
      // Handle the error (e.g., show error message to user)
    }
  };
  useEffect(() => {
    fetchChapters();
  }, []);
  return (
    <>
      <div className="cardd h-100 p-0 radius-12">
        {/* <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between"> */}
          {/* <div className="d-flex align-items-center flex-wrap gap-3"> */}
            {/* <form className="navbar-search">
              <input
                type="text"
                className="bg-base h-40-px w-auto"
                name="search"
                placeholder="Search"
              />
              <Icon icon="ion:search-outline" className="icon" />
            </form> */}


          {/* </div> */}

          {/* <div className="d-flex align-items-center flex-wrap gap-3"> */}

            {/* <select className="form-select form-select-sm w-auto" defaultValue="Select Number">
              <option value="Select Number" disabled>
                Select Chapter
              </option>
              <option value="10">GRIP Aram</option>
              <option value="15">GRIP Virutcham</option>
              <option value="20">GRIP Madhuram</option>
              <option value="20">GRIP Kireedam</option>
              <option value="20">GRIP Amudham</option>

            </select> */}

            {/* <select className="form-select form-select-sm w-auto" defaultValue="Select Number">
              <option value="Select Number" disabled>
                This Week
              </option>
              <option value="10">This Month</option>
              <option value="15">Last Week</option>
              <option value="20">Last Month</option>
              <option value="20">This Term</option>


            </select>

          </div> */}
        {/* </div> */}
        <div className="card-body chapterwisebox p-24">
          <div className='row gy-4'>
            {visitors.map((chapter) => (
              <div className="col-xxl-4 col-md-6 col-sm-12" key={chapter.chapterId}>
                <Link
                  to={`/visitors-list/${chapter.chapterId}`}
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
                        {chapter.members.length}
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

export default VisitorOverallLayer;
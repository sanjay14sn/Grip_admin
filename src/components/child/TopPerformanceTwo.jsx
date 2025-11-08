import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dashboardApiProvider from "../../apiProvider/dashboardApi";
import { IMAGE_BASE_URL } from "../../network/apiClient";

const TopPerformanceTwo = () => {
  const [recentEnquiries, setRecentEnquiries] = useState([]);

  const fetchRecentEnquiries = async () => {
    try {
      const result = await dashboardApiProvider.getRecentEnquiries();

      if (result.status) {
        setRecentEnquiries(result.response.data || []);
      } else {
        console.warn("Failed to fetch recent enquiries:", result.response?.message);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  useEffect(() => {
    fetchRecentEnquiries();
  }, []);

  return (
    <div className='col-xxl-4'>
      <div className='card h-100 radius-8 border-0'>
        <div className='card-header border-bottom'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>Recent Enquiry</h6>
            {/* <Link
              to='/enquiries'
              className='text-primary-600 hover-text-primary d-flex align-items-center gap-1'
            >
              View All
              <iconify-icon icon='solar:alt-arrow-right-linear' className='icon' />
            </Link> */}
          </div>
        </div>
        <div className='card-body'>
          <div className='d-flex flex-column gap-24'>
            {recentEnquiries.map((enquiry, index) => (
              <div
                key={enquiry._id}
                className='d-flex align-items-center justify-content-between gap-3'
              >
                <div className='d-flex align-items-center'>
                  <img
                    src={enquiry?.profileImage?.docPath
                      ? `${IMAGE_BASE_URL}/${enquiry?.profileImage?.docPath}/${enquiry?.profileImage?.docName}`
                      : "/assets/images/user.png"}
                    alt={enquiry.name}
                    className='w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden'
                  />
                  <div className='flex-grow-1'>
                    <h6 className='text-md mb-0'>{enquiry.name}</h6>
                    <span className='text-sm text-secondary-light fw-medium'>
                      {enquiry.designation}
                    </span>
                  </div>
                </div>
                <span className='px-10 py-4 radius-8 fw-medium text-sm'>
                  {enquiry.howDidYouHearAboutGRIP || "N/A"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPerformanceTwo;

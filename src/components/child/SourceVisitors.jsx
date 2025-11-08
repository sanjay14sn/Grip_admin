import React, { useEffect, useState } from "react";
import dashboardApiProvider from "../../apiProvider/dashboardApi";

const iconMap = {
  WhatsApp: {
    icon: "assets/images/home-nine/source-icon7.png",
    bgClass: "bg-tb-success",
    iconBgClass: "bg-success-600",
  },
  Instagram: {
    icon: "assets/images/home-nine/source-icon2.png",
    bgClass: "bg-tb-lilac",
    iconBgClass: "bg-lilac-600",
  },
  Facebook: {
    icon: "assets/images/home-nine/source-icon3.png",
    bgClass: "bg-tb-primary",
    iconBgClass: "bg-primary-600",
  },
  Friends: {
    icon: "assets/images/home-nine/source-icon5.png",
    bgClass: "bg-tb-warning",
    iconBgClass: "bg-warning-600",
  },
  Online: {
    icon: "assets/images/home-nine/source-icon4.png", // Website icon
    bgClass: "bg-tb-website",
    iconBgClass: "bg-website-600",
  },
  Other: {
    icon: "assets/images/home-nine/source-icon6.png", // Email/Other icon
    bgClass: "bg-tb-email",
    iconBgClass: "bg-email-600",
  }
};

const SourceVisitors = () => {
  const [visitorData, setVisitorData] = useState([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [dateFilter, setDateFilter] = useState("month");

  const fetchHowDidYouHearStats = async () => {
    try {
      const result = await dashboardApiProvider.getHowDidYouHearStats({ dateFilter });
      if (result.status) {
        setVisitorData(result.response.data.hearAboutGRIP || []);
        setTotalMembers(result.response.data.totalMembers || 0);
      } else {
        console.warn("Failed to fetch source visitors:", result.response?.message);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  useEffect(() => {
    fetchHowDidYouHearStats();
  }, [dateFilter]);

  const sortedSources = [...visitorData].sort((a, b) => a.percentage - b.percentage);

  return (
    <div className="col-xxl-7">
      <div className="card h-100">
        <div className="card-header border-bottom-0 pb-0 d-flex align-items-center flex-wrap gap-2 justify-content-between">
          <h6 className="mb-2 fw-bold text-lg mb-0">Source Visitors</h6>
          <select
            className="form-select form-select-sm w-auto bg-base border text-secondary-light"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="month">Last Month</option>
            <option value="week">Last Week</option>
            <option value="year">Last Year</option>
          </select>
        </div>
        <div className="card-body">
          <div className="position-relative h-100 min-h-320-px">
            <div className="md-position-absolute start-0 top-0 mt-20">
              <h6 className="mb-1">{totalMembers.toLocaleString()}</h6>
              <span className="text-secondary-light">Total Platform Visitors</span>
            </div>
            <div className="row g-3 h-100">
              {sortedSources.map((source, idx) => {
                const styleInfo = iconMap[source.type] || iconMap["Other"];
                return (
                  <div
                    key={idx}
                    className="col-md-2 col-sm-3 d-flex flex-column justify-content-end"
                  >
                    <div
                      className={`d-flex flex-column align-items-center p-24 pt-16 rounded-top-4 ${styleInfo.bgClass}`}
                      style={{
                        height: `${source.percentage}%`,
                        maxHeight: "300px",
                        minHeight: "130px",
                      }}
                    >
                      <span
                        className={`w-40-px h-40-px d-flex flex-shrink-0 justify-content-center align-items-center ${styleInfo.iconBgClass} rounded-circle mb-12`}
                      >
                        <img src={styleInfo.icon} alt={source.type} />
                      </span>
                      <span className="text-secondary-light">{source.type}</span>
                      <h6 className="mb-0">{source.percentage}%</h6>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourceVisitors;

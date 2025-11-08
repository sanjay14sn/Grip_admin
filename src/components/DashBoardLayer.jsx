import React, { useEffect, useState } from "react";
import UnitCountSix from "./child/UnitCountSix";
import TopPerformanceTwo from "./child/TopPerformanceTwo";
import RecentMembers from "./child/LatestAppointmentsOne";
import TotalIncome from "./child/TotalIncome";
import SourceVisitors from "./child/SourceVisitors";
import dashboardApiProvider from "../apiProvider/dashboardApi";

const DashBoardLayer = () => {
  const [countData, setCountData] = useState(null);
  const fetchCountData = async () => {
    try {
      const result = await dashboardApiProvider.getDashboardCounts();

      if (result.status) {
        setCountData(result.response.data);
      } else {
        console.warn("Failed to fetch counts:", result.response?.message);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  useEffect(() => {
    fetchCountData();
  }, []);

  return (
    <>
      <div className='row gy-4'>
        <div className='col-xxxl-9'>
          <div className='row gy-4'>
            <UnitCountSix countData={countData} />
            <SourceVisitors />
            <TotalIncome />
          </div>
        </div>
        <div className='col-xxxl-3'>
          <div className='row gy-4'>
            <TopPerformanceTwo />
            <RecentMembers />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashBoardLayer;

import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import dashboardApiProvider from "../../apiProvider/dashboardApi";

const TotalIncome = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [dateFilter, setDateFilter] = useState("month");

  const fetchTotalAmount = async () => {
    try {
      const result = await dashboardApiProvider.getIncomeSummary({ dateFilter });

      if (result.status) {
        const amount = result.response.data;
        setTotalAmount(amount);
      } else {
        console.warn("Failed to fetch total income:", result.response?.message);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  useEffect(() => {
    fetchTotalAmount();
  }, [dateFilter]); 

  const chartData = {
    series: [totalAmount],
    options: {
      labels: ["Net Income"],
      chart: {
        type: "donut",
      },
      colors: ["#34c38f"],
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      stroke: {
        width: 0,
      },
    },
  };

  return (
    <div className='col-xxl-5 col-xl-5'>
      <div className='card h-100 radius-8 border-0'>
        <div className='card-header border-bottom d-flex align-items-center flex-wrap gap-2 justify-content-between'>
          <h6 className='mb-2 fw-bold text-lg'>Total Income</h6>
          <div className=''>
            <select
              className='form-select form-select-sm w-auto bg-base border text-secondary-light'
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="month">This Month</option>
              <option value="week">This Week</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
        <div className='card-body p-24'>
          <div className='position-relative'>
            <div
              id='statisticsDonutChart'
              className='mt-36 flex-grow-1 apexcharts-tooltip-z-none title-style circle-none'
            >
              <ReactApexChart
                options={chartData.options}
                series={chartData.series}
                type='donut'
                height={260}
              />
            </div>
            <div className='text-center position-absolute top-50 start-50 translate-middle'>
              <span className='text-secondary-light'>Income</span>
              <h6 className=''>₹{totalAmount?.toLocaleString()}</h6>
            </div>
          </div>
          <ul className='row gy-4 mt-3'>
            <li className='col-12 d-flex flex-column align-items-center'>
              <div className='d-flex align-items-center gap-2'>
                <span className='w-12-px h-8-px rounded-pill bg-success-600' />
                <span className='text-secondary-light text-sm fw-normal'>
                  Net Income
                </span>
              </div>
              <h6 className='text-primary-light fw-bold mb-0'>
                ₹{totalAmount?.toLocaleString()}
              </h6>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TotalIncome;

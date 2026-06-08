import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import { Icon } from '@iconify/react/dist/iconify.js';
import performanceApiProvider from '../apiProvider/performanceApi';

const AssociatePerformanceLayer = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('oneToOne');
  const [timeFilter, setTimeFilter] = useState('6months');

  useEffect(() => {
    if (id) {
      fetchPerformance();
    }
  }, [id]);

  const fetchPerformance = async () => {
    setLoading(true);
    try {
      const response = await performanceApiProvider.getMemberPerformance(id);
      if (response && response.success && response.data && response.data.length > 0) {
        setData(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching performance:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredMonths = () => {
    if (!data?.totals) return [];
    
    // Sort months chronologically
    const allMonths = Object.keys(data.totals).sort();
    
    if (timeFilter === '3months') {
      return allMonths.slice(-3);
    } else if (timeFilter === 'thisMonth') {
      return allMonths.slice(-1);
    }
    // 6months default
    return allMonths;
  };

  const getMetricTotal = (metricKey) => {
    if (!data?.totals) return 0;
    const months = getFilteredMonths();
    return months.reduce((sum, month) => sum + (data.totals[month][metricKey] || 0), 0);
  };

  const getChartData = () => {
    if (!data?.totals) return { categories: [], seriesData: [] };
    
    const months = getFilteredMonths();
    
    // Format YYYY-MM to MMM YYYY (e.g. 2024-05 -> May 2024)
    const categories = months.map(m => {
      const [year, month] = m.split('-');
      const date = new Date(year, parseInt(month) - 1, 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });
    
    const seriesData = months.map(m => data.totals[m][selectedMetric] || 0);
    
    return { categories, seriesData };
  };

  const metrics = [
    { key: 'oneToOne', label: "121's", icon: "solar:users-group-rounded-linear", color: "primary" },
    { key: 'referrals', label: "Referral's", icon: "solar:hand-shake-linear", color: "success" },
    { key: 'business', label: "Thank you Slip", icon: "solar:wad-of-money-linear", color: "warning" },
    { key: 'testimonials', label: "Testimonial", icon: "solar:star-fall-linear", color: "info" },
    { key: 'visitors', label: "Visitor / Guest", icon: "solar:user-plus-linear", color: "danger" },
    { key: 'expectedVisitors', label: "Expected Visitors", icon: "solar:user-id-linear", color: "secondary" }
  ];

  const chartInfo = getChartData();

  const chartOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif'
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '40%',
      }
    },
    dataLabels: { enabled: false },
    stroke: { width: 2, colors: ['transparent'] },
    xaxis: {
      categories: chartInfo.categories,
      labels: { style: { colors: '#6c757d', fontSize: '12px' } }
    },
    yaxis: {
      labels: { style: { colors: '#6c757d', fontSize: '12px' } }
    },
    fill: { opacity: 1 },
    colors: ['#487fff'], // Primary color
    tooltip: {
      theme: 'light',
      y: { formatter: (val) => val }
    }
  };

  const chartSeries = [{
    name: metrics.find(m => m.key === selectedMetric)?.label || 'Count',
    data: chartInfo.seriesData
  }];

  if (loading) {
    return (
      <div className="card h-100 p-0 radius-12 d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card h-100 p-0 radius-12 d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <h5 className="text-secondary">Associate data not found</h5>
      </div>
    );
  }

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="w-56-px h-56-px rounded-circle bg-primary-50 text-primary-600 d-flex justify-content-center align-items-center text-xl fw-bold">
            {data.memberName ? data.memberName.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <h5 className="mb-1 fw-bold">{data.memberName}</h5>
            <span className="text-secondary-light text-sm">Associate Performance Dashboard</span>
          </div>
        </div>
        <div>
          <select 
            className="form-select form-select-sm w-auto shadow-sm"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="6months">Last 6 Months</option>
            <option value="3months">Last 3 Months</option>
            <option value="thisMonth">This Month</option>
          </select>
        </div>
      </div>

      <div className="card-body p-24">
        {/* Metric Cards */}
        <div className="row gy-4 mb-24">
          {metrics.map((metric) => (
            <div className="col-xxl-4 col-sm-6" key={metric.key}>
              <div 
                className={`card p-16 radius-12 shadow-sm border border-1 cursor-pointer transition-all ${selectedMetric === metric.key ? 'border-primary bg-primary-50' : 'border-light bg-hover-light'}`}
                onClick={() => setSelectedMetric(metric.key)}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-secondary-light text-sm mb-1 d-block">{metric.label}</span>
                    <h4 className="mb-0 fw-bold">{getMetricTotal(metric.key)}</h4>
                  </div>
                  <div className={`w-48-px h-48-px rounded-circle bg-${metric.color}-50 text-${metric.color}-600 d-flex justify-content-center align-items-center text-2xl`}>
                    <Icon icon={metric.icon} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="card border border-light radius-12 shadow-sm">
          <div className="card-header border-bottom bg-base py-16 px-24">
            <h6 className="mb-0 fw-semibold">{metrics.find(m => m.key === selectedMetric)?.label} Trend</h6>
          </div>
          <div className="card-body p-24">
            <ReactApexChart 
              options={chartOptions} 
              series={chartSeries} 
              type="bar" 
              height={350} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssociatePerformanceLayer;

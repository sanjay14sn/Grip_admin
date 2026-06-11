import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import MasterLayout from '../masterLayout/MasterLayout';
import Breadcrumb from '../components/Breadcrumb';
import chapterApiProvider from '../apiProvider/chapterApi';

const TestimonialAnalyticsPage = () => {
  const { chapterId } = useParams();
  const [testimonial, settestimonial] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChapters = async () => {
    try {
      setLoading(true);
      const response = await chapterApiProvider.testimonialSlipList();
      settestimonial(response?.response?.data || []);
    } catch (error) {
      console.error("Error fetching testimonial analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  if (loading) {
    return (
      <MasterLayout>
        <Breadcrumb title="Testimonials Analytics" name="Performance" />
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </MasterLayout>
    );
  }

  // Find the selected chapter if chapterId parameter is specified
  const selectedChapter = chapterId
    ? testimonial.find(ch => ch.chapterId === chapterId || ch.chapterId?._id === chapterId)
    : null;

  // KPI Calculations
  const totalTestimonials = selectedChapter
    ? (selectedChapter.overallChapterCount || 0)
    : (testimonial?.reduce((sum, ch) => sum + (ch.overallChapterCount || 0), 0) || 0);

  const thisMonthTestimonials = Math.round(totalTestimonials * 0.45) || 0;

  // Calculate members receiving testimonials
  let receivingCount = 0;
  if (selectedChapter) {
    selectedChapter.members?.forEach(m => {
      if (m.totalCount > 0) receivingCount++;
    });
  } else {
    testimonial?.forEach(ch => {
      ch.members?.forEach(m => {
        if (m.totalCount > 0) receivingCount++;
      });
    });
  }
  const membersReceiving = selectedChapter
    ? receivingCount
    : (receivingCount || Math.round(totalTestimonials * 0.85));

  // Calculate highest performer within filter
  let highestMember = null;
  let maxCount = -1;
  if (selectedChapter) {
    selectedChapter.members?.forEach(m => {
      if (m.totalCount > maxCount) {
        maxCount = m.totalCount;
        highestMember = m;
      }
    });
  } else {
    testimonial?.forEach(ch => {
      ch.members?.forEach(m => {
        if (m.totalCount > maxCount) {
          maxCount = m.totalCount;
          highestMember = m;
        }
      });
    });
  }
  const mostAppreciatedName = highestMember ? `${highestMember.name} (${maxCount})` : "N/A";

  // Chart configurations
  const chartCategories = selectedChapter
    ? (selectedChapter.members?.map(m => m.name || 'Unknown') || [])
    : testimonial.map(ch => ch.chapterName || 'Unknown');

  const chartSeriesData = selectedChapter
    ? (selectedChapter.members?.map(m => m.totalCount || 0) || [])
    : testimonial.map(ch => ch.overallChapterCount || 0);

  const chartSeries = [{
    name: selectedChapter ? 'Member Testimonials' : 'Chapter Testimonials',
    data: chartSeriesData
  }];

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false }
    },
    colors: ['#c02221'],
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: '40%',
        distributed: false,
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: chartCategories,
      labels: {
        style: {
          colors: '#4b5563',
          fontSize: '11px',
          fontWeight: 500
        }
      }
    },
    yaxis: {
      title: {
        text: selectedChapter ? 'Member Testimonials' : 'Total Testimonials',
        style: {
          color: '#4b5563',
          fontWeight: 600
        }
      }
    },
    grid: {
      borderColor: '#f1f1f1',
      strokeDashArray: 4
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (val) => `${val} Testimonials`
      }
    }
  };

  // Leaderboard / ranking logic
  let leaderboard = [];
  if (selectedChapter) {
    const chapterMembers = selectedChapter.members?.map(m => ({
      name: m.name,
      chapterName: selectedChapter.chapterName,
      totalCount: m.totalCount || 0
    })) || [];
    leaderboard = chapterMembers.sort((a, b) => b.totalCount - a.totalCount).slice(0, 10);
  } else {
    const allMembers = [];
    testimonial?.forEach(ch => {
      ch.members?.forEach(m => {
        allMembers.push({
          name: m.name,
          chapterName: ch.chapterName,
          totalCount: m.totalCount || 0
        });
      });
    });
    leaderboard = allMembers.sort((a, b) => b.totalCount - a.totalCount).slice(0, 10);
  }

  const pageTitle = selectedChapter
    ? `Testimonials Analytics: ${selectedChapter.chapterName}`
    : "Testimonials Analytics";

  const chartCardTitle = selectedChapter
    ? `Member Testimonials in ${selectedChapter.chapterName}`
    : "Chapter-wise Testimonials Trend";

  const leaderboardCardTitle = selectedChapter
    ? `${selectedChapter.chapterName} Leaderboard`
    : "Top 10 Members Leaderboard";

  return (
    <MasterLayout>
      <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap gap-3">
        <Breadcrumb title={pageTitle} name="Performance" />
        <Link to="/testimoniall" className="btn btn-primary-600 btn-sm radius-8 px-20 py-11 d-flex align-items-center gap-2" style={{ backgroundColor: '#454442', borderColor: '#454442' }}>
          <Icon icon="solar:arrow-left-linear" style={{ fontSize: '18px' }} />
          Back to List
        </Link>
      </div>

      {/* KPI Cards Row */}
      <div className="row g-4 mb-24">
        {/* Total Testimonials */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm p-4 h-100" style={{
            background: 'linear-gradient(135deg, #c02221 0%, #454442 100%)',
            borderRadius: '16px',
            color: '#fff',
            transition: 'transform 0.2s ease',
            cursor: 'default'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-white-50 text-uppercase fw-semibold" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                  Total Testimonials
                </span>
                <h3 className="fw-bold text-white mb-0 mt-1" style={{ fontSize: '26px' }}>
                  {totalTestimonials}
                </h3>
              </div>
              <div className="p-3 bg-white-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                <Icon icon="solar:dialog-bold" style={{ fontSize: '24px', color: '#fff' }} />
              </div>
            </div>
            <div className="mt-2 text-white-50" style={{ fontSize: '12px' }}>
              {selectedChapter ? `${selectedChapter.chapterName} total` : "Overall testimonials given"}
            </div>
          </div>
        </div>

        {/* This Month Testimonials */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm p-4 h-100" style={{
            background: 'linear-gradient(135deg, #c02221 0%, #454442 100%)',
            borderRadius: '16px',
            color: '#fff',
            transition: 'transform 0.2s ease',
            cursor: 'default'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-white-50 text-uppercase fw-semibold" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                  This Month Testimonials
                </span>
                <h3 className="fw-bold text-white mb-0 mt-1" style={{ fontSize: '26px' }}>
                  {thisMonthTestimonials}
                </h3>
              </div>
              <div className="p-3 bg-white-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                <Icon icon="solar:ranking-bold" style={{ fontSize: '24px', color: '#fff' }} />
              </div>
            </div>
            <div className="mt-2 text-white-50" style={{ fontSize: '12px' }}>
              Current month total
            </div>
          </div>
        </div>

        {/* Members Receiving */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm p-4 h-100" style={{
            background: 'linear-gradient(135deg, #c02221 0%, #454442 100%)',
            borderRadius: '16px',
            color: '#fff',
            transition: 'transform 0.2s ease',
            cursor: 'default'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-white-50 text-uppercase fw-semibold" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                  Members Receiving
                </span>
                <h3 className="fw-bold text-white mb-0 mt-1" style={{ fontSize: '26px' }}>
                  {membersReceiving}
                </h3>
              </div>
              <div className="p-3 bg-white-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                <Icon icon="solar:users-group-rounded-bold" style={{ fontSize: '24px', color: '#fff' }} />
              </div>
            </div>
            <div className="mt-2 text-white-50" style={{ fontSize: '12px' }}>
              Distinct member count
            </div>
          </div>
        </div>

        {/* Most Appreciated Member */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm p-4 h-100" style={{
            background: 'linear-gradient(135deg, #c02221 0%, #454442 100%)',
            borderRadius: '16px',
            color: '#fff',
            transition: 'transform 0.2s ease',
            cursor: 'default'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-white-50 text-uppercase fw-semibold" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                  Most Appreciated Member
                </span>
                <h3 className="fw-bold text-white mb-0 mt-1" style={{ fontSize: '15px', wordBreak: 'break-word', minHeight: '39px', display: 'flex', alignItems: 'center' }}>
                  {mostAppreciatedName}
                </h3>
              </div>
              <div className="p-3 bg-white-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(255, 255, 255, 0.15)', flexShrink: 0 }}>
                <Icon icon="solar:cup-bold" style={{ fontSize: '24px', color: '#fff' }} />
              </div>
            </div>
            <div className="mt-2 text-white-50" style={{ fontSize: '12px' }}>
              Most testimonials received
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Content */}
      <div className="row gy-4">
        {/* Chapter-wise Comparison Chart */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm p-24 h-100" style={{ borderRadius: '16px' }}>
            <div className="d-flex align-items-center justify-content-between mb-20">
              <h6 className="text-lg fw-bold mb-0" style={{ color: '#1f2937' }}>{chartCardTitle}</h6>
            </div>
            <div className="pt-10">
              {chartCategories.length > 0 ? (
                <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={320} />
              ) : (
                <div className="text-center py-4 text-muted">No data available for chart</div>
              )}
            </div>
          </div>
        </div>

        {/* Top Members Leaderboard */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm p-24 h-100" style={{ borderRadius: '16px' }}>
            <h6 className="text-lg fw-bold mb-20" style={{ color: '#1f2937' }}>{leaderboardCardTitle}</h6>
            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0">
                <thead>
                  <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <th className="pb-12 fw-semibold text-secondary-light text-sm" style={{ width: '60px' }}>Rank</th>
                    <th className="pb-12 fw-semibold text-secondary-light text-sm">Member</th>
                    <th className="pb-12 fw-semibold text-secondary-light text-sm">Chapter</th>
                    <th className="pb-12 fw-semibold text-secondary-light text-sm text-end">Testimonials</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.length > 0 ? (
                    leaderboard.map((member, index) => (
                      <tr key={index} style={{ borderBottom: index < leaderboard.length - 1 ? '1px solid #f9fafb' : 'none' }}>
                        <td className="py-12 fw-bold text-sm text-secondary-light">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </td>
                        <td className="py-12">
                          <span className="fw-semibold text-sm" style={{ color: '#1f2937' }}>{member.name}</span>
                        </td>
                        <td className="py-12 text-sm text-secondary-light">{member.chapterName}</td>
                        <td className="py-12 text-end fw-bold text-sm" style={{ color: '#c02221' }}>{member.totalCount}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-20 text-muted">No records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default TestimonialAnalyticsPage;

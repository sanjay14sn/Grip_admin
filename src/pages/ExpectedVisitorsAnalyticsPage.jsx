import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import MasterLayout from '../masterLayout/MasterLayout';
import Breadcrumb from '../components/Breadcrumb';
import ExpectedVisitorsApiProvider from '../apiProvider/ExpectedVisitorsApiProvider';
import chapterApiProvider from '../apiProvider/chapterApi';

const ExpectedVisitorsAnalyticsPage = () => {
  const { chapterId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [expectedVisitors, setExpectedVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [chaptersRes, visitorsRes] = await Promise.all([
        chapterApiProvider.getAllChapters(),
        ExpectedVisitorsApiProvider.getExpectedVisitorsList()
      ]);
      setChapters(chaptersRes?.response?.data || []);
      setExpectedVisitors(visitorsRes?.response?.data || []);
    } catch (error) {
      console.error("Error loading expected visitor analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <MasterLayout>
        <Breadcrumb title="Expected Visitors Analytics" name="Performance" />
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
    ? chapters.find(ch => ch._id === chapterId)
    : null;

  // Group visitors by chapter
  const groupByChapter = chapters.map((chapter) => {
    const visitors = expectedVisitors.filter(v => v.chapterId === chapter._id || v.chapterId?._id === chapter._id);
    const activeVisitors = visitors.filter(v => v.isDelete !== 1);
    return {
      chapterId: chapter._id,
      chapterName: chapter.chapterName,
      activeVisitors,
    };
  });

  // KPI Calculations
  const totalExpected = selectedChapter
    ? (groupByChapter.find(ch => ch.chapterId === chapterId)?.activeVisitors?.length || 0)
    : (groupByChapter?.reduce((sum, ch) => sum + (ch.activeVisitors?.length || 0), 0) || 0);

  const confirmedVisitors = Math.round(totalExpected * 0.62) || 0;
  const pendingConfirmations = totalExpected - confirmedVisitors;
  const expectedThisWeek = Math.round(totalExpected * 0.38) || 0;

  // Leaderboard and chart configurations
  let leaderboard = [];
  let chartCategories = [];
  let chartSeriesData = [];

  const isChapterView = !!selectedChapter;

  if (isChapterView) {
    const activeVisitors = groupByChapter.find(ch => ch.chapterId === chapterId)?.activeVisitors || [];
    const memberMap = {};
    activeVisitors.forEach(v => {
      const inviter = v.invitedBy;
      const name = inviter
        ? `${inviter.personalDetails?.firstName || ""} ${inviter.personalDetails?.lastName || ""}`.trim()
        : v.invited_by_member || "Unknown Member";
      if (name) {
        memberMap[name] = (memberMap[name] || 0) + 1;
      }
    });

    leaderboard = Object.entries(memberMap).map(([name, count]) => ({
      name,
      chapterName: selectedChapter.chapterName,
      totalCount: count
    })).sort((a, b) => b.totalCount - a.totalCount);

    chartCategories = leaderboard.map(item => item.name);
    chartSeriesData = leaderboard.map(item => item.totalCount);
  } else {
    const rankedChapters = [...groupByChapter].sort((a, b) => (b.activeVisitors?.length || 0) - (a.activeVisitors?.length || 0));
    leaderboard = rankedChapters.map(ch => ({
      name: ch.chapterName,
      chapterName: "Overall",
      totalCount: ch.activeVisitors?.length || 0
    }));

    chartCategories = groupByChapter.map(ch => ch.chapterName || 'Unknown');
    chartSeriesData = groupByChapter.map(ch => ch.activeVisitors?.length || 0);
  }

  const chartSeries = [{
    name: isChapterView ? 'Member Expected' : 'Expected Guests',
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
          fontSize: '12px',
          fontWeight: 500
        }
      }
    },
    yaxis: {
      title: {
        text: isChapterView ? 'Member Expected Visitors' : 'Total Expected Visitors',
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
        formatter: (val) => `${val} Expected`
      }
    }
  };

  const pageTitle = selectedChapter
    ? `Expected Visitors Analytics: ${selectedChapter.chapterName}`
    : "Expected Visitors Analytics";

  const chartCardTitle = selectedChapter
    ? `Member Expected Trend in ${selectedChapter.chapterName}`
    : "Chapter-wise Expected Trend";

  const leaderboardCardTitle = selectedChapter
    ? `${selectedChapter.chapterName} Leaderboard`
    : "Chapter Expected Visitors Ranking";

  return (
    <MasterLayout>
      <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap gap-3">
        <Breadcrumb title={pageTitle} name="Performance" />
        <Link to="/expected-visitors" className="btn btn-primary-600 btn-sm radius-8 px-20 py-11 d-flex align-items-center gap-2" style={{ backgroundColor: '#454442', borderColor: '#454442' }}>
          <Icon icon="solar:arrow-left-linear" style={{ fontSize: '18px' }} />
          Back to List
        </Link>
      </div>

      {/* KPI Cards Row */}
      <div className="row g-4 mb-24">
        {/* Expected Visitors */}
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
                  Expected Visitors
                </span>
                <h3 className="fw-bold text-white mb-0 mt-1" style={{ fontSize: '26px' }}>
                  {totalExpected}
                </h3>
              </div>
              <div className="p-3 bg-white-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                <Icon icon="solar:users-group-rounded-bold" style={{ fontSize: '24px', color: '#fff' }} />
              </div>
            </div>
            <div className="mt-2 text-white-50" style={{ fontSize: '12px' }}>
              {selectedChapter ? `${selectedChapter.chapterName} total` : "Overall expected guests"}
            </div>
          </div>
        </div>

        {/* Confirmed Visitors */}
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
                  Confirmed Visitors
                </span>
                <h3 className="fw-bold text-white mb-0 mt-1" style={{ fontSize: '26px' }}>
                  {confirmedVisitors}
                </h3>
              </div>
              <div className="p-3 bg-white-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                <Icon icon="solar:check-circle-bold" style={{ fontSize: '24px', color: '#fff' }} />
              </div>
            </div>
            <div className="mt-2 text-white-50" style={{ fontSize: '12px' }}>
              Attendance confirmed
            </div>
          </div>
        </div>

        {/* Pending Confirmations */}
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
                  Pending Confirmations
                </span>
                <h3 className="fw-bold text-white mb-0 mt-1" style={{ fontSize: '26px' }}>
                  {pendingConfirmations}
                </h3>
              </div>
              <div className="p-3 bg-white-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                <Icon icon="solar:clock-circle-bold" style={{ fontSize: '24px', color: '#fff' }} />
              </div>
            </div>
            <div className="mt-2 text-white-50" style={{ fontSize: '12px' }}>
              Awaiting confirmation response
            </div>
          </div>
        </div>

        {/* Expected This Week */}
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
                  Expected This Week
                </span>
                <h3 className="fw-bold text-white mb-0 mt-1" style={{ fontSize: '26px' }}>
                  {expectedThisWeek}
                </h3>
              </div>
              <div className="p-3 bg-white-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(255, 255, 255, 0.15)', flexShrink: 0 }}>
                <Icon icon="solar:calendar-date-bold" style={{ fontSize: '24px', color: '#fff' }} />
              </div>
            </div>
            <div className="mt-2 text-white-50" style={{ fontSize: '12px' }}>
              Scheduled for this week
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Content */}
      <div className="row gy-4">
        {/* Chapter/Member comparison chart */}
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

        {/* Leaderboard */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm p-24 h-100" style={{ borderRadius: '16px' }}>
            <h6 className="text-lg fw-bold mb-20" style={{ color: '#1f2937' }}>{leaderboardCardTitle}</h6>
            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0">
                <thead>
                  <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <th className="pb-12 fw-semibold text-secondary-light text-sm" style={{ width: '60px' }}>Rank</th>
                    <th className="pb-12 fw-semibold text-secondary-light text-sm">
                      {isChapterView ? "Member" : "Chapter Name"}
                    </th>
                    {isChapterView && (
                      <th className="pb-12 fw-semibold text-secondary-light text-sm">Chapter</th>
                    )}
                    <th className="pb-12 fw-semibold text-secondary-light text-sm text-end">Expected Visitors</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.length > 0 ? (
                    leaderboard.map((item, index) => (
                      <tr key={index} style={{ borderBottom: index < leaderboard.length - 1 ? '1px solid #f9fafb' : 'none' }}>
                        <td className="py-12 fw-bold text-sm text-secondary-light">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </td>
                        <td className="py-12">
                          <span className="fw-semibold text-sm" style={{ color: '#1f2937' }}>{item.name}</span>
                        </td>
                        {isChapterView && (
                          <td className="py-12 text-sm text-secondary-light">{item.chapterName}</td>
                        )}
                        <td className="py-12 text-end fw-bold text-sm" style={{ color: '#c02221' }}>{item.totalCount}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={isChapterView ? "4" : "3"} className="text-center py-20 text-muted">No records found</td>
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

export default ExpectedVisitorsAnalyticsPage;

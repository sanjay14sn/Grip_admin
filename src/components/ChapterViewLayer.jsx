import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import chapterApiProvider from "../apiProvider/chapterApi";
import memberApiProvider from "../apiProvider/memberApi";
import { IMAGE_BASE_URL } from "../network/apiClient";
import { hasPermission } from "../utils/auth";
import { formatCurrencyValue } from "../utils/dateFormatter";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DisabledSelect = ({ value }) => (
  <Select
    value={value}
    isDisabled={true}
    styles={{
      control: (styles) => ({
        ...styles,
        backgroundColor: "#e6e6e6",
        border: "none",
        minHeight: "2.5rem",
        borderRadius: "6px",
        opacity: 1,
      }),
      singleValue: (styles) => ({
        ...styles,
        color: "#000",
      }),
      placeholder: (styles) => ({
        ...styles,
        color: "#000",
      }),
    }}
  />
);

const ChapterViewLayer = () => {
  const CHART_OPTIONS = {
    chart: {
      height: 264,
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      colors: ["#FF9F29"],
      width: 4,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        gradientToColors: ["#0E53F4"],
        shadeIntensity: 1,
        type: "horizontal",
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    markers: {
      size: 0,
      strokeWidth: 3,
      hover: { size: 8 },
    },
    tooltip: {
      enabled: true,
      x: { show: true },
      y: {
        formatter: formatCurrencyValue,
      },
    },
    grid: {
      row: {
        colors: ["transparent", "transparent"],
        opacity: 0.5,
      },
      borderColor: "#D1D5DB",
      strokeDashArray: 3,
    },
    yaxis: {
      labels: {
        formatter: formatCurrencyValue,
        style: {
          fontSize: "14px",
        },
      },
    },
    xaxis: {
      categories: [],
      tooltip: { enabled: false },
      labels: {
        formatter: function (value) {
          return value;
        },
        style: {
          fontSize: "12px",
        },
      },
      axisBorder: { show: false },
    },
  };
  const { id } = useParams();
  const [chapterData, setChapterData] = useState("");
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [gradientLineChartSeries, setGradientLineChartSeries] = useState([]);
  const [gradientLineChartOptions, setGradientLineChartOptions] =
    useState(CHART_OPTIONS);
  const [cardsCount, setCardCount] = useState([]);
  const [headTableMembersData, setHeadTableMembersData] = useState([]);
  const [headTableUsersData, setHeadTableUsersData] = useState([]);
  const [topAchieversData, setTopAchieversData] = useState({
    thankYouSlips: { totalAmount: 0, topReceivers: [] },
    testimonialSlips: { totalCount: 0, topReceivers: [] },
    oneToOneMeetings: { totalCount: 0, topMembers: [] },
    visitors: { totalCount: 0, topMembers: [] },
    referralSlips: { totalCount: 0, topReceivers: [] },
  });
  const [openDropdown, setOpenDropdown] = useState();
  const [members, setMembers] = useState([]);
  const [referralMember, setReferralMember] = useState(null);
  const [businessMember, setBusinessMember] = useState(null);
  const [visitorMember, setVisitorMember] = useState(null);


  const [presidentMember, setPresidentMember] = useState(null);
  const [secretaryMember, setSecretaryMember] = useState(null);
  const [vicePresidentMember, setVicePresidentMember] = useState(null);


  const handleRoleSubmit = async () => {
    if (!presidentMember?.value) {
      toast.error("President member is required");
      return;
    }

    if (!secretaryMember?.value) {
      toast.error("Secretary member is required");
      return;
    }

    if (!vicePresidentMember?.value) {
      toast.error("Vice President member is required");
      return;
    }

    // FINAL PAYLOAD
    const payload = {
      president: presidentMember.value,
      secretary: secretaryMember.value,
      vicePresident: vicePresidentMember.value,
    };

    try {
      const res = await chapterApiProvider.submitHeadTableRoles(id, payload);


      if (res.status) {
        toast.success(res.message || "Head table roles saved!");
        setOpenDropdown(null);
      } else {
        toast.error(res.message || "Backend error");
      }
    } catch (err) {
      toast.error(err?.message || "Unexpected error occurred");
    }
  };

  useEffect(() => {
    fetchHeadTableData();
  }, []);


  const fetchHeadTableData = async () => {
    try {
      const res = await chapterApiProvider.getHeadTableRoles(id);

      if (!res?.data) return;

      const data = res.data;

      if (data.president) {
        setPresidentMember({
          label: data.president.name,
          value: data.president.id
        });
      }

      if (data.secretary) {
        setSecretaryMember({
          label: data.secretary.name,
          value: data.secretary.id
        });
      }

      if (data.vicePresident) {
        setVicePresidentMember({
          label: data.vicePresident.name,
          value: data.vicePresident.id
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (id) {
      fetchData(id);
      fetchCountData(id);
      fetchHeadTableMembers(id);
      fetchHeadTableUsers(id);
      fetchTopAchievers(id);
      fetchMonthlyRevenueforChapter(id);
      // Load data for specific chapter
    } else {
      // Handle no ID case
    }
  }, [id]);

  // ---------------- STATE ----------------
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [membersData, setMembersData] = useState([]);
  const paginatedMembers = membersData;   // ✅ FIX HERE

  const [attendanceCounts, setAttendanceCounts] = useState({});
  const [oneToOneCounts, setOneToOneCounts] = useState({});
  const [referralCounts, setReferralCounts] = useState({});
  const [thankYouAmounts, setThankYouAmounts] = useState({});
  const [visitorCounts, setVisitorCounts] = useState({});
  const [testimonialCounts, setTestimonialCounts] = useState({});
  const [search, setSearch] = useState("");
  const [associatePerformance, setAssociatePerformance] = useState([]);


  // ---------------- USE EFFECT ----------------
  useEffect(() => {
    if (id) {
      fetchMembersWithAttendance(id);
    }
  }, [id, search, pagination.page, pagination.limit]);


  // ---------------- MAIN FUNCTION ----------------
  const fetchMembersWithAttendance = async (chapterId) => {
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: search.trim() || undefined,
      };



      // 1. FETCH MEMBERS
      const response = await memberApiProvider.getMemberByChapterId(params, chapterId);
      const members = response?.data?.data?.members || [];

      setMembersData(members);

      const total = response?.data?.data?.pagination?.total || 0;
      setPagination((prev) => ({
        ...prev,
        total,
        totalPages: Math.ceil(total / prev.limit),
      }));

      if (members.length === 0) {
        setAttendanceCounts({});
        setOneToOneCounts({});
        setReferralCounts({});
        setThankYouAmounts({});
        setVisitorCounts({});
        setTestimonialCounts({});
        setAssociatePerformance([]);
        return;
      }

      const memberIds = members.map((m) => m._id);

      // 2. PARALLEL FETCH
      const [
        attendanceRes,
        oneToOneRes,
        referralRes,
        thankYouRes,
        visitorRes,
        testimonialRes,
        associatePerformanceRes,
      ] = await Promise.all([
        chapterApiProvider.getMembersAttendanceCount(members),
        chapterApiProvider.getOneToOneCounts(memberIds),
        chapterApiProvider.getReferralCounts(memberIds),
        chapterApiProvider.getThankYouSlipAmounts(memberIds),
        chapterApiProvider.getVisitorCounts(memberIds),
        chapterApiProvider.getTestimonialCounts(memberIds),

        // Associate performance report paginated
        chapterApiProvider.getAssociatePerformanceReport(memberIds, params),
      ]);


      // 3. SET PALMS STATES
      if (attendanceRes?.success) setAttendanceCounts(attendanceRes.data);
      if (oneToOneRes?.success) setOneToOneCounts(oneToOneRes.data);
      if (referralRes?.success) setReferralCounts(referralRes.data);
      if (thankYouRes?.success) setThankYouAmounts(thankYouRes.data);
      if (visitorRes?.success) setVisitorCounts(visitorRes.data);
      if (testimonialRes?.success) setTestimonialCounts(testimonialRes.data);

      // 4. ASSOCIATE PERFORMANCE PAGINATION
      if (associatePerformanceRes?.success) {
        const { data } = associatePerformanceRes;
        setAssociatePerformance(data || []);
      }
    } catch (error) {
      console.error("Error fetching members and reports:", error);
    }
  };



  const handleSubmit = async () => {
    if (!referralMember?.value) {
      toast.error("Referral member is required");
      return;
    }

    if (!businessMember?.value) {
      toast.error("Business member is required");
      return;
    }

    if (!visitorMember?.value) {
      toast.error("Visitor member is required");
      return;
    }

    const payload = {
      referrals: referralMember.value,
      business: businessMember.value,
      visitors: visitorMember.value,
    };

    try {
      const res = await memberApiProvider.createTopAchiver(id, payload);

      if (res.status) {
        toast.success(res.message || "Top achievers submitted successfully!");
        // 🔥 CLEAR DROPDOWNS AFTER SUCCESS
        setOpenDropdown(null);
      } else {
        toast.error(res.message || "Backend error");
      }
    } catch (err) {
      toast.error(err?.message || "Unexpected error occurred");
    }
  };

  useEffect(() => {
    if (id && members.length > 0) {
      fetchSavedAchievers(id, members);
    }
  }, [id, members]);

  const fetchSavedAchievers = async (chapterId, members) => {
    const res = await memberApiProvider.getTopAchiver(chapterId);

    console.log("res123", res)

    if (res.status && res.data) {

      // referrals
      const refMem = members.find(m => m.id === res.data.referrals);
      if (refMem) setReferralMember({ value: refMem.id, label: refMem.name });

      // business
      const bizMem = members.find(m => m.id === res.data.business);
      if (bizMem) setBusinessMember({ value: bizMem.id, label: bizMem.name });

      // visitors
      const visMem = members.find(m => m.id === res.data.visitors);
      if (visMem) setVisitorMember({ value: visMem.id, label: visMem.name });
    }
  };

  console.log("fetchSavedAchievers", fetchSavedAchievers)

  const fetchMonthlyRevenueforChapter = async (id) => {
    if (!id) {
      console.error("No chapter ID provided for fetching revenue data");
      return;
    }

    try {
      const response = await chapterApiProvider.monthlyRevenueBasedonChapter(
        id
      );
      if (response?.status && response?.response?.data) {
        const monthlyRevenueData = response.response.data;
        setMonthlyRevenueData(monthlyRevenueData);

        const monthlyAmounts = monthlyRevenueData.data.map(
          (item) => item.amount
        );
        const monthlyLabels = monthlyRevenueData.data.map((item) => item.month);

        setGradientLineChartSeries([
          {
            name: "Thank You Slip Amount",
            data: monthlyAmounts,
          },
        ]);

        setGradientLineChartOptions((prevOptions) => ({
          ...prevOptions,
          xaxis: {
            ...prevOptions.xaxis,
            categories: monthlyLabels,
          },
        }));
      } else {
        console.error(
          response?.response?.message || "Failed to fetch chapter revenue data"
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchData = async (id) => {
    const responce = await chapterApiProvider.getChaptersById(id);
    if (responce && responce.status) {
      const chapters = responce?.response?.data;
      console.log(chapters, "chapters");
      if (chapters) {
        setChapterData(chapters);
        setMembers(chapters.members || []); // slider part
      }
    }
  };

  function getPeriodMonthKey(date = new Date()) {

    let year = date.getFullYear();
    let month = date.getMonth() + 1; // 1–12


    return `${year}-${String(month).padStart(2, "0")}`;
  }


  const fetchCountData = async (id) => {
    if (id) {
      const response = await chapterApiProvider.getChapterCountById(id);
      console.log(response, "response-chapterApiProvider-getChapterCountById");
      if (response && response.status) {
        const chapterCount = response?.response?.data;
        console.log(chapterCount, "chapterCount");
        transformData(chapterCount);
      } else {
        console.error(
          response?.response?.message || "Failed to fetch chapter count data"
        );
      }
    } else {
      console.error("No chapter ID provided for fetching count data");
    }
  };
  const transformData = (apiData) => {
    const transformedCards = [
      {
        count: apiData.MembersCount || 0,
        label: "Associates",
        icon: "ri-user-shared-fill",
        bg: "bggg-white",
        iconBg: "bg-primary",
      },
      {
        count: apiData.referalCount || 0,
        label: "Referrals",
        icon: "ri-share-forward-fill",
        bg: "bggg-white",
        iconBg: "bg-success",
      },
      {
        count: apiData.visitors || 0,
        label: "Visitor/Guest",
        icon: "ri-user-follow-fill",
        bg: "bggg-white",
        iconBg: "bg-info",
      },
      {
        count: apiData.eventCount || 0,
        label: "Events",
        icon: "ri-calendar-check-fill",
        bg: "bggg-white",
        iconBg: "bg-warning",
      },
      {
        count: apiData.oneTooneCount || 0,
        label: "One to One",
        icon: "ri-user-heart-fill",
        bg: "bggg-white",
        iconBg: "bg-secondary",
      },
      {
        count: apiData.testimonialCount || 0,
        label: "Testimonials",
        icon: "ri-chat-quote-fill",
        bg: "bggg-white",
        iconBg: "bg-danger",
      },
    ];

    setCardCount(transformedCards);
  };

  // const fetchHeadTableMembers = async (id) => {
  //   const response = await chapterApiProvider.getHeadTableMembersByChapterId(
  //     id
  //   );
  //   console.log(
  //     response,
  //     "response-chapterApiProvider-getHeadTableMembersByChapterId"
  //   );
  //   if (response && response.status) {
  //     const headTableMembersData = response?.response?.data || [];
  //     setHeadTableMembersData(headTableMembersData);
  //   } else {
  //     console.error(
  //       response?.response?.message || "Failed to fetch head table members data"
  //     );
  //   }
  // };

  const fetchHeadTableMembers = async (id) => {
    const response = await chapterApiProvider.getHeadTableMembersByChapterId(id);

    if (response && response.status) {
      const data = response?.response?.data || [];
      setHeadTableMembersData(data);

      // 🟩 Auto-select the 3 roles
      const president = data.find((x) => x.roleName === "President");
      const secretary = data.find((x) => x.roleName === "Secretary");
      const vicePresident = data.find((x) => x.roleName === "Vice President");

      setPresidentMember(
        president
          ? { label: president.name, value: president.id }
          : null
      );

      setSecretaryMember(
        secretary
          ? { label: secretary.name, value: secretary.id }
          : null
      );

      setVicePresidentMember(
        vicePresident
          ? { label: vicePresident.name, value: vicePresident.id }
          : null
      );

    } else {
      console.error(
        response?.response?.message ||
        "Failed to fetch head table associates data"
      );
    }
  };

  const fetchHeadTableUsers = async (id) => {
    const response = await chapterApiProvider.getHeadTableUsersByChapterId(id);
    console.log(
      response,
      "response-chapterApiProvider-getHeadTableUsersByChapterId"
    );
    if (response && response.status) {
      const headTableUsersData = response?.response?.data || [];
      setHeadTableUsersData(headTableUsersData);
    } else {
      console.error(
        response?.response?.message || "Failed to fetch head table users data"
      );
    }
  };

  const fetchTopAchievers = async (id) => {
    // Fetch top achievers data for the chapter
    const response = await chapterApiProvider.getTopAchieversById(id);
    console.log(
      response,
      "response-chapterApiProvider-getTopAchieversByChapterId"
    );
    if (response && response.status) {
      const topAchieversData = response?.response?.data || [];
      console.log(topAchieversData, "topAchieversData");
      setTopAchieversData(topAchieversData);
      // Process top achievers data if needed
      // For now, we are not transforming it, just logging
    } else {
      console.error(
        response?.response?.message || "Failed to fetch top achievers data"
      );
    }
  };

  // Helper function to format meeting day
  const formatMeetingDay = (dateString) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  // Helper function to format meeting time
  const formatMeetingTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  console.log(chapterData, "chapterData");
  // Map API data to card format
  const gripChapters = [
    {
      id: "testimonials",
      name: "Top Testimonials",
      memberCount: topAchieversData?.testimonialSlips?.totalCount,
      members: topAchieversData?.testimonialSlips?.topReceivers?.map(
        (receiver) => ({
          id: receiver.memberId,
          name: receiver.name,
          image: receiver.profileImage?.docName || "default-user.png",
          score: receiver.count,
        })
      ),
    },
    {
      id: "meetings",
      name: "Top 1-1 Meetings",
      memberCount: topAchieversData?.oneToOneMeetings?.totalCount,
      members: topAchieversData.oneToOneMeetings?.topReceivers?.map(
        (member) => ({
          id: member.memberId,
          name: member.name,
          image: member.profileImage?.docName || "default-user.png",
          score: member.count,
        })
      ),
    },
    {
      id: "referrals",
      name: "Top Referrals",
      memberCount: topAchieversData?.referralSlips?.totalCount,
      members: topAchieversData?.referralSlips?.topReceivers.map(
        (receiver) => ({
          id: receiver.memberId,
          name: receiver.name,
          image: receiver.profileImage
            ? receiver.profileImage
            : " " || "default-user.png",
          score: receiver.count,
        })
      ),
    },
    {
      id: "thankYou",
      name: "Top Thank You Notes",
      memberCount: topAchieversData?.thankYouSlips?.totalAmount,
      members: topAchieversData?.thankYouSlips?.topReceivers?.map(
        (receiver) => ({
          id: receiver.memberId,
          name: receiver.name,
          image: receiver.profileImage
            ? receiver.profileImage
            : "" || "default-user.png",
          score: receiver.count || receiver.amount,
        })
      ),
    },
  ].filter((chapter) => chapter?.members?.length > 0); // Only show categories with data

  return (
    <>
      <div
        className="card p-40 h-100 p-4 mb-5 radius-12"
        style={{ backgroundColor: "#f9f9f9" }}
      >
        <div className="row g-4 align-items-start">
          {/* Left Section - Meeting Details */}
          <div className="col-md-3">
            <h5 className="fw-bold">
              GRIP{" "}
              <span style={{ fontWeight: 300 }}>{chapterData.chapterName}</span>
            </h5>
            <p className="text-muted mb-2">Meeting is only on invite</p>

            <div className="mt-2 mb-3 text-sm">
              {chapterData.weekday}
            </div>
            <div
              className="text-sm mb-3"
              style={{
                background: "#ccc",
                display: "inline-block",
                padding: "2px 8px",
                borderRadius: "4px",
              }}
            >
              {chapterData.meetingType}
            </div>
          </div>

          <div className="col-md-3">
            <div className="mt-0 mb-0 fw-bold">
              <h6 className="fw-bold">Meeting Details</h6>
            </div>

            <div className="text-sm mb-0">{chapterData?.meetingVenue}</div>
            <div className="text-sm text-muted">
              {chapterData?.zoneId?.zoneName}
              <br />
              {chapterData?.stateName}
            </div>
            {/* <div className="text-sm mt-1">CID: {chapterData?.cidId?.name}</div>
            <div className="text-sm mt-1">Phone: {chapterData?.cidId?.mobileNumber || 'Not available'}</div>
            <a href="#" className="text-grip text-sm mt-2 d-inline-block">
              View Map
            </a> */}
          </div>

          {/* Center Section - Member Count */}
          <div className="col-md-3 text-center">
            <h6 className="fw-bold">Associate Count</h6>
            <h1 className="text-grip display-4">{chapterData?.memberCount}</h1>
            <Link
              to={`/member-list/${chapterData?._id}`}
              className="text-grip text-sm"
            >
              Show Associates
            </Link>
          </div>

          {/* Right Section - Buttons */}
          <div className="col-md-3 d-flex flex-column align-items-end gap-3">
            {hasPermission("users-create") && (
              <button
                type="button"
                className="btn btn-primary grip text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
              >
                <Link
                  to="/add-member"
                  className=" text-white  d-flex align-items-center gap-1"
                >
                  Add Associate
                  <Icon
                    icon="ic:baseline-plus"
                    className="icon text-xl line-height-1"
                  />
                </Link>
              </button>
            )}

            {/* <select
              className="form-select form-select-sm w-auto bg-base px-32 border text-white text-secondary-light rounded-pill"

            >
              <option value="" >
                This Week
              </option>
              <option value="Last Week">Last Week</option>
              <option value="Last Month">Last Month</option>
              <option value="This Month">This Month</option>
              <option value="This Term">This Term</option>
            </select> */}
          </div>
        </div>
      </div>

      <div className="row gy-4 mb-5">
        {cardsCount &&
          cardsCount.map((card, index) => (
            <div key={index} className="col-lg-2 col-sm-6">
              <div className={`card p-3 radius-8 h-100 ${card.bg}`}>
                <div className="card-body p-0">
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className={`w-48-px h-48-px d-flex justify-content-center align-items-center rounded-circle bg-grip ${card.iconBg}`}
                    >
                      <i className={`${card.icon} h5 mb-0`} />
                    </span>
                    <div>
                      <h6 className="fw-bold mb-1">
                        {card.count.toLocaleString()}
                      </h6>
                      <span className="text-secondary text-sm">
                        {card.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="card h-100 p-0 mb-5 radius-12">
        <div className="card-header border-bottom bg-base py-16 px-24">
          <h6 className="text-lg fw-semibold mb-0">Chapter Leadership</h6>
        </div>

        <div className="card-body p-24">
          {headTableUsersData?.length === 0 ? (
            <div className="text-center py-4">No leadership data available</div>
          ) : (
            <div className="row g-4 justify-content-evenly">
              {headTableUsersData.map((user, index) => (
                <div
                  key={index}
                  className="col-12 col-sm-6 col-md-4 col-lg-3 user-grid-card"
                >
                  <div className="position-relative border radius-16 bg-overlay overflow-hidden p-3">
                    <div className="text-center">
                      <img
                        src={
                          user?.profileImage?.docPath
                            ? `${IMAGE_BASE_URL}/${user.profileImage.docPath}/${user.profileImage.docName}`
                            : "/assets/images/avatar/avatar1.png"
                        }
                        alt={user.name}
                        className="border br-white border-width-2-px w-100-px mt-20 h-100-px rounded-circle object-fit-cover"
                        onError={(e) => {
                          e.target.src = "/assets/images/avatar/avatar1.png";
                        }}
                      />
                      <h6 className="text-lg mb-1 mt-3 text-white">
                        {user.name}
                      </h6>
                      <span className="text-secondary-light text-white mb-16">
                        {user.roleName}
                      </span>

                      <div className="d-flex justify-content-center gap-3 mt-16">
                        <a
                          href={`tel:${user.mobileNumber}`}
                          className="btn btn-light p-10 radius-8 d-flex align-items-center justify-content-center"
                          title="Call"
                        >
                          <Icon
                            icon="mdi:phone-outline"
                            className="text-xl text-primary-600"
                          />
                        </a>
                        <a
                          href={`mailto:${user.email}`}
                          className="btn btn-light p-10 radius-8 d-flex align-items-center justify-content-center"
                          title="Mail"
                        >
                          <Icon
                            icon="mdi:email-outline"
                            className="text-xl text-primary-600"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card-body p-24">
          <div className="row g-4 justify-content-evenly">
            {headTableMembersData.map((member, index) => (
              <div
                key={index}
                className="col-12 col-sm-6 col-md-4 col-lg-3 user-grid-card"
              >
                <div className="position-relative border radius-16 bg-overlay overflow-hidden p-3">
                  <div className="text-center">
                    <img
                      src={
                        member?.profileImage?.docPath
                          ? `${IMAGE_BASE_URL}/${member.profileImage.docPath}/${member.profileImage.docName}`
                          : "/assets/images/avatar/avatar1.png"
                      }
                      alt={member.name}
                      className="border br-white border-width-2-px w-100-px mt-20 h-100-px rounded-circle object-fit-cover"
                      onError={(e) => {
                        e.target.src = "/assets/images/avatar/avatar1.png";
                      }}
                    />
                    <h6 className="text-lg mb-1 mt-3 text-white">
                      {member.name}
                    </h6>
                    <span className="text-secondary-light text-white mb-16">
                      {member.roleName}
                    </span>

                    <div className="d-flex justify-content-center gap-3 mt-16">
                      <a
                        href={`tel:${member.mobileNumber}`}
                        className="btn btn-light p-10 radius-8 d-flex align-items-center justify-content-center"
                        title="Call"
                      >
                        <Icon
                          icon="mdi:phone-outline"
                          className="text-xl text-primary-600"
                        />
                      </a>
                      <a
                        href={`mailto:${member.email}`}
                        className="btn btn-light p-10 radius-8 d-flex align-items-center justify-content-center"
                        title="Mail"
                      >
                        <Icon
                          icon="mdi:email-outline"
                          className="text-xl text-primary-600"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card h-100 p-0 mb-5 radius-12">
        <div className="card-body p-24">
          <div className="row g-0">
            {/* Revenue Summary Card */}
            <div className="col-md-4">
              <div className="card h-100 rounded-0 border-0">
                <div className="card-header border-bottom bg-base py-16 px-24">
                  <h6 className="text-lg fw-semibold mb-0">
                    Business Achieved
                  </h6>
                </div>
                <div className="card-body p-24 d-flex flex-column justify-content-center align-items-center">
                  {monthlyRevenueData ? (
                    <>
                      <h2 className="text-success display-6 fw-bold mb-0">
                        ₹
                        {formatCurrencyValue(
                          monthlyRevenueData?.totalAmount || 0
                        )}
                      </h2>
                      <p className="text-muted mt-2">Total Revenue</p>
                      <p className="text-sm text-muted mt-1">
                        Last updated: {new Date().toLocaleDateString()}
                      </p>
                    </>
                  ) : (
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="spinner-border spinner-border-sm text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <span>Loading revenue data...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="col-md-8">
              <div className="card h-100 rounded-0 border-0">
                <div
                  className="card-body p-24 position-relative"
                  style={{ minHeight: "300px" }}
                >
                  {gradientLineChartSeries.length > 0 ? (
                    <ReactApexChart
                      id="gradientLineChart"
                      options={gradientLineChartOptions}
                      series={gradientLineChartSeries}
                      type="line"
                      height={264}
                    />
                  ) : (
                    <div className="d-flex flex-column justify-content-center align-items-center h-100">
                      {monthlyRevenueData?.data?.length === 0 ? (
                        <div className="text-center">
                          <Icon
                            icon="mdi:chart-line"
                            className="text-muted"
                            width={48}
                            height={48}
                          />
                          <p className="mt-2">No revenue data available</p>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="spinner-border spinner-border-sm text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <span>Loading chart data...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* slider part og */}
      <div className="card h-100 p-0 radius-12 mb-5">
        <div className="card-header border-bottom bg-base py-16 px-24">
          <h6 className="text-lg fw-semibold mb-0">Slider</h6>
        </div>

        <div className="card-body p-24">
          <div className="row">
            {/* LEFT SIDE */}
            <div className="col-md-6">
              <h6
                className="text-lg fw-semibold mb-20"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(192, 34, 33), rgb(69, 68, 66))",
                  color: "#fff",
                  padding: "8px 12px",
                }}
              >
                Top Achivers of the month
              </h6>

              {/* Item 1 */}
              <div
                onClick={() => setOpenDropdown("referrals")}
                onMouseEnter={(e) => (e.target.style.color = "#000")}
                onMouseLeave={(e) =>
                (e.target.style.color =
                  openDropdown === "referrals" ? "#000" : "#2c2c2c")
                }
                style={{
                  fontSize: "1rem", // ≈ 16px
                  fontWeight: openDropdown === "referrals" ? 600 : 500,
                  padding: "0.75rem 0",
                  cursor: "pointer",
                  color: openDropdown === "referrals" ? "#000" : "#2c2c2c",
                  borderLeft:
                    openDropdown === "referrals"
                      ? "3px solid #000"
                      : "3px solid transparent",
                  paddingLeft: openDropdown === "referrals" ? "0.5rem" : "0rem",
                  transition: "0.2s",
                }}
              >
                Maximum Referrals Contributed
              </div>

              {/* Item 2 */}
              <div
                onClick={() => setOpenDropdown("business")}
                onMouseEnter={(e) => (e.target.style.color = "#000")}
                onMouseLeave={(e) =>
                (e.target.style.color =
                  openDropdown === "business" ? "#000" : "#2c2c2c")
                }
                style={{
                  fontSize: "1rem",
                  fontWeight: openDropdown === "business" ? 600 : 500,
                  padding: "0.75rem 0",
                  cursor: "pointer",
                  color: openDropdown === "business" ? "#000" : "#2c2c2c",
                  borderLeft:
                    openDropdown === "business"
                      ? "3px solid #000"
                      : "3px solid transparent",
                  paddingLeft: openDropdown === "business" ? "0.5rem" : "0rem",
                  transition: "0.2s",
                }}
              >
                Maximum Business Contributed
              </div>

              {/* Item 3 */}
              <div
                onClick={() => setOpenDropdown("visitors")}
                onMouseEnter={(e) => (e.target.style.color = "#000")}
                onMouseLeave={(e) =>
                (e.target.style.color =
                  openDropdown === "visitors" ? "#000" : "#2c2c2c")
                }
                style={{
                  fontSize: "1rem",
                  fontWeight: openDropdown === "visitors" ? 600 : 500,
                  padding: "0.75rem 0",
                  cursor: "pointer",
                  color: openDropdown === "visitors" ? "#000" : "#2c2c2c",
                  borderLeft:
                    openDropdown === "visitors"
                      ? "3px solid #000"
                      : "3px solid transparent",
                  paddingLeft: openDropdown === "visitors" ? "0.5rem" : "0rem",
                  transition: "0.2s",
                }}
              >
                Maximum Visitors Invited
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="col-md-6">
              <h6
                className="text-lg fw-semibold mb-20"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(192, 34, 33), rgb(69, 68, 66))",
                  color: "#fff",
                  padding: "8px 12px",
                }}
              >
                Associates
              </h6>

              {/* Referrals */}

              <div className="mb-4">
                {openDropdown === "referrals" ? (
                  <Select
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    menuShouldScrollIntoView={false}
                    options={members.map((m) => ({
                      label: m.name,
                      value: m.id,
                    }))}
                    value={referralMember}
                    onChange={(selected) => setReferralMember(selected)}
                    placeholder="Select Member for Referrals"
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      control: (styles) => ({
                        ...styles,
                        backgroundColor: "#e6e6e6",
                        border: "none",
                        minHeight: "2.5rem",
                        borderRadius: "6px",
                      }),
                    }}
                  />
                ) : (
                  <DisabledSelect value={referralMember} />
                )}
              </div>

              {/* Business */}
              <div className="mb-4">
                {openDropdown === "business" ? (
                  <Select
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    menuShouldScrollIntoView={false}
                    options={members.map((m) => ({
                      label: m.name,
                      value: m.id,
                    }))}
                    value={businessMember}
                    onChange={(selected) => setBusinessMember(selected)}
                    placeholder="Select Member for Business"
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      control: (styles) => ({
                        ...styles,
                        backgroundColor: "#e6e6e6",
                        border: "none",
                        minHeight: "2.5rem",
                        borderRadius: "6px",
                      }),
                    }}
                  />
                ) : (
                  <DisabledSelect value={businessMember} />
                )}
              </div>

              {/* Visitors */}
              <div className="mb-4">
                {openDropdown === "visitors" ? (
                  <Select
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    menuShouldScrollIntoView={false}
                    options={members.map((m) => ({
                      label: m.name,
                      value: m.id,
                    }))}
                    value={visitorMember}
                    onChange={(selected) => setVisitorMember(selected)}
                    placeholder="Select Member for Visitors"
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      control: (styles) => ({
                        ...styles,
                        backgroundColor: "#e6e6e6",
                        border: "none",
                        minHeight: "2.5rem",
                        borderRadius: "6px",
                      }),
                    }}
                  />
                ) : (
                  <DisabledSelect value={visitorMember} />
                )}
              </div>
            </div>
          </div>

          <div className="text-end mt-4 px-32">
            {hasPermission("topachievers-create") && (
              <button
                type="button"
                onClick={handleSubmit}
                className="btn btn-primary grip text-sm btn-lg px-32 py-12 radius-8"
              >
                Submit
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Roles section */}
      <div className="card h-100 p-0 radius-12 mb-5">
        <div className="card-header border-bottom bg-base py-16 px-24">
          <h6 className="text-lg fw-semibold mb-0">Head Table Roles</h6>
        </div>

        <div className="card-body p-24">
          <div className="row">

            {/* LEFT SIDE */}
            <div className="col-md-6">
              <h6
                className="text-lg fw-semibold mb-20"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(192, 34, 33), rgb(69, 68, 66))",
                  color: "#fff",
                  padding: "8px 12px",
                }}
              >
                Select Roles
              </h6>

              {/* Item 1 — President */}
              <div
                onClick={() => setOpenDropdown("president")}
                onMouseEnter={(e) => (e.target.style.color = "#000")}
                onMouseLeave={(e) =>
                (e.target.style.color =
                  openDropdown === "president" ? "#000" : "#2c2c2c")
                }
                style={{
                  fontSize: "1rem",
                  fontWeight: openDropdown === "president" ? 600 : 500,
                  padding: "0.75rem 0",
                  cursor: "pointer",
                  color: openDropdown === "president" ? "#000" : "#2c2c2c",
                  borderLeft:
                    openDropdown === "president"
                      ? "3px solid #000"
                      : "3px solid transparent",
                  paddingLeft: openDropdown === "president" ? "0.5rem" : "0rem",
                  transition: "0.2s",
                }}
              >
                President
              </div>

              {/* Item 2 — Secretary */}
              <div
                onClick={() => setOpenDropdown("secretary")}
                onMouseEnter={(e) => (e.target.style.color = "#000")}
                onMouseLeave={(e) =>
                (e.target.style.color =
                  openDropdown === "secretary" ? "#000" : "#2c2c2c")
                }
                style={{
                  fontSize: "1rem",
                  fontWeight: openDropdown === "secretary" ? 600 : 500,
                  padding: "0.75rem 0",
                  cursor: "pointer",
                  color: openDropdown === "secretary" ? "#000" : "#2c2c2c",
                  borderLeft:
                    openDropdown === "secretary"
                      ? "3px solid #000"
                      : "3px solid transparent",
                  paddingLeft: openDropdown === "secretary" ? "0.5rem" : "0rem",
                  transition: "0.2s",
                }}
              >
                Secretary
              </div>

              {/* Item 3 — Vice President */}
              <div
                onClick={() => setOpenDropdown("vicepresident")}
                onMouseEnter={(e) => (e.target.style.color = "#000")}
                onMouseLeave={(e) =>
                (e.target.style.color =
                  openDropdown === "vicepresident" ? "#000" : "#2c2c2c")
                }
                style={{
                  fontSize: "1rem",
                  fontWeight: openDropdown === "vicepresident" ? 600 : 500,
                  padding: "0.75rem 0",
                  cursor: "pointer",
                  color: openDropdown === "vicepresident" ? "#000" : "#2c2c2c",
                  borderLeft:
                    openDropdown === "vicepresident"
                      ? "3px solid #000"
                      : "3px solid transparent",
                  paddingLeft: openDropdown === "vicepresident" ? "0.5rem" : "0rem",
                  transition: "0.2s",
                }}
              >
                Vice President
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="col-md-6">
              <h6
                className="text-lg fw-semibold mb-20"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(192, 34, 33), rgb(69, 68, 66))",
                  color: "#fff",
                  padding: "8px 12px",
                }}
              >
                Assign Associates
              </h6>

              {/* PRESIDENT DROPDOWN */}
              <div className="mb-4">
                {openDropdown === "president" ? (
                  <Select
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    options={members.map((m) => ({
                      label: m.name,
                      value: m.id,
                    }))}
                    value={presidentMember}
                    onChange={(selected) => setPresidentMember(selected)}
                    placeholder="Select President"
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      control: (styles) => ({
                        ...styles,
                        backgroundColor: "#e6e6e6",
                        border: "none",
                        minHeight: "2.5rem",
                        borderRadius: "6px",
                      }),
                    }}
                  />
                ) : (
                  <DisabledSelect value={presidentMember} />
                )}
              </div>

              {/* SECRETARY DROPDOWN */}
              <div className="mb-4">
                {openDropdown === "secretary" ? (
                  <Select
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    options={members.map((m) => ({
                      label: m.name,
                      value: m.id,
                    }))}
                    value={secretaryMember}
                    onChange={(selected) => setSecretaryMember(selected)}
                    placeholder="Select Secretary"
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      control: (styles) => ({
                        ...styles,
                        backgroundColor: "#e6e6e6",
                        border: "none",
                        minHeight: "2.5rem",
                        borderRadius: "6px",
                      }),
                    }}
                  />
                ) : (
                  <DisabledSelect value={secretaryMember} />
                )}
              </div>

              {/* VICE PRESIDENT DROPDOWN */}
              <div className="mb-4">
                {openDropdown === "vicepresident" ? (
                  <Select
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    options={members.map((m) => ({
                      label: m.name,
                      value: m.id,
                    }))}
                    value={vicePresidentMember}
                    onChange={(selected) => setVicePresidentMember(selected)}
                    placeholder="Select Vice President"
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      control: (styles) => ({
                        ...styles,
                        backgroundColor: "#e6e6e6",
                        border: "none",
                        minHeight: "2.5rem",
                        borderRadius: "6px",
                      }),
                    }}
                  />
                ) : (
                  <DisabledSelect value={vicePresidentMember} />
                )}
              </div>

            </div>
          </div>

          <div className="text-end mt-4 px-32">
            <button
              type="button"
              onClick={handleRoleSubmit}
              className="btn btn-primary grip text-sm btn-lg px-32 py-12 radius-8"
            >
              Submit
            </button>
          </div>

        </div>
      </div>
      {/* Top Achievers */}
      <div className="card h-100 p-0 radius-12 mb-5">
        <div className="card-header border-bottom bg-base py-16 px-24">
          <h6 className="text-lg fw-semibold mb-0">Top Achievers</h6>
        </div>
        <div className="card-body chapterwisebox p-24">
          {gripChapters?.length > 0 ? (
            <div className="row gy-4">
              {gripChapters?.map((chapter) => (
                <div className="col-xxl-3 col-lg-3 col-sm-12" key={chapter.id}>
                  <div className="card">
                    <div className="chapterwiseheading d-flex text-white align-items-center flex-wrap gap-2 justify-content-between">
                      <h6 className="mb-2 fw-bold text-sm mb-0">
                        {chapter.name}
                      </h6>
                      <span className="badge bg-danger">
                        {chapter.memberCount}
                      </span>
                    </div>

                    <div className="card-body p-20">
                      <div className="mt-0">
                        {chapter?.members?.map((member, index) => (
                          <div
                            className={`d-flex align-items-center justify-content-between gap-3 ${index < chapter.members?.length - 1 ? "mb-32" : ""
                              }`}
                            key={member.id}
                          >
                            <div className="d-flex align-items-center">
                              <img
                                src={
                                  member.image
                                    ? `${IMAGE_BASE_URL}/${member.image.docPath}/${member.image.docName}`
                                    : "/assets/images/users/default-user.png"
                                }
                                alt={member.name}
                                className="w-40-px h-40-px rounded-circle flex-shrink-0 me-10 overflow-hidden"
                              // onError={(e) => {
                              //   e.target.onerror = null;
                              //   e.target.src = '/assets/images/users/default-user.png';
                              // }}
                              />
                              <div className="flex-grow-1">
                                <h6 className="text-md mb-0">{member.name}</h6>
                              </div>
                            </div>
                            <span className="text-primary-light text-md fw-medium">
                              {member.score}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p>No top achievers data available</p>
            </div>
          )}
        </div>
      </div>

      {/* PALMS REPORT */}
      <div className="card h-100 p-0 radius-12">
        <div className="card-header border-bottom bg-base py-16 px-24">
          <h6 className="text-lg fw-semibold mb-0">PALMS Report</h6>
        </div>

        <div className="card-body chapterwisebox p-24">
          {membersData?.length > 0 ? (
            <>
              {/* TABLE */}
              <div className="table-responsive" style={{ overflowX: "auto" }}>
                <table className="table table-bordered align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th>S.NO</th>
                      <th>Associate Name</th>
                      <th>Meetings</th>
                      <th>P</th>
                      <th>A</th>
                      <th>L</th>
                      <th>M</th>
                      <th>S</th>
                      <th>Events</th>      {/* NEW */}
                      <th>Training</th>    {/* NEW */}
                      <th>One-to-One</th>
                      <th>Referral Given</th>
                      <th>Referral Received</th>
                      <th>ThankYou Given</th>
                      <th>ThankYou Received</th>
                      <th>Visitors</th>
                      <th>Testimonial Given</th>
                      <th>Testimonial Received</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedMembers.map((member, index) => {
                      const defaultCounts = {
                        present: 0,
                        absent: 0,
                        late: 0,
                        managed: 0,
                        substitute: 0,
                      };


                      // FIX: read correctly from backend structure
                      const meetings = attendanceCounts?.[member._id]?.meeting || defaultCounts;
                      const events = attendanceCounts?.[member._id]?.event || 0;
                      const training = attendanceCounts?.[member._id]?.training || 0;

                      const totalEvents =
                        events.present +
                        events.absent +
                        events.late +
                        events.managed +
                        events.substitute;

                      const totalTraining =
                        training.present +
                        training.absent +
                        training.late +
                        training.managed +
                        training.substitute;


                      return (
                        <tr key={member._id}>
                          <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>

                          <td>
                            <h6 className="text-md mb-0">{member.name}</h6>
                            <small className="text-xs text-muted">{member.category}</small>
                          </td>

                          {/* Meetings */}
                          <td>{meetings.totalMeetings}</td>
                          <td>{meetings.present}</td>
                          <td>{meetings.absent}</td>
                          <td>{meetings.late}</td>
                          <td>{meetings.managed}</td>
                          <td>{meetings.substitute}</td>

                          {/* Events */}
                          <td>{totalEvents || 0}</td>

                          {/* Training */}
                          <td>{totalTraining || 0}</td>

                          <td>{oneToOneCounts[member._id]?.fromCount || 0}</td>
                          <td>{referralCounts[member._id]?.given || 0}</td>
                          <td>{referralCounts[member._id]?.received || 0}</td>
                          <td>{thankYouAmounts[member._id]?.givenAmount || 0}</td>
                          <td>{thankYouAmounts[member._id]?.receivedAmount || 0}</td>
                          <td>{visitorCounts[member._id] || 0}</td>
                          <td>{testimonialCounts[member._id]?.given || 0}</td>
                          <td>{testimonialCounts[member._id]?.received || 0}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                {/* Prev */}
                <button
                  className="btn btn-primary"
                  disabled={pagination.page === 1}
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                >
                  Prev
                </button>

                {/* Page Info */}
                <div>
                  Page <strong>{pagination.page}</strong> of{" "}
                  <strong>{pagination.totalPages}</strong>
                </div>

                {/* Next */}
                <button
                  className="btn btn-primary"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p>No associates found.</p>
          )}
        </div>
      </div>

      {/* ASSOCIATE PERFORMANCE REPORT */}
      <div className="card h-100 p-0 radius-12">
        <div className="card-header border-bottom bg-base py-16 px-24 d-flex justify-content-between align-items-center">
          <h6 className="text-lg fw-semibold mb-0">Associate Performance Report</h6>
        </div>

        <div className="card-body chapterwisebox p-24">
          {membersData?.length > 0 ? (
            <>
              {/* TABLE */}
              <div className="table-responsive" style={{ overflowX: "auto" }}>
                <table className="table table-bordered align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th>S.NO</th>
                      <th>Associate</th>
                      <th>1-to-1</th>
                      <th>Referrals</th>
                      <th>Visitors</th>
                      <th>Trainings</th>
                      <th>Business</th>
                      <th>Testimonials</th>
                      <th>Attendance</th>
                      <th>Total Score</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedMembers?.length > 0 ? (
                      paginatedMembers.map((member, index) => {
                        // Find the associate report for this member
                        const report = associatePerformance?.find(r => r.memberId === member._id) || {};
                        const key = getPeriodMonthKey();   // ex → "2025-12"
                        console.log(key, "key")
                        const monthData = report?.monthlyScore?.[key] || {};

                        const oneToOne = monthData.oneToOne || 0;
                        const referrals = monthData.referrals || 0;
                        const visitors = monthData.visitors || 0;
                        const trainings = monthData.trainings || 0;
                        const business = monthData.business || 0;
                        const testimonials = monthData.testimonials || 0;
                        const attendance = monthData.attendance || 0;
                        const onTime = monthData.onTime || 0;

                        const totalScore =
                          oneToOne +
                          referrals +
                          visitors +
                          trainings +
                          business +
                          testimonials +
                          attendance +
                          onTime;

                        return (
                          <tr key={member._id}>
                            <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                            <td>
                              <Link
                                to={`/associate/${member._id}/report`}
                                style={{ color: "#007bff", fontWeight: "600", textDecoration: "underline", cursor: "pointer" }}
                              >
                                {member.name}
                              </Link>
                            </td>
                            <td>{oneToOne.toFixed(2)}</td>
                            <td>{referrals.toFixed(2)}</td>
                            <td>{visitors.toFixed(2)}</td>
                            <td>{trainings.toFixed(2)}</td>
                            <td>{business.toFixed(2)}</td>
                            <td>{testimonials.toFixed(2)}</td>
                            <td>{attendance.toFixed(2)}</td>
                            <td>
                              <div className="fw-bold">{totalScore.toFixed(2)}</div>
                              <div className="progress" style={{ height: "6px" }}>
                                <div
                                  className="progress-bar bg-success"
                                  style={{ width: `${(totalScore / 50) * 100}%` }}
                                ></div>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={11} className="text-muted fw-bold">
                          No records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                {/* Prev */}
                <button
                  className="btn btn-primary"
                  disabled={pagination.page === 1}
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                >
                  Prev
                </button>

                {/* Page Info */}
                <div>
                  Page <strong>{pagination.page}</strong> of{" "}
                  <strong>{pagination.totalPages}</strong>
                </div>

                {/* Next */}
                <button
                  className="btn btn-primary"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p>No associates found.</p>
          )}
        </div>
      </div>



      {/* Modal Start */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-m modal-dialog modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Add New Chapter
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body p-24">
              <form action="#">
                <div className="row">
                  <div className="col-12 mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Chapter Name
                    </label>
                    <input type="text" className="form-control radius-8" />
                  </div>

                  <div className="col-12 mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Region
                    </label>
                    <select class="form-control form-select">
                      <option value="Date">Select Region </option>
                      <option value="1" selected="">
                        Chennai
                      </option>
                    </select>
                  </div>

                  <div className="col-12 mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Chapter Induction Directors (CID)
                    </label>
                    <select class="form-control form-select">
                      <option value=""> Select Name </option>
                      <option value="rajesh">Rajesh</option>
                      <option value="madhu">Madhu</option>
                      <option value="praburajan">Praburajan</option>
                      <option value="gajendran">Gajendran</option>
                      <option value="kirubakaran">Kirubakaran</option>
                      <option value="Kumar Subramaniam">
                        Kumar Subramaniam
                      </option>
                      <option value="Palanikumar">Palanikumar</option>
                    </select>
                  </div>

                  <div className="col-12 mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Address
                    </label>
                    <input type="text" className="form-control radius-8" />
                  </div>

                  <div className="d-flex align-items-center gap-3 mt-24">
                    <button
                      type="reset"
                      className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-40 py-11 radius-8"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary grip border border-primary-600 text-md px-48 py-12 radius-8"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Modal End */}

      {/* Modal Start */}
      <div
        className="modal fade"
        id="exampleModalTwo"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-m modal-dialog modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Add New Region
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body p-24">
              <form action="#">
                <div className="row">
                  <div className="col-12 mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Region Name
                    </label>
                    <input type="text" className="form-control radius-8" />
                  </div>

                  <div className="col-12 mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Date
                    </label>
                    <input type="date" className="form-control radius-8" />
                  </div>

                  <div className="col-12 mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Region Head
                    </label>
                    <select class="form-control form-select">
                      <option value="Date">Select Region Head</option>
                      <option value="1" selected="">
                        Rajesh
                      </option>
                      <option value="1" selected="">
                        Madhu
                      </option>
                      <option value="1" selected="">
                        Prabhu
                      </option>
                    </select>
                  </div>

                  <div className="d-flex align-items-center gap-3 mt-24">
                    <button
                      type="reset"
                      className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-40 py-11 radius-8"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary grip border border-primary-600 text-md px-48 py-12 radius-8"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Modal End */}

      {/* Modal Start */}
      <div
        className="modal fade"
        id="exampleModalOne"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-m modal-dialog modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit Chapter
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body p-24">
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <tbody>
                  <tr
                    style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}
                  >
                    <td style={{ padding: "8px 0" }}>
                      <strong>Chapter Name:</strong>
                    </td>
                    <td style={{ padding: "8px 0" }}>
                      GRIP Aram <span className="chapterday">(Tuesday)</span>
                    </td>
                  </tr>
                  <tr
                    style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}
                  >
                    <td style={{ padding: "8px 0" }}>
                      <strong>Region:</strong>
                    </td>
                    <td style={{ padding: "8px 0" }}>Chennai</td>
                  </tr>
                  <tr
                    style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}
                  >
                    <td style={{ padding: "8px 0" }}>
                      <strong>CID:</strong>
                    </td>
                    <td style={{ padding: "8px 0" }}>Richard</td>
                  </tr>
                  <tr
                    style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}
                  >
                    <td style={{ padding: "8px 0" }}>
                      <strong>Location:</strong>
                    </td>
                    <td style={{ padding: "8px 0" }}>Pallavaram</td>
                  </tr>
                  <tr
                    style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}
                  >
                    <td style={{ padding: "8px 0" }}>
                      <strong>Status:</strong>
                    </td>
                    <td style={{ padding: "8px 0" }}>
                      <select
                        className="form-select"
                        style={{
                          width: "150px",
                          padding: "8px 8px",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          backgroundColor: "#fff",
                        }}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Pending">Upcoming</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Modal End */}

      {/* REQUIRED!! */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default ChapterViewLayer;

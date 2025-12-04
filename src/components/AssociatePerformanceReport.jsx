import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import chapterApiProvider from "../apiProvider/chapterApi";

export default function MemberSixMonthReport() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [memberData, setMemberData] = useState(null);

    useEffect(() => {
        if (id) {
            fetchReport(id);
        }
    }, [id]);


    /** 🔥 Fetch Only One Member Performance */
    async function fetchReport(memberId) {
        try {
            setLoading(true);
           let memberIds=[memberId]
            const body = {
                page: 1,
                limit: 1
            };
            const res = await chapterApiProvider.getAssociatePerformanceReport(memberIds,body)

            if (res?.success && res.data.length > 0) {
                setMemberData(res.data[0]); // store single associate
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    /** 🔥 Convert "2025-09" → "September 2025" */
    const formatMonth = (monthKey) => {
        const date = new Date(monthKey + "-01");
        return date.toLocaleString("en-US", { month: "long", year: "numeric" });
    };

    /** Score total for each row */
    const calcMonthTotal = (m) =>
        (m?.oneToOne || 0) +
        (m?.referrals || 0) +
        (m?.visitors || 0) +
        (m?.trainings || 0) +
        (m?.business || 0) +
        (m?.testimonials || 0) +
        (m?.attendance || 0);


    return (
        <div className="card p-3">

            {/* HEADER */}
            <div className="d-flex justify-content-between mb-3">
                <h4>6-Month Report — <b>{memberData?.memberName}</b></h4>
                <button className="btn btn-dark" onClick={() => navigate(-1)}>Back</button>
            </div>

            {loading ? (
                <h5 className="text-center">Loading...</h5>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered">

                        <thead className="bg-light fw-bold">
                            <tr>
                                <th>Month</th>
                                <th>One-to-One</th>
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
                            {memberData && Object.keys(memberData.monthlyScore).map((month) => {
                                const row = memberData.monthlyScore[month];
                                return (
                                    <tr key={month}>
                                        <td><b>{formatMonth(month)}</b></td>
                                        <td>{row.oneToOne || 0}</td>
                                        <td>{row.referrals || 0}</td>
                                        <td>{row.visitors || 0}</td>
                                        <td>{row.trainings || 0}</td>
                                        <td>{row.business || 0}</td>
                                        <td>{row.testimonials || 0}</td>
                                        <td>{row.attendance || 0}</td>
                                        <td className="fw-bold text-primary">
                                            {calcMonthTotal(row).toFixed(2)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>

                    </table>
                </div>
            )}
        </div>
    );
}

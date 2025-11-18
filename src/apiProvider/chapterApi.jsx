import { message, notification } from "antd";
import apiClient from "../network/apiClient";

class ChapterApiProvider {

    async createZone(input) {
        try {
            const response = await apiClient.post(`/zones`, input);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching zone:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async createChapter(input) {
        try {
            const response = await apiClient.post(`/chapters`, input);

            if (response.status === 200 || response.status === 201) {
                // notification.success({
                //   message: "Chapter created successfully",
                //   placement: "topRight",
                //   pauseOnHover: false,
                // });
                return { status: true, response: response.data };
            } else {
                notification.error({
                    message: response.data?.message ?? "❌ Failed to create chapter",
                    placement: "topRight",
                    pauseOnHover: false,
                });
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching chapter:", error);

            if (error.response?.status === 401) {
                notification.error({
                    message: "❌ Unauthorized access - check your token",
                    placement: "topRight",
                    pauseOnHover: false,
                });
            } else {
                notification.error({
                    message: error?.data?.message ?? "❌ Unexpected server error",
                    placement: "topRight",
                    pauseOnHover: false,
                });
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async getAllChapters(input) {
        try {
            console.log("Fetching all chaptersdfg...");
            const search = input && input.search ? input.search : "";
            const response = await apiClient.get(`/chapters/list`, { params: { search } });
            console.log("Response from getAllChapters:", response);
            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching chapter:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }
    async getZonesByState(input) {
        try {
            const response = await apiClient.get(`/zones/by-state/${input}`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching zone:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }
    async getChaptersByZone(input) {
        try {
            const response = await apiClient.get(`/chapters/by-zone/${input}`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching chapter:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }
    async getCidsByZone(input) {
        try {
            const response = await apiClient.get(`/chapters`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching chapter:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async updateChapterStatus(id, input) {
        try {
            const data = {
                isActive: input.isActive,
            };
            console.log(data, "ertyuiy345tyu");
            const response = await apiClient.patch(`/chapters/${id}/status`, data);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching chapter:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }


    async getChaptersById(input) {
        try {
            const response = await apiClient.get(`/chapters/${input}`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching chapter:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async getChapterReport(input) {
        try {
            const response = await apiClient.get(`/chapters/report/chapter-stats`);
            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching chapter report:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async thankYouSlipList(input) {
        try {
            const response = await apiClient.get('/thankyouslips/list');
            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching thank you slip list:", error);
            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }
            return { status: false, response: error.response?.data ?? null };
        }
    }

    async thankYouSlipListMember(input) {
        console.log(input, "input")
        try {
            const response = await apiClient.get(`/thankyouslips/member/list/${input}`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching thank you slip list member:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async refferalList(input) {
        try {
            const response = await apiClient.get('/referralslip/list');

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching refferal list:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async deleteReferralSlipById(referralSlipId) {
        try {
            console.log("Deleting Referral Slip ID:", referralSlipId);

            // Call the backend PATCH endpoint
            const response = await apiClient.patch(`/referralslip/delete/${referralSlipId}`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error(
                    "Failed to delete Referral Slip record:",
                    response.data?.message ?? "Something went wrong"
                );
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error deleting Referral Slip record:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async deleteThankYouSlipById(thankYouSlipId) {
        try {
            console.log("Deleting Thank You Slip ID:", thankYouSlipId);

            const response = await apiClient.patch(`/thankyouslips/delete/${thankYouSlipId}`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to delete Thank You Slip:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error deleting Thank You Slip:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async deleteTestimonialById(testimonialId) {
        try {
            console.log("Deleting Testimonial ID:", testimonialId);

            // Call the backend PATCH endpoint
            const response = await apiClient.patch(`/testimonialslips/delete/${testimonialId}`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error(
                    "Failed to delete Testimonial record:",
                    response.data?.message ?? "Something went wrong"
                );
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error deleting Testimonial record:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async deleteVisitorById(visitorId) {
        try {
            console.log("Deleting Visitor ID:", visitorId);

            // Call the backend PATCH endpoint
            const response = await apiClient.patch(`/visitors/delete/${visitorId}`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error(
                    "Failed to delete Visitor record:",
                    response.data?.message ?? "Something went wrong"
                );
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error deleting Visitor record:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }


    async refferalListMember(input) {
        console.log(input, "input")
        try {
            const response = await apiClient.get(`/referralslip/member/list/${input}`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching refferal list member:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async testimonialSlipList(input) {
        try {
            const response = await apiClient.get('/testimonialslips/list');

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching testimonial slip list:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async testimonialSlipListMember(input) {
        console.log(input, "input")
        try {
            const response = await apiClient.get(`/testimonialslips/member/list/${input}`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching testimonial slip list member:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async visitorsSlipList(input) {
        try {
            const response = await apiClient.get('/visitors/list');

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching visitors slip list:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }



    async visitorsSlipListMember(input) {
        try {
            const response = await apiClient.get(`/visitors/member/list/${input}`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching visitors slip list member:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }
    async monthlyRevenueBasedonChapter(input) {
        try {
            const response = await apiClient.get(`/thankyouslips/monthlyThankyouslipByChapter/${input}`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch monthly revenue based on chapter:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching monthly revenue based on chapter:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }
    async onetooneSlipList() {
        try {
            const response = await apiClient.get('/onetoone/list');

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching one to one slip list:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async onetooneSlipListMember(input) {
        try {
            const response = await apiClient.get(`/onetoone/member/list/${input}`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching one to one slip list member:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async deleteOneToOneById(oneToOneId) {
        try {
            console.log("ddfdf", oneToOneId);

            const response = await apiClient.patch(`/onetoone/delete/${oneToOneId}`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to delete One-to-One record:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error deleting One-to-One record:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async changeStatus(input) {
        try {
            const response = await apiClient.patch(`${input.formName}/status/${input.id}`, { status: input.status });

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching chapter status:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }
    // getChapterCountById

    async getChapterCountById(input) {
        try {
            const response = await apiClient.get(`/chapters/statsCount/${input}`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching chapter count by id:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }
    async getHeadTableUsersByChapterId(input) {
        try {
            const response = await apiClient.get(`/chapters/headTableUsers/${input}`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch head table users by id:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching head table users by id:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async getHeadTableMembersByChapterId(input) {
        try {
            const response = await apiClient.get(`/chapters/headTableMembers/${input}`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch head table members by id:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching head table members by id:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }
    async getTopAchieversById(input) {
        try {
            const response = await apiClient.get(`/chapters/topPerformersofChapter/${input}`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching chapter top achievers by id:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async getMembersAttendanceCount(memberIds) {
        try {
            const response = await apiClient.post('/members/meetings-attendance-count', {
                memberIds, // send array directly in body
            });

            if (response.status === 200 || response.status === 201) {
                return { success: true, data: response.data.data };
            } else {
                console.error("Failed to fetch attendance counts:", response.data?.message ?? "Something went wrong");
                return { success: false, data: {} };
            }
        } catch (error) {
            console.error("Error fetching attendance counts:", error);
            return { success: false, data: {} };
        }
    }

    // memberApiProvider.ts
    async getOneToOneCounts(memberIds) {
        try {
            const response = await apiClient.post('/members/one-to-one-count', {
                memberIds,
            });

            if (response.status === 200 || response.status === 201) {
                return { success: true, data: response.data.data };
            } else {
                console.error("Failed to fetch one-to-one counts:", response.data?.message);
                return { success: false, data: {} };
            }
        } catch (error) {
            console.error("Error fetching one-to-one counts:", error);
            return { success: false, data: {} };
        }
    }


    async getReferralCounts(memberIds) {
        try {
            const response = await apiClient.post('/members/referral-count', {
                memberIds,
            });

            if (response.status === 200 || response.status === 201) {
                return { success: true, data: response.data.data };
            } else {
                console.error("Failed to fetch referral counts:", response.data?.message);
                return { success: false, data: {} };
            }
        } catch (error) {
            console.error("Error fetching referral counts:", error);
            return { success: false, data: {} };
        }
    }

    async getThankYouSlipAmounts(memberIds) {
        try {
            const response = await apiClient.post('/members/thank-you-slip-amounts', { memberIds });

            if (response.status === 200 || response.status === 201) {
                return { success: true, data: response.data.data };
            } else {
                console.error("Failed to fetch ThankYouSlip amounts:", response.data?.message);
                return { success: false, data: {} };
            }
        } catch (error) {
            console.error("Error fetching ThankYouSlip amounts:", error);
            return { success: false, data: {} };
        }
    }

    // memberApiProvider.ts
    async getVisitorCounts(memberIds) {
        try {
            const response = await apiClient.post('/members/visitor-count', { memberIds });

            if (response.status === 200 || response.status === 201) {
                return { success: true, data: response.data.data };
            } else {
                console.error("Failed to fetch visitor counts:", response.data?.message);
                return { success: false, data: {} };
            }
        } catch (error) {
            console.error("Error fetching visitor counts:", error);
            return { success: false, data: {} };
        }
    }

    // memberApiProvider.ts
    async getTestimonialCounts(memberIds) {
        try {
            const response = await apiClient.post('/members/testimonial-counts', {
                memberIds,
            });

            if (response.status === 200 || response.status === 201) {
                return { success: true, data: response.data.data };
            } else {
                console.error("Failed to fetch testimonial counts:", response.data?.message);
                return { success: false, data: {} };
            }
        } catch (error) {
            console.error("Error fetching testimonial counts:", error);
            return { success: false, data: {} };
        }
    }
}
const chapterApiProvider = new ChapterApiProvider()
export default chapterApiProvider
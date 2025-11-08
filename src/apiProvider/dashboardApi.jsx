import apiClient from "../network/apiClient";

class DashboardApiProvider {

    async getDashboardCounts() {
        try {
            const response = await apiClient.get(`/dashboard/statsCount`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching dashboard counts:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }
    async getIncomeSummary(input) {
        try {
            const params = {
                dateFilter: input.dateFilter
            }
            const response = await apiClient.get(`/dashboard/income-summary`, {params});

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch total income:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching total income:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }
    async getHowDidYouHearStats(input) {
        try {
            const params = {
                dateFilter: input.dateFilter
            }
            const response = await apiClient.get(`/dashboard/getHowDidYouHearStats`, {params});

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch how did you hear stats:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching how did you hear stats:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }
    async getRecentMembers() {
        try {
            const response = await apiClient.get(`/dashboard/getrecentMembers`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch recent members:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching recent members:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }
    async getRecentEnquiries() {
        try {
            const response = await apiClient.get(`/dashboard/getrecentEnquiries`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch recent enquiries:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching recent enquiries:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }
}
const dashboardApiProvider = new DashboardApiProvider()
export default dashboardApiProvider
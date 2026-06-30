import apiClient from "../network/apiClient";

class OnboardingApiProvider {
    async getAllApplications() {
        try {
            const response = await apiClient.get("/associate-application");
            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching onboarding applications:", error);
            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
            }
            return { status: false, response: error.response?.data ?? null };
        }
    }

    async getApplicationById(id) {
        try {
            const response = await apiClient.get(`/associate-application/${id}`);
            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                return { status: false, response: response.data };
            }
        } catch (error) {
            return { status: false, response: error.response?.data ?? null };
        }
    }

    async updateApplicationStatus(id, statusData) {
        try {
            const response = await apiClient.patch(`/associate-application/${id}/status`, { status: statusData });
            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                return { status: false, response: response.data };
            }
        } catch (error) {
            return { status: false, response: error.response?.data ?? null };
        }
    }

    async deleteApplication(id) {
        try {
            const response = await apiClient.delete(`/associate-application/${id}`);
            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                return { status: false, response: response.data };
            }
        } catch (error) {
            return { status: false, response: error.response?.data ?? null };
        }
    }
}

const onboardingApiProvider = new OnboardingApiProvider();
export default onboardingApiProvider;

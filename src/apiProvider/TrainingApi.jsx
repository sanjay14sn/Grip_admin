import apiClient from "../network/apiClient";

class TrainingApiProvider {
    async getPublicZones() {
        try {
            const response = await apiClient.get("/zones/list/public");

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data }; // success
            } else {
                return { status: false, response: response.data }; // some non-success HTTP status
            }
        } catch (error) {
            console.error("Error fetching public zones:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }


    // Fetch chapters for a given zone (public)
    async getChaptersByZonePublic(zoneId) {
        try {
            const response = await apiClient.get(`/chapters/by-zone/public/${zoneId}`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error(`Error fetching chapters for zone ${zoneId}:`, error);

            return { status: false, response: error.response?.data ?? null };
        }
    }

    // Fetch members for a given chapter (public)
    async getMembersByChapterIdPublic(chapterId) {
        try {
            const response = await apiClient.get(`/members/by-chapter/public/${chapterId}`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data }; // success
            } else {
                return { status: false, response: response.data }; // non-success HTTP status
            }
        } catch (error) {
            console.error(`Error fetching members for chapter ${chapterId}:`, error);
            return { status: false, response: error.response?.data ?? null };
        }
    }

    async getUsersByRole(input) {
        try {
            const params = {
                role: input.role
            }
            const response = await apiClient.get(`/cid/public/by-role`, { params });

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data }; 
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching category:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    
    async submitvisitors(input) {
        try {
            const response = await apiClient.post(`/visitors`, input);

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

export default new TrainingApiProvider();
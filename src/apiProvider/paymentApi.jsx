import { Input } from "react-select/animated";
import apiClient from "../network/apiClient";

class PaymentApiProvider {
    async addPayment(input) {
        try {
            console.log(input, "api provider payment");

            const response = await apiClient.post(`/payments`, input);
            if (response.status === 200 || response.status === 201) {
                return {
                    status: true,
                    data: response.data
                };
            } else {
                console.error("Failed to fetch associates:", response.data?.message ?? "Something went wrong");
                return { status: false, data: response.data };
            }
        } catch (error) {
            console.error("Error fetching associates:", error);
            return { status: false, data: error.response?.data ?? null };
        }
    }

    async getPaymentDetails(input) {
        try {
const params = {
    page: input.page,
    limit: input.limit,
    search: input.search,
    purpose: input.purpose,
}
            const response = await apiClient.get(`/payments/list`,{params});
            if (response.status === 200 || response.status === 201) {
                return { status: true, data: response.data };
            } else {
                console.error("Failed to fetch member:", response.data?.message ?? "Something went wrong");
                return { status: false, data: response.data };
            }
        } catch (error) {
            console.error("Error fetching associate:", error);
            return { status: false, data: error.response?.data ?? null };
        }
    }


    async getMemberByChapterId(id) {
        try {
            const response = await apiClient.get(`/members/by-chapter/${id}`);
            if (response.status === 200) {
                return { status: true, data: response.data };
            } else {
                console.error("Failed to fetch associate:", response.data?.message ?? "Something went wrong");
                return { status: false, data: response.data };
            }
        } catch (error) {
            console.error("Error fetching associate:", error);
            return { status: false, data: error.response?.data ?? null };
        }
    }

    async createMember(memberData) {
        try {
            const response = await apiClient.post(`/members`, memberData);
            if (response.status === 200 || response.status === 201) {
                return { status: true, data: response.data };
            } else {
                console.error("Failed to create associate:", response.data?.message ?? "Something went wrong");
                return { status: false, data: response.data };
            }
        } catch (error) {
            console.error("Error creating associate:", error);
            return { status: false, data: error.response?.data ?? null };
        }
    }

    async updatePayment(id, paymentData) {
        try {
            const response = await apiClient.put(`/payments/${id}`, paymentData);
            if (response.status === 200) {
                return { status: true, data: response.data };
            } else {
                console.error("Failed to update paymentData:", response.data?.message ?? "Something went wrong");
                return { status: false, data: response.data };
            }
        } catch (error) {
            console.error("Error updating paymentData:", error);
            return { status: false, data: error.response?.data ?? null };
        }
    }

    async deletPayemnt(id) {
        try {
            const response = await apiClient.delete(`/payments/${id}`);
            if (response.status === 200 || response.status === 201) {
                return { status: true, data: response.data };
            } else {
                console.error("Failed to delete member:", response.data?.message ?? "Something went wrong");
                return { status: false, data: response.data };
            }
        } catch (error) {
            console.error("Error deleting member:", error);
            return { status: false, data: error.response?.data ?? null };
        }
    }
}

const paymentApiProvider = new PaymentApiProvider();
export default paymentApiProvider;

import { param } from "jquery";
import apiClient from "../network/apiClient";

class MemberApiProvider {
  async getMembers(params) {
    try {
      const response = await apiClient.get(`/members/list`, { params });
      if (response.status === 200) {
        return {
          status: true,
          data: response.data,
        };
      } else {
        console.error(
          "Failed to fetch members:",
          response.data?.message ?? "Something went wrong"
        );
        return { status: false, data: response.data };
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      return { status: false, data: error.response?.data ?? null };
    }
  }

  async getMemberById(id) {
    try {
      const response = await apiClient.get(`/members/${id}`);
      if (response.status === 200) {
        return { status: true, data: response.data };
      } else {
        console.error(
          "Failed to fetch member:",
          response.data?.message ?? "Something went wrong"
        );
        return { status: false, data: response.data };
      }
    } catch (error) {
      console.error("Error fetching member:", error);
      return { status: false, data: error.response?.data ?? null };
    }
  }

  async getMemberByChapterId(params, chapterId) {
    try {
      const response = await apiClient.get(`/members/by-chapter/${chapterId}`, {
        params: params,
      });
      if (response.status === 200) {
        return { status: true, data: response.data };
      } else {
        console.error(
          "Failed to fetch member:",
          response.data?.message ?? "Something went wrong"
        );
        return { status: false, data: response.data };
      }
    } catch (error) {
      console.error("Error fetching member:", error);
      return { status: false, data: error.response?.data ?? null };
    }
  }

  async getMembersByEvents(params, id) {
    try {
      const response = await apiClient.get(
        `/members/by-meeting/${id}`,
        { params: params } // Example pagination parameters
      );
      if (response.status === 200) {
        return { status: true, data: response.data };
      } else {
        console.error(
          "Failed to fetch member:",
          response.data?.message ?? "Something went wrong"
        );
        return { status: false, data: response.data };
      }
    } catch (error) {
      console.error("Error fetching member:", error);
      return { status: false, data: error.response?.data ?? null };
    }
  }

  async createMember(memberData) {
    try {
      const response = await apiClient.post(`/members`, memberData);

      return {
        status: response.data.success ?? true,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error) {
      console.error("❌ Axios caught error:", error);

      const backendMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";

      return {
        status: false,
        message: backendMessage, // ✅ correct
        data: error.response?.data ?? null,
      };
    }
  }

async updateMember(id, memberData) {
  try {
    const response = await apiClient.put(`/members/${id}`, memberData);

    return {
      status: response.data.success === true, // ✅ align with backend flag
      message: response.data.message || "Member updated successfully", // ✅ safe fallback
      data: response.data.data ?? null, // ✅ direct data
    };
  } catch (error) {
    console.error("❌ Error updating member:", error);

    const backendMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to update member";

    return {
      status: false,
      message: backendMessage, // ✅ proper backend message
      data: error.response?.data ?? null,
    };
  }
}

async createTopAchiver(chapterId, payload) {
  try {
    const response = await apiClient.post(`topachivers/${chapterId}`, payload);

    return {
      status: response.data.success ?? true,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    return {
      status: false,
      message: error.message || "API error",
      data: null,
    };
  }
}

async getTopAchiver(chapterId) {
  try {
    const response = await apiClient.get(`topachivers/${chapterId}`);

    return {
      status: response.data.success ?? true,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    return {
      status: false,
      message: error.message || "API error",
      data: null,
    };
  }
}





  async deleteMember(id) {
    try {
      const response = await apiClient.delete(`/members/${id}`);
      if (response.status === 200) {
        return { status: true, data: response.data };
      } else {
        console.error(
          "Failed to delete member:",
          response.data?.message ?? "Something went wrong"
        );
        return { status: false, data: response.data };
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      return { status: false, data: error.response?.data ?? null };
    }
  }

  async getRegisterUserList(params) {
    try {
      const response = await apiClient.get(`/members/approvalList`, { params });
      if (response.status === 200 || response.status === 201) {
        return {
          status: true,
          data: response.data,
        };
      } else {
        console.error(
          "Failed to fetch members:",
          response.data?.message ?? "Something went wrong"
        );
        return { status: false, data: response.data };
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      return { status: false, data: error.response?.data ?? null };
    }
  }

  async updateMemberStatus(id, memberData) {
    try {
      const response = await apiClient.patch(
        `/members/status/${id}`,
        memberData
      );
      if (response.status === 200 || response.status === 201) {
        return { status: true, data: response.data };
      } else {
        console.error(
          "Failed to update member:",
          response.data?.message ?? "Something went wrong"
        );
        return { status: false, data: response.data };
      }
    } catch (error) {
      console.error("Error updating member:", error);
      return { status: false, data: error.response?.data ?? null };
    }
  }

  async updateMemberRole(id, memberData) {
    try {
      const response = await apiClient.patch(`/members/type/${id}`, memberData);
      if (response.status === 200 || response.status === 201) {
        return { status: true, data: response.data };
      } else {
        console.error(
          "Failed to update member:",
          response.data?.message ?? "Something went wrong"
        );
        return { status: false, data: response.data };
      }
    } catch (error) {
      console.error("Error updating member:", error);
      return { status: false, data: error.response?.data ?? null };
    }
  }

  async attedenseMark(memberData) {
    try {
      const response = await apiClient.post(`/attendance`, memberData);
      if (response.status === 200 || response.status === 201) {
        return { status: true, data: response.data };
      } else {
        console.error(
          "Failed to update member:",
          response.data?.message ?? "Something went wrong"
        );
        return { status: false, data: response.data };
      }
    } catch (error) {
      console.error("Error updating member:", error);
      return { status: false, data: error.response?.data ?? null };
    }
  }
}

const memberApiProvider = new MemberApiProvider();
export default memberApiProvider;

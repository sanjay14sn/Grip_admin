import apiClient from "../network/apiClient";

class PinApiProvider {
  // ✅ Create (Add Pin)
  async addPin(input) {
    try {
      const response = await apiClient.post(`/pins`, input);
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        console.error(
          "Failed to add pin:",
          response.data?.message ?? "Something went wrong"
        );
        return { status: false, response: response.data };
      }
    } catch (error) {
      console.error("Error adding pin:", error);
      return { status: false, response: error.response?.data ?? null };
    }
  }

  // ✅ Read (Get All Pins with pagination/search)
  async getPins(params) {
    try {
      const response = await apiClient.get(`/pins/list`, { params });
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        console.error(
          "Failed to fetch pins:",
          response.data?.message ?? "Something went wrong"
        );
        return { status: false, response: response.data };
      }
    } catch (error) {
      console.error("Error fetching pins:", error);
      return { status: false, response: error.response?.data ?? null };
    }
  }

  // ✅ Read by ID (Get Single Pin)
  async getPinById(id) {
    try {
      const response = await apiClient.get(`/pins/${id}`);
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        console.error(
          "Failed to fetch pin:",
          response.data?.message ?? "Something went wrong"
        );
        return { status: false, response: response.data };
      }
    } catch (error) {
      console.error("Error fetching pin by ID:", error);
      return { status: false, response: error.response?.data ?? null };
    }
  }

  // ✅ Update (Edit Pin)
  async updatePin(id, input) {
    try {
      const response = await apiClient.patch(`/pins/${id}`, input);
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        console.error(
          "Failed to update pin:",
          response.data?.message ?? "Something went wrong"
        );
        return { status: false, response: response.data };
      }
    } catch (error) {
      console.error("Error updating pin:", error);
      return { status: false, response: error.response?.data ?? null };
    }
  }

  // ✅ Delete (Remove Pin)
  async deletePin(id) {
    try {
      const response = await apiClient.delete(`/pins/${id}`);
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        console.error(
          "Failed to delete pin:",
          response.data?.message ?? "Something went wrong"
        );
        return { status: false, response: response.data };
      }
    } catch (error) {
      console.error("Error deleting pin:", error);
      return { status: false, response: error.response?.data ?? null };
    }
  }
}

const pinApiProvider = new PinApiProvider();
export default pinApiProvider;

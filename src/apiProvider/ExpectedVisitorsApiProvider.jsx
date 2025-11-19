import apiClient from "../network/apiClient";

class ExpectedVisitorsApiProvider {
  // GET /api/admin/visitors/list
  async getExpectedVisitors(params = {}) {
    try {
      const token = localStorage.getItem("userToken");

      const response = await apiClient.get("/expectedvisitors", {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { status: true, data: response.data };
    } catch (error) {
      console.error("GET expected visitors error:", error);
      return { status: false, data: null };
    }
  }
}

export default new ExpectedVisitorsApiProvider();

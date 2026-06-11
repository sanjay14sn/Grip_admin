import apiClient from '../network/apiClient';

class AccessRequestApiProvider {

  async submitRequest(data) {
    try {
      const response = await apiClient.post('/access-requests', data);
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      }
      return { status: false, response: response.data };
    } catch (error) {
      return { status: false, response: error.response?.data ?? null };
    }
  }

  async listRequests(params = {}) {
    try {
      const response = await apiClient.get('/access-requests/list', { params });
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      }
      return { status: false, response: response.data };
    } catch (error) {
      return { status: false, response: error.response?.data ?? null };
    }
  }

  async myRequests() {
    try {
      const response = await apiClient.get('/access-requests/my');
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      }
      return { status: false, response: response.data };
    } catch (error) {
      return { status: false, response: error.response?.data ?? null };
    }
  }

  async respondToRequest(id, data) {
    try {
      const response = await apiClient.patch(`/access-requests/${id}/respond`, data);
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      }
      return { status: false, response: response.data };
    } catch (error) {
      return { status: false, response: error.response?.data ?? null };
    }
  }

  async getPendingCount() {
    try {
      const response = await apiClient.get('/access-requests/pending-count');
      if (response.status === 200 || response.status === 201) {
        return { status: true, count: response.data.count };
      }
      return { status: true, count: 0 };
    } catch (error) {
      return { status: true, count: 0 };
    }
  }

  async deleteRequest(id) {
    try {
      const response = await apiClient.delete(`/access-requests/${id}`);
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      }
      return { status: false, response: response.data };
    } catch (error) {
      return { status: false, response: error.response?.data ?? null };
    }
  }
}

const accessRequestApiProvider = new AccessRequestApiProvider();
export default accessRequestApiProvider;

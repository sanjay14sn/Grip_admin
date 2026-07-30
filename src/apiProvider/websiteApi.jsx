import apiClient from "../network/apiClient";

class WebsiteApiProvider {

  async saveChapterWebsite(chapterId, { bgImageFile, memberLinks }) {
    try {
      const formData = new FormData();

      if (bgImageFile) {
        formData.append("bgImage", bgImageFile);
      }

      // memberLinks: [{ memberId, profileLink }]
      formData.append("memberLinks", JSON.stringify(memberLinks));

      const response = await apiClient.post(
        `/website/chapters/${chapterId}`,
        formData
      );

      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        return { status: false, response: response.data };
      }
    } catch (error) {
      console.error("Error saving chapter website:", error);
      return { status: false, response: error.response?.data ?? null };
    }
  }

  async getChapterWebsite(chapterId) {
    try {
      const response = await apiClient.get(`/website/chapters/${chapterId}`);
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        return { status: false, response: response.data };
      }
    } catch (error) {
      console.error("Error fetching chapter website:", error);
      return { status: false, response: error.response?.data ?? null };
    }
  }

  // ── Gallery ────────────────────────────────────────────────────────────────

  async getGallery(chapterId) {
    try {
      const response = await apiClient.get(`/gallery/chapters/${chapterId}`);
      return response.status === 200 ? { status: true, data: response.data.data || [] } : { status: false, data: [] };
    } catch (error) {
      return { status: false, data: [] };
    }
  }

  async createAlbum(chapterId, { name, description, coverImageFile }) {
    try {
      const formData = new FormData();
      formData.append('name', name);
      if (description) formData.append('description', description);
      if (coverImageFile) formData.append('coverImage', coverImageFile);
      const response = await apiClient.post(`/gallery/chapters/${chapterId}/albums`, formData);
      return response.status === 200 ? { status: true, data: response.data.data } : { status: false, message: 'Unexpected response' };
    } catch (error) {
      return { status: false, message: error?.message || error?.data?.message || 'Failed to create album' };
    }
  }

  async updateAlbum(chapterId, albumId, { name, description, coverImageFile }) {
    try {
      const formData = new FormData();
      if (name) formData.append('name', name);
      if (description !== undefined) formData.append('description', description);
      if (coverImageFile) formData.append('coverImage', coverImageFile);
      const response = await apiClient.patch(`/gallery/chapters/${chapterId}/albums/${albumId}`, formData);
      return response.status === 200 ? { status: true, data: response.data.data } : { status: false, message: 'Unexpected response' };
    } catch (error) {
      return { status: false, message: error?.message || error?.data?.message || 'Failed to update album' };
    }
  }

  async deleteAlbum(chapterId, albumId) {
    try {
      const response = await apiClient.delete(`/gallery/chapters/${chapterId}/albums/${albumId}`);
      return response.status === 200 ? { status: true } : { status: false, message: 'Unexpected response' };
    } catch (error) {
      return { status: false, message: error?.message || 'Failed to delete album' };
    }
  }

  async uploadImages(chapterId, albumId, files) {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      const response = await apiClient.post(
        `/gallery/chapters/${chapterId}/albums/${albumId}/images`,
        formData
      );
      return response.status === 200 ? { status: true, data: response.data.data } : { status: false, message: 'Unexpected response' };
    } catch (error) {
      return { status: false, message: error?.message || 'Failed to upload images' };
    }
  }

  async deleteImage(chapterId, albumId, imageId) {
    try {
      const response = await apiClient.delete(
        `/gallery/chapters/${chapterId}/albums/${albumId}/images/${imageId}`
      );
      return response.status === 200 ? { status: true } : { status: false };
    } catch (error) {
      return { status: false };
    }
  }
}

const websiteApiProvider = new WebsiteApiProvider();
export default websiteApiProvider;

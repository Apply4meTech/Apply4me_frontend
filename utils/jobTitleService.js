const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

const API_BASE = getApiUrl();

class JobTitleService {
  constructor() {
    this.apiBase = API_BASE;
  }

  async getAllAdmin(token) {
    try {
      const response = await fetch(`${this.apiBase}/api/job-titles/admin`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.error || 'Failed to fetch job titles' };
      }
      return { success: true, data: data.data || [] };
    } catch (error) {
      console.error('Error fetching job titles:', error);
      return { success: false, message: 'Failed to fetch job titles' };
    }
  }

  async create(data, token) {
    try {
      const response = await fetch(`${this.apiBase}/api/job-titles/admin`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      if (!response.ok) {
        return { success: false, message: res.error || 'Failed to create job title' };
      }
      return { success: true, data: res.data, message: res.message };
    } catch (error) {
      console.error('Error creating job title:', error);
      return { success: false, message: 'Failed to create job title' };
    }
  }

  async update(id, data, token) {
    try {
      const response = await fetch(`${this.apiBase}/api/job-titles/admin/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      if (!response.ok) {
        return { success: false, message: res.error || 'Failed to update job title' };
      }
      return { success: true, data: res.data, message: res.message };
    } catch (error) {
      console.error('Error updating job title:', error);
      return { success: false, message: 'Failed to update job title' };
    }
  }

  async delete(id, token) {
    try {
      const response = await fetch(`${this.apiBase}/api/job-titles/admin/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const res = await response.json();
      if (!response.ok) {
        return { success: false, message: res.error || 'Failed to delete job title' };
      }
      return { success: true, message: res.message };
    } catch (error) {
      console.error('Error deleting job title:', error);
      return { success: false, message: 'Failed to delete job title' };
    }
  }
}

export default new JobTitleService();

const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

const API_BASE = getApiUrl();

class InterviewService {
  constructor() {
    this.apiBase = API_BASE;
  }

  authHeaders(token) {
    return { Authorization: `Bearer ${token}` };
  }

  async getQuota(token) {
    try {
      const response = await fetch(`${this.apiBase}/api/interviews/quota`, {
        headers: this.authHeaders(token)
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.error || 'Failed to fetch quota' };
      }
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Get interview quota error:', error);
      return { success: false, message: 'Failed to fetch quota' };
    }
  }

  async startInterview({ jobRole, jobDescription }, token) {
    try {
      const response = await fetch(`${this.apiBase}/api/interviews/start`, {
        method: 'POST',
        headers: {
          ...this.authHeaders(token),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ jobRole, jobDescription })
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.error || 'Failed to start interview' };
      }
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Start interview error:', error);
      return { success: false, message: 'Failed to start interview' };
    }
  }

  async listInterviews(token) {
    try {
      const response = await fetch(`${this.apiBase}/api/interviews`, {
        headers: this.authHeaders(token)
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.error || 'Failed to fetch interviews' };
      }
      return { success: true, data: data.data || [] };
    } catch (error) {
      console.error('List interviews error:', error);
      return { success: false, message: 'Failed to fetch interviews' };
    }
  }

  async getInterview(id, token) {
    try {
      const response = await fetch(`${this.apiBase}/api/interviews/${id}`, {
        headers: this.authHeaders(token)
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.error || 'Failed to fetch interview' };
      }
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Get interview error:', error);
      return { success: false, message: 'Failed to fetch interview' };
    }
  }

  async submitAnswer(id, audioBlob, token) {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'answer.webm');

      const response = await fetch(`${this.apiBase}/api/interviews/${id}/answer`, {
        method: 'POST',
        headers: this.authHeaders(token),
        body: formData
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.error || 'Failed to submit answer' };
      }
      return { success: true, data: data.data, isComplete: data.isComplete };
    } catch (error) {
      console.error('Submit answer error:', error);
      return { success: false, message: 'Failed to submit answer' };
    }
  }
}

export default new InterviewService();

// Helper function to normalize API URL
const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  // Remove trailing /api if it exists to avoid double /api/api/
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

const API_BASE = getApiUrl();

/**
 * Plan Service for frontend integration
 * Handles all Plan API calls
 */
class PlanService {
  constructor() {
    this.apiBase = API_BASE;
  }

  /**
   * Get all active plans
   * @param {boolean} activeOnly - Whether to fetch only active plans
   * @returns {Promise<Object>} Plans response
   */
  async getAllPlans(activeOnly = true) {
    try {
      const response = await fetch(
        `${this.apiBase}/api/plans?activeOnly=${activeOnly}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Failed to fetch plans',
          error: data || 'Unknown error'
        };
      }

      return {
        success: true,
        data: data.data || [],
        count: data.count || 0,
        message: 'Plans fetched successfully',
      };
    } catch (error) {
      console.error('Error fetching plans:', error);
      return {
        success: false,
        message: 'Failed to fetch plans',
        error: error.message
      };
    }
  }

  /**
   * Get plan by ID
   * @param {string} planId - Plan ID
   * @returns {Promise<Object>} Plan response
   */
  async getPlanById(planId) {
    try {
      const response = await fetch(
        `${this.apiBase}/api/plans/${planId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Failed to fetch plan',
          error: data || 'Unknown error'
        };
      }

      return {
        success: true,
        data: data.data,
        message: 'Plan fetched successfully',
      };
    } catch (error) {
      console.error('Error fetching plan:', error);
      return {
        success: false,
        message: 'Failed to fetch plan',
        error: error.message
      };
    }
  }

  /**
   * Create plan (super admin only)
   * @param {Object} planData - Plan data
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Create response
   */
  async createPlan(planData, token) {
    try {
      const response = await fetch(
        `${this.apiBase}/api/plans`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(planData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Failed to create plan',
          error: data || 'Unknown error'
        };
      }

      return {
        success: true,
        data: data.data,
        message: data.message || 'Plan created successfully',
      };
    } catch (error) {
      console.error('Error creating plan:', error);
      return {
        success: false,
        message: 'Failed to create plan',
        error: error.message
      };
    }
  }

  /**
   * Update plan (super admin only)
   * @param {string} planId - Plan ID
   * @param {Object} planData - Plan data
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Update response
   */
  async updatePlan(planId, planData, token) {
    try {
      const response = await fetch(
        `${this.apiBase}/api/plans/${planId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(planData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Failed to update plan',
          error: data || 'Unknown error'
        };
      }

      return {
        success: true,
        data: data.data,
        message: data.message || 'Plan updated successfully',
      };
    } catch (error) {
      console.error('Error updating plan:', error);
      return {
        success: false,
        message: 'Failed to update plan',
        error: error.message
      };
    }
  }

  /**
   * Delete plan (super admin only)
   * @param {string} planId - Plan ID
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Delete response
   */
  async deletePlan(planId, token) {
    try {
      const response = await fetch(
        `${this.apiBase}/api/plans/${planId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Failed to delete plan',
          error: data || 'Unknown error'
        };
      }

      return {
        success: true,
        data: data.data,
        message: data.message || 'Plan deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting plan:', error);
      return {
        success: false,
        message: 'Failed to delete plan',
        error: error.message
      };
    }
  }
}

// Create and export a singleton instance
const planService = new PlanService();
export default planService;


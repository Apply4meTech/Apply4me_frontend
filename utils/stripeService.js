// Helper function to normalize API URL
const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  // Remove trailing /api if it exists to avoid double /api/api/
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

const STRIPE_API_BASE = getApiUrl();

/**
 * Stripe Service for frontend integration
 * Handles all Stripe API calls and payment processing
 */
class StripeService {
  constructor() {
    this.apiBase = STRIPE_API_BASE;
  }

  /**
   * Create a Stripe payment intent
   * @param {Object} orderData - Order details
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Payment intent creation response
   */
  async createPaymentIntent(orderData, token) {
    try {
      const response = await fetch(
        `${this.apiBase}/api/payments/stripe/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to create payment intent',
          error: data || 'Unknown error'
        };
      }

      return {
        success: true,
        data: data.data || data,
        client_secret: data.data?.client_secret || data.client_secret,
        message: data.message || 'Payment intent created successfully',
      };
    } catch (error) {
      console.error('Error creating Stripe payment intent:', error);
      return {
        success: false,
        message: 'Failed to create payment intent',
        error: error.message
      };
    }
  }

  /**
   * Verify payment
   * @param {Object} paymentData - Payment verification data
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Verification response
   */
  async verifyPayment(paymentData, token) {
    try {
      const response = await fetch(
        `${this.apiBase}/api/payments/stripe/verify`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Payment verification failed',
          error: data || 'Unknown error'
        };
      }

      return {
        success: true,
        data: data.data,
        message: 'Payment verified successfully',
        redirect_url: data.redirect_url
      };
    } catch (error) {
      console.error('Error verifying payment:', error);
      return {
        success: false,
        message: 'Payment verification failed',
        error: error.message
      };
    }
  }

  /**
   * Format amount for Stripe (convert to cents)
   * @param {number} amount - Amount in dollars
   * @returns {number} Amount in cents
   */
  formatAmount(amount) {
    return Math.round(amount * 100);
  }

  /**
   * Validate payment data
   * @param {Object} paymentData - Payment data to validate
   * @returns {Object} Validation result
   */
  validatePaymentData(paymentData) {
    const errors = [];

    if (!paymentData.payment_intent_id) {
      errors.push('Payment intent ID is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Create and export a singleton instance
const stripeService = new StripeService();
export default stripeService;


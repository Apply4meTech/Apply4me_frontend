// Helper function to normalize API URL
const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  // Remove trailing /api if it exists to avoid double /api/api/
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

const RAZORPAY_API_BASE = getApiUrl();

/**
 * Razorpay Service for frontend integration
 * Handles all Razorpay API calls and payment processing
 */
class RazorpayService {
  constructor() {
    this.apiBase = RAZORPAY_API_BASE;
  }

  /**
   * Create a Razorpay order
   * @param {Object} orderData - Order details
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Order creation response
   */
  async createOrder(orderData, token) {
    try {
      const response = await fetch(
        `${this.apiBase}/api/payments/razorpay/create-order`,
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
          message: data.message || 'Failed to create order',
          error: data || 'Unknown error'
        };
      }

      return {
        success: true,
        data: data.data || data,
        key_id: data.data?.key_id || data.key_id,
        message: data.message || 'Order created successfully',
      };
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      return {
        success: false,
        message: 'Failed to create order',
        error: error.message
      };
    }
  }

  /**
   * Verify payment signature
   * @param {Object} paymentData - Payment verification data
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Verification response
   */
  async verifyPayment(paymentData, token) {
    try {
      const response = await fetch(
        `${this.apiBase}/api/payments/razorpay/verify`,
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
   * Load Razorpay SDK dynamically
   * @returns {Promise<void>}
   */
  loadRazorpaySDK() {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined') {
        if (window.Razorpay) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
        document.body.appendChild(script);
      } else {
        reject(new Error('Window object not available'));
      }
    });
  }

  /**
   * Initialize Razorpay payment
   * @param {Object} options - Razorpay options
   * @returns {Promise<Object>} Razorpay instance
   */
  initializeRazorpay(options) {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        const rzp = new window.Razorpay(options);
        resolve(rzp);
      } else {
        reject(new Error('Razorpay SDK not loaded'));
      }
    });
  }

  /**
   * Format amount for Razorpay (convert to paise)
   * @param {number} amount - Amount in rupees
   * @returns {number} Amount in paise
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

    if (!paymentData.razorpay_order_id) {
      errors.push('Order ID is required');
    }

    if (!paymentData.razorpay_payment_id) {
      errors.push('Payment ID is required');
    }

    if (!paymentData.razorpay_signature) {
      errors.push('Signature is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Create and export a singleton instance
const razorpayService = new RazorpayService();
export default razorpayService;


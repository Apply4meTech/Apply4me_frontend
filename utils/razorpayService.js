import axios from 'axios';

const RAZORPAY_API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

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
      const response = await axios.post(
        `${this.apiBase}/api/payments/razorpay/create-order`,
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        data: response.data.data || response.data,
        key_id: response.data.data?.key_id || response.data.key_id,
        message: response.data.message || 'Order created successfully',
      };
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create order',
        error: error.response?.data || error.message
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
      const response = await axios.post(
        `${this.apiBase}/api/payments/razorpay/verify`,
        paymentData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        data: response.data.data,
        message: 'Payment verified successfully',
        redirect_url: response.data.redirect_url
      };
    } catch (error) {
      console.error('Error verifying payment:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Payment verification failed',
        error: error.response?.data || error.message
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


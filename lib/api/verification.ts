import apiClient from './axios';

export interface SendVerificationCodeRequest {
  type: 'email' | 'mobile';
  contact: string; // email address or mobile number
}

export interface VerifyCodeRequest {
  type: 'email' | 'mobile';
  contact: string;
  code: string;
}

export interface VerificationResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const verificationService = {
  /**
   * Send verification code to email or mobile
   */
  sendVerificationCode: async (request: SendVerificationCodeRequest): Promise<VerificationResponse> => {
    try {
      const response = await apiClient.post('/verification/send-code', request);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send verification code');
    }
  },

  /**
   * Verify the code sent to email or mobile
   */
  verifyCode: async (request: VerifyCodeRequest): Promise<VerificationResponse> => {
    try {
      const response = await apiClient.post('/verification/verify-code', request);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to verify code');
    }
  },

  /**
   * Resend verification code
   */
  resendVerificationCode: async (request: SendVerificationCodeRequest): Promise<VerificationResponse> => {
    try {
      const response = await apiClient.post('/verification/resend-code', request);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to resend verification code');
    }
  },

  /**
   * Update email address
   */
  updateEmail: async (newEmail: string): Promise<VerificationResponse> => {
    try {
      const response = await apiClient.put('/user/email', { email: newEmail });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update email');
    }
  },

  /**
   * Update mobile number
   */
  updateMobile: async (newMobile: string): Promise<VerificationResponse> => {
    try {
      const response = await apiClient.put('/user/mobile', { mobile: newMobile });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update mobile');
    }
  },

  /**
   * Get verification status
   */
  getVerificationStatus: async (): Promise<{
    emailVerified: boolean;
    mobileVerified: boolean;
    email?: string;
    mobile?: string;
  }> => {
    try {
      const response = await apiClient.get('/verification/status');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get verification status');
    }
  }
};

export default verificationService;
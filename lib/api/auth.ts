import { api } from "./axios";

export interface VerificationResponse {
  success: boolean;
  message: string;
  error?: string;
  lead?: {
    id: number;
    name: string;
    email: string;
  };
}

export const authApi = {
  verifyEmail: async (token: string): Promise<VerificationResponse> => {
    const response = await api.get(`/api/auth/verify-email?token=${token}`);
    return response.data;
  },
};

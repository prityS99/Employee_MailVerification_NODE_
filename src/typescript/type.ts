import api from "@/lib/axios";

export type UserRole = 'ADMIN' | 'EMPLOYEE' ;

interface ChangePasswordRequest {
  newPassword?: string;
  employeeId?: string;
}

interface ChangePasswordResponse {
  success: boolean;
  message: string;
  emailSentTo?: string;
}

export const changePassword = async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
  const response = await api.post("/api/employee/change-password", data);
  return response.data;
};



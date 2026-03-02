import { AxiosError } from 'axios';

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      return 'Unable to connect to server. Please check your connection.';
    }
    
    if (error.response?.status === 401) {
      return 'Unauthorized. Please log in again.';
    }
    
    if (error.response?.status === 403) {
      return 'You do not have permission to perform this action.';
    }
    
    if (error.response?.status === 404) {
      return 'Resource not found.';
    }
    
    if (error.response?.status === 500) {
      return 'Server error. Please try again later.';
    }
    
    return error.message || 'An unexpected error occurred';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

export const handleApiError = (error: unknown, fallbackMessage?: string): string => {
  const message = getErrorMessage(error);
  return fallbackMessage || message;
};

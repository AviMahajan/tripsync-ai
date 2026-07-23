import { mockTripResponse } from './mockData';

export const geminiService = {
  generateTripPlan: async (data: any) => {
    await new Promise((resolve) => setTimeout(resolve, 8000)); // Simulate AI processing
    return mockTripResponse;
  }
};

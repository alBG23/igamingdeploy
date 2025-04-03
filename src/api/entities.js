// Mock entities
const mockEntity = {
  get: async () => ({ data: [] }),
  create: async (data) => ({ success: true, data }),
  update: async (data) => ({ success: true, data }),
  delete: async (id) => ({ success: true })
};

export const MetricsData = mockEntity;
export const AnomalyAlert = mockEntity;
export const ChurnPrediction = mockEntity;
export const PlatformIntegration = mockEntity;
export const AffiliateProgram = mockEntity;
export const CohortData = mockEntity;
export const UserRole = mockEntity;
export const License = mockEntity;
export const UserSession = mockEntity;
export const AlertConfig = mockEntity;
export const AlertHistory = mockEntity;
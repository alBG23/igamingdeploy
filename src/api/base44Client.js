// Stub Base44 client for Vercel deployment without Base44 auth

export const base44 = {
  user: {
    getCurrentUser: async () => ({
      id: "demo_user",
      email: "demo@example.com",
      name: "Demo User"
    })
  },
  metricsData: {
    getMetrics: async () => [
      { date: "2024-01-15", ggr: 1000, ngr: 850 },
      { date: "2024-01-16", ggr: 1200, ngr: 900 },
    ]
  }
};

// Stub Base44 client with no authentication
export const base44Client = {
  get: async (url) => {
    console.log(`[STUB GET] ${url}`);
    return { data: null };
  },
  post: async (url, data) => {
    console.log(`[STUB POST] ${url}`, data);
    return { data: null };
  },
  put: async (url, data) => {
    console.log(`[STUB PUT] ${url}`, data);
    return { data: null };
  },
  delete: async (url) => {
    console.log(`[STUB DELETE] ${url}`);
    return { data: null };
  },
};

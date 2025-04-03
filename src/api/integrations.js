// Mock integrations
export const Core = {
  SendEmail: async () => {
    return { success: true };
  },
  InvokeLLM: async () => {
    return { success: true, response: "Mock AI response" };
  },
  SendSMS: async () => {
    return { success: true };
  },
  UploadFile: async () => {
    return { success: true, url: "mock-url" };
  },
  GenerateImage: async () => {
    return { success: true, url: "mock-image-url" };
  },
  ExtractDataFromUploadedFile: async () => {
    return { success: true, data: [] };
  }
};

export const SendEmail = Core.SendEmail;
export const InvokeLLM = Core.InvokeLLM;
export const SendSMS = Core.SendSMS;
export const UploadFile = Core.UploadFile;
export const GenerateImage = Core.GenerateImage;
export const ExtractDataFromUploadedFile = Core.ExtractDataFromUploadedFile;







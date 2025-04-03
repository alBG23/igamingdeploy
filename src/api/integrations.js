// Mock integrations
export const Core = {
  SendEmail: async () => {
    return { success: true };
  }
};

export const SendEmail = Core.SendEmail;

export const InvokeLLM = base44.integrations.Core.InvokeLLM;

export const SendSMS = base44.integrations.Core.SendSMS;

export const UploadFile = base44.integrations.Core.UploadFile;

export const GenerateImage = base44.integrations.Core.GenerateImage;

export const ExtractDataFromUploadedFile = base44.integrations.Core.ExtractDataFromUploadedFile;







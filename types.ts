
export type Language = 'EN' | 'ZH';

export interface Translations {
  title: string;
  subtitle: string;
  community: string;
  uploadTitle: string;
  uploadDesc: string;
  clickToSelect: string;
  resultTitle: string;
  resultDesc: string;
  resultPlaceholder: string;
  transformButton: string;
  transforming: string;
  errorUpload: string;
  errorTransform: string;
}

export const translations: Record<Language, Translations> = {
  EN: {
    title: "PLUSHIFY",
    subtitle: "Transform any character into a plush toy.",
    community: "Community",
    uploadTitle: "Upload Character",
    uploadDesc: "Pick a photo to transform.",
    clickToSelect: "CLICK TO SELECT PHOTO",
    resultTitle: "Result",
    resultDesc: "Your collectible is ready.",
    resultPlaceholder: "YOUR COLLECTIBLE IS READY.",
    transformButton: "Transform to Plush",
    transforming: "Stitching your plush...",
    errorUpload: "Please upload an image first.",
    errorTransform: "Failed to transform. Please try again."
  },
  ZH: {
    title: "PLUSHIFY",
    subtitle: "将任何角色转化为毛绒玩具。",
    community: "社区",
    uploadTitle: "上传角色",
    uploadDesc: "选择一张照片进行转化。",
    clickToSelect: "点击选择照片",
    resultTitle: "结果",
    resultDesc: "您的收藏品已准备好。",
    resultPlaceholder: "您的收藏品已准备就绪。",
    transformButton: "转化为毛绒玩具",
    transforming: "正在缝制您的毛绒玩具...",
    errorUpload: "请先上传图片。",
    errorTransform: "转换失败。请重试。"
  }
};

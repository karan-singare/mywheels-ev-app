// Navigation param list types for React Navigation v7
// Define the param lists for each navigator

export type AuthStackParamList = {
  Landing: undefined;
  Login: undefined;
  Signup: undefined;
  AdminLogin: undefined;
};

export type RiderTabParamList = {
  Home: undefined;
  Plans: undefined;
  Support: undefined;
  Settings: undefined;
};

export type AdminTabParamList = {
  Dashboard: undefined;
  KYCReview: undefined;
  Inventory: undefined;
  Settings: undefined;
};

export type RiderStackParamList = {
  RiderTabs: undefined;
  Payment: { planId: string };
  PaymentHistory: undefined;
  Onboarding: undefined;
  KYC: undefined;
  Profile: undefined;
  ImageViewer: { imageUrls: string[]; initialIndex: number };
};

export type AdminStackParamList = {
  AdminTabs: undefined;
  RejectKYC: { riderId: string; riderName: string };
  ImageViewer: { imageUrls: string[]; initialIndex: number };
};

export type RootStackParamList = {
  Auth: undefined;
  Rider: undefined;
  Admin: undefined;
};

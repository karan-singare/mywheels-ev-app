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
  Profile: undefined;
  Support: undefined;
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
  Onboarding: undefined;
  KYC: undefined;
};

export type AdminStackParamList = {
  AdminTabs: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Rider: undefined;
  Admin: undefined;
};

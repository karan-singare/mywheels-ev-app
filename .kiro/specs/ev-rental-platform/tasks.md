# Implementation Plan: MyWheels EV Rental Platform

## Overview

Incremental implementation of the MyWheels EV React Native app across 4 phases, following the design's directory structure and file naming conventions. Each task builds on previous tasks. All code uses TypeScript with NativeWind v5, Gluestack UI v5, Redux Toolkit, and Supabase.

## Tasks

- [x] 1. Project foundation — config, types, enums, store, and navigation shell
  - [x] 1.1 Create brand theme and config files
    - Create `src/config/theme.constant.ts` with the full color palette and typography tokens from the design
    - Create `src/config/supabase.constant.ts` with Supabase client initialization (using env vars for URL and anon key)
    - Create `src/config/gluestack-ui.config.ts` with the Gluestack UI theme configuration mapping brand tokens
    - Update `global.css` with the NativeWind v5 / Tailwind CSS v4 `@theme` block containing all brand color and font-family custom properties
    - _Requirements: 1.12_

  - [x] 1.2 Create all enum definitions
    - Create `src/enums/kyc-status.enum.ts`, `src/enums/vehicle-status.enum.ts`, `src/enums/rental-status.enum.ts`, `src/enums/payment-status.enum.ts`, `src/enums/payment-method.enum.ts`, `src/enums/plan-type.enum.ts`, `src/enums/user-role.enum.ts`, `src/enums/onboarding-step.enum.ts`, `src/enums/gender.enum.ts`
    - Each file exports a TypeScript union type as defined in the design's Data Models section
    - _Requirements: 14.1_

  - [x] 1.3 Create all type definitions
    - Create `src/types/rider.type.ts`, `src/types/kyc.type.ts`, `src/types/vehicle.type.ts`, `src/types/rental.type.ts`, `src/types/payment.type.ts`, `src/types/navigation.type.ts`
    - Each file defines interfaces matching the design's Data Models section, importing enums from `src/enums/`
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

  - [x] 1.4 Create utility functions
    - Create `src/utils/validators.util.ts` with validation functions: `isValidIndianPhone(phone: string)`, `isMinAge(dob: string, minAge: number)`, `isNonEmpty(value: string)`, `isValidFileSize(sizeBytes: number, maxMB: number)`, `isValidImageType(mimeType: string)`
    - Create `src/utils/formatters.util.ts` with formatting helpers: `formatCurrency(amount: number)`, `formatDate(isoDate: string)`, `daysRemaining(endDate: string)`
    - Create `src/utils/deeplink.util.ts` with deep link helpers for GPS and battery apps
    - _Requirements: 4.2, 6.2, 9.1, 10.1, 11.1_

  - [ ]* 1.5 Write property tests for validators (Properties 3, 7)
    - **Property 3: Onboarding field validation rejects invalid inputs** — test that `isValidIndianPhone`, `isMinAge`, `isNonEmpty` reject all invalid inputs using fast-check generators
    - **Validates: Requirements 4.2**
    - **Property 7: Document file validation** — test that `isValidFileSize` and `isValidImageType` reject invalid files
    - **Validates: Requirements 6.2**

  - [x] 1.6 Set up Redux store with MMKV persistence
    - Create `src/store/middleware/mmkv-persistence.middleware.ts` with the persistence middleware and `getPersistedState` rehydration helper
    - Create `src/store/slices/auth.slice.ts` with `AuthState` interface and reducers for signUp/signIn/signOut/restoreSession thunk lifecycle
    - Create `src/store/slices/rider.slice.ts` with `RiderState` interface and reducers for profile thunk lifecycle
    - Create `src/store/slices/kyc.slice.ts` with `KYCState` interface and reducers for KYC thunk lifecycle
    - Create `src/store/slices/rentals.slice.ts` with `RentalsState` interface and reducers for rental thunk lifecycle
    - Create `src/store/slices/vehicles.slice.ts` with `VehiclesState` interface and reducers for vehicle thunk lifecycle
    - Create `src/store/slices/payments.slice.ts` with `PaymentsState` interface and reducers for payment thunk lifecycle
    - Create `src/store/index.ts` with `configureStore`, root reducer combining all slices, typed hooks (`useAppDispatch`, `useAppSelector`), and MMKV middleware
    - _Requirements: 2.7, 15.2_

  - [x] 1.7 Create service layer stubs
    - Create `src/services/auth.service.ts` with Supabase auth methods: `signUpWithPhone`, `signInWithPhone`, `signInWithEmail`, `signOut`, `getSession`, `onAuthStateChange`, `refreshSession`
    - Create `src/services/rider.service.ts` with `createProfile`, `getProfile`, `updateProfile`, `getOnboardingProgress`
    - Create `src/services/storage.service.ts` with `uploadImage`, `getSignedUrl`, `deleteFile` wrapping Supabase Storage
    - Create `src/services/kyc.service.ts`, `src/services/rental.service.ts`, `src/services/vehicle.service.ts`, `src/services/payment.service.ts` as stubs matching the design interfaces
    - _Requirements: 2.3, 2.4, 14.1, 14.2, 14.3, 14.4_

  - [x] 1.8 Create async thunks
    - Create `src/store/thunks/auth.thunk.ts` with `signIn`, `signUp`, `adminSignIn`, `signOut`, `restoreSession` thunks calling auth.service
    - Create `src/store/thunks/rider.thunk.ts` with `fetchProfile`, `createProfile`, `updateProfile` thunks
    - Create `src/store/thunks/kyc.thunk.ts`, `src/store/thunks/rentals.thunk.ts`, `src/store/thunks/vehicles.thunk.ts`, `src/store/thunks/payments.thunk.ts` thunks
    - _Requirements: 2.3, 2.4, 2.7_

  - [x] 1.9 Create custom hooks
    - Create `src/hooks/use-auth.hook.ts`, `src/hooks/use-rider.hook.ts`, `src/hooks/use-kyc.hook.ts`, `src/hooks/use-rentals.hook.ts`, `src/hooks/use-vehicles.hook.ts`, `src/hooks/use-payments.hook.ts`
    - Each hook is a thin wrapper around `useAppSelector` and `useAppDispatch` as defined in the design
    - _Requirements: 2.7, 15.2_

  - [x] 1.10 Create navigation shell
    - Create `src/navigation/auth-stack.component.tsx` with screens: Landing, Login, Signup, AdminLogin
    - Create `src/navigation/rider-tabs.component.tsx` with bottom tabs: Home, Plans, Profile, Support (using lucide-react-native icons)
    - Create `src/navigation/admin-tabs.component.tsx` with bottom tabs: Dashboard, KYC Review, Inventory, Settings
    - Create `src/navigation/root-navigator.component.tsx` with conditional routing based on auth state and user role
    - _Requirements: 15.1, 15.2, 15.3, 15.4_

  - [ ]* 1.11 Write property test for role-based navigation routing (Property 2)
    - **Property 2: Role-based navigation routing** — for any auth state (unauthenticated, rider, admin), verify the root navigator renders the correct navigator
    - **Validates: Requirements 3.4, 3.5, 15.1**

  - [x] 1.12 Create root app component
    - Create `src/app/app.component.tsx` wrapping the app in `<Provider store={store}>`, `<GluestackUIProvider>`, `<NavigationContainer>`, and `<RootNavigator />`
    - Update `index.js` to import from `src/app/app.component.tsx`
    - _Requirements: 15.1, 15.2_

- [x] 2. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Phase 1 — Landing screen and authentication
  - [x] 3.1 Create landing page constants and section components
    - Create `src/constants/landing-data.constant.ts` with all static content: hero text, trust brands, about features, why-electric stats, how-it-works steps, earnings comparison data, testimonials, FAQ items, contact info
    - Create `src/components/shared/section-wrapper.component.tsx` with `SectionWrapperProps` (title, subtitle, variant, children)
    - Create `src/components/shared/floating-whatsapp.component.tsx` linking to `wa.me/919121969734`
    - Create `src/components/shared/loading-spinner.component.tsx`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 1.12, 1.13_

  - [x] 3.2 Create landing section components
    - Create `src/components/landing/hero-section.component.tsx` with headline, subtitle, CTA buttons (View Plans, Contact Us)
    - Create `src/components/landing/trust-section.component.tsx` with delivery platform brand name pills
    - Create `src/components/landing/about-section.component.tsx` with 3 feature cards (horizontal scroll on mobile)
    - Create `src/components/landing/why-electric-section.component.tsx` with savings highlight card and benefit bullets
    - Create `src/components/landing/how-it-works-section.component.tsx` with 5-step horizontal stepper
    - Create `src/components/landing/earnings-comparison-section.component.tsx` with fuel vs EV side-by-side cards
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [x] 3.3 Create remaining landing section components
    - Create `src/components/shared/pricing-card.component.tsx` with `PricingCardProps` (reusable across landing and plans screen)
    - Create `src/components/landing/pricing-section.component.tsx` rendering 3 plan cards with monthly featured
    - Create `src/components/landing/testimonials-section.component.tsx` with rider review cards
    - Create `src/components/landing/faq-section.component.tsx` with expandable accordion using Gluestack UI Accordion
    - Create `src/components/landing/contact-section.component.tsx` with address, phone, email cards
    - Create `src/components/landing/cta-strip-section.component.tsx` with final CTA and gradient background
    - _Requirements: 1.7, 1.8, 1.9, 1.10, 1.14_

  - [x] 3.4 Create landing screen
    - Create `src/screens/landing/landing.screen.tsx` composing all section components in a ScrollView with sticky nav bar, floating WhatsApp button, and "Get Started" CTA navigating to signup
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 1.11, 1.12, 1.13, 1.14_

  - [x] 3.5 Create auth form components and screens
    - Create `src/components/forms/phone-input.component.tsx` with +91 prefix, 10-digit validation, numeric keyboard
    - Create `src/screens/auth/signup.screen.tsx` collecting phone number and password, calling `useAuth().signUp`, navigating to onboarding on success
    - Create `src/screens/auth/login.screen.tsx` accepting phone and password, calling `useAuth().signIn`, navigating to dashboard on success, showing error on failure
    - Create `src/screens/auth/admin-login.screen.tsx` accepting email and password, calling `useAuth().adminSignIn`, verifying admin role before granting access
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 3.4_

  - [ ]* 3.6 Write property test for invalid credentials (Property 1)
    - **Property 1: Invalid credentials always produce an error** — for any invalid phone/password or email/password combination, auth service returns error and no session is created
    - **Validates: Requirements 2.5, 3.3**

  - [x] 3.7 Implement session persistence and token refresh
    - Wire `restoreSession` thunk in `root-navigator.component.tsx` to check for existing Supabase session on app launch
    - Implement `onAuthStateChange` listener in the auth thunk to dispatch session updates
    - Implement silent token refresh in `auth.service.ts` via `refreshSession()`, falling back to login on failure
    - Implement logout clearing local MMKV state and navigating to landing screen
    - _Requirements: 2.7, 2.8, 15.2, 15.5_

- [x] 4. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Phase 2 — Rider onboarding, KYC, and document upload
  - [x] 5.1 Implement onboarding screen
    - Create `src/screens/onboarding/onboarding.screen.tsx` with multi-step form: step 1 (full name, DOB, gender), step 2 (address, city defaulting to Hyderabad), step 3 (emergency contact)
    - Implement field validation using `validators.util.ts` — prevent progression on invalid input with field-level error messages
    - Implement progress indicator showing current step and total steps
    - Implement back navigation between steps to edit previous entries
    - On completion, dispatch `createProfile` thunk to store data in Supabase `riders` table and update `onboarding_step` to `completed`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 5.2 Implement onboarding resume from last step
    - On app reopen, dispatch `fetchProfile` thunk and read `onboarding_step` from rider profile
    - If `onboarding_step` is not `completed`, navigate to onboarding screen and resume from the next incomplete step
    - Persist partial onboarding data in Redux (MMKV-backed) so form fields are pre-filled on resume
    - _Requirements: 4.6_

  - [ ]* 5.3 Write property test for onboarding resume (Property 4)
    - **Property 4: Onboarding resumes from last completed step** — for any completed step persisted in state, reopening resumes from the next step
    - **Validates: Requirements 4.6**

  - [x] 5.4 Implement KYC screen and document uploader
    - Create `src/components/forms/document-picker.component.tsx` with camera/gallery action sheet, preview thumbnail, and remove action
    - Create `src/screens/kyc/document-uploader.component.tsx` rendering 4 document picker slots (Aadhaar, driving license, photo, address proof) with upload status per document
    - Create `src/screens/kyc/kyc.screen.tsx` displaying KYC status, document checklist, and "Submit for Review" button
    - Implement file validation: JPEG/PNG only, max 10 MB, using `validators.util.ts`
    - Implement upload via `kyc.service.ts` → `storage.service.ts` → Supabase Storage, storing file reference in `kyc_documents` table
    - Implement retry on upload failure with error message per document card
    - Enable "Submit for Review" only when all 4 documents are uploaded; on submit, update KYC status to `under_review`
    - _Requirements: 5.1, 5.2, 5.3, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

  - [ ]* 5.5 Write property tests for KYC (Properties 5, 6, 8)
    - **Property 5: KYC status display accuracy** — for any KYC status value, the correct human-readable string is displayed
    - **Validates: Requirements 5.2**
    - **Property 6: Plan access gated by KYC approval** — for any non-approved KYC status, plan selector is inaccessible
    - **Validates: Requirements 5.6**
    - **Property 8: Document checklist and submit enablement** — for any subset of uploaded documents, checklist is accurate and submit is enabled iff all 4 are uploaded
    - **Validates: Requirements 6.6, 6.7**

  - [x] 5.6 Wire KYC status gating for plan access
    - In the rider tab navigator or plans screen, check KYC status from Redux state
    - If KYC status is not `approved`, display a message "KYC approval is required to view plans" and block access to the plan selector
    - _Requirements: 5.6_

- [x] 6. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Phase 3 — Rental plans, payment, and rider dashboard
  - [x] 7.1 Implement plans screen
    - Create `src/constants/plans.constant.ts` with the 3 rental plan definitions (Daily ₹249, Weekly ₹1,499, Monthly ₹4,999) matching seed data
    - Create `src/screens/rider/plans.screen.tsx` displaying 3 plan cards using `pricing-card.component.tsx`, with Monthly highlighted as featured with "Best for Full-Time Riders" tag
    - Include note: "Contact us for exact rates based on your usage and vehicle preference"
    - On plan selection, navigate to payment screen with selected plan details
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 7.2 Implement payment screen
    - Create `src/screens/rider/payment.screen.tsx` displaying order summary (plan name, price, rental period)
    - Implement payment method selection: UPI, debit card, credit card, net banking
    - Implement payment gateway integration stub (initiatePayment → confirmPayment flow)
    - On success: record transaction via `payments.thunk.ts`, update rental status to active, navigate to dashboard
    - On failure: display error with reason, offer retry and change payment method options
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ]* 7.3 Write property test for payment order summary (Property 9)
    - **Property 9: Payment order summary matches selected plan** — for any selected plan, the payment screen displays the exact plan name, price, and period
    - **Validates: Requirements 8.1**

  - [x] 7.4 Implement rider dashboard screen
    - Create `src/screens/rider/dashboard.screen.tsx` displaying:
      - Active rental info: plan name, start date, end date, days remaining (computed via `formatters.util.ts`)
      - Assigned vehicle details: model, registration number, vehicle ID
      - Quick action buttons: Renew Plan, Contact Support, View Payment History
      - KYC status and profile completion percentage
      - Renewal reminder when rental is within 3 days of expiry
      - Prompt to select a plan if no active rental exists
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

  - [ ]* 7.5 Write property tests for dashboard (Properties 11, 14)
    - **Property 11: Dashboard days remaining computation** — for any active rental with start/end dates, days remaining equals `end_date - today` and is never negative
    - **Validates: Requirements 9.1**
    - **Property 14: Renewal reminder threshold** — for any active rental, reminder shows iff end date is within 3 days
    - **Validates: Requirements 9.5**

  - [x] 7.6 Implement payment receipt and history
    - Implement `getReceipt` in `payment.service.ts` returning `PaymentReceipt` with all transaction details
    - Add payment history view accessible from dashboard quick actions, listing past payments via `fetchHistory` thunk
    - _Requirements: 8.6, 9.3_

  - [ ]* 7.7 Write property test for payment round-trip (Property 10)
    - **Property 10: Payment and receipt round-trip** — for any successful payment, the stored record and retrieved receipt contain matching rider ID, plan ID, amount, method, and timestamp
    - **Validates: Requirements 8.3, 8.6**

  - [x] 7.8 Implement profile and support screens
    - Create `src/screens/rider/profile.screen.tsx` displaying rider profile info, KYC status, with navigation to onboarding edit and KYC screen
    - Create `src/screens/rider/support.screen.tsx` with contact info (phone, email, WhatsApp link) and FAQ
    - _Requirements: 9.3, 9.4_

- [x] 8. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Phase 4 — GPS tracking, battery monitoring, inventory, and admin
  - [x] 9.1 Implement GPS tracking integration
    - Implement `deeplink.util.ts` functions for opening the external GPS tracking app with vehicle pre-selected
    - Add "Track My Vehicle" action on rider dashboard that opens the GPS app via deep link
    - Handle case where GPS app is not installed: display message with install link
    - Display last known GPS coordinates and timestamp on admin vehicle detail view
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [x] 9.2 Implement battery monitoring integration
    - Implement deep link to external Bluetooth battery monitoring app in `deeplink.util.ts`
    - Display battery percentage on rider dashboard when data is available
    - Display battery percentage and battery number on admin vehicle detail view
    - Handle unavailable battery data: show "Battery data unavailable — connect via Bluetooth app" with link
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

  - [x] 9.3 Implement inventory management screen
    - Create `src/screens/admin/inventory.screen.tsx` displaying vehicle list with columns: vehicle ID, model, registration number, status, assigned rider, battery number
    - Implement add vehicle form storing record in Supabase with status defaulting to `available`
    - Implement assign vehicle to rider (status → `rented`, link rider)
    - Implement mark vehicle for maintenance (status → `maintenance`, record reason)
    - Implement status filters: All, Available, Rented, Maintenance
    - Display summary count of vehicles per status category
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

  - [ ]* 9.4 Write property tests for inventory (Properties 15, 16)
    - **Property 15: Vehicle status transitions** — for any vehicle, adding sets status to `available`, assigning sets to `rented` with rider linked, maintenance sets to `maintenance` with reason
    - **Validates: Requirements 12.2, 12.3, 12.4**
    - **Property 16: Vehicle inventory filtering and counts** — for any set of vehicles with mixed statuses, filtering returns correct subset and counts match
    - **Validates: Requirements 12.5, 12.6**

  - [x] 9.5 Implement admin dashboard screen
    - Create `src/screens/admin/admin-dashboard.screen.tsx` with summary cards: total riders, active rentals, available vehicles, maintenance vehicles, pending KYC reviews
    - Implement navigation to: KYC review queue, inventory, rider list, payment history
    - Display recent activity: latest signups, recent payments, recent KYC changes
    - _Requirements: 13.1, 13.2, 13.4_

  - [x] 9.6 Implement KYC review screen
    - Create `src/screens/admin/kyc-review.screen.tsx` displaying list of riders with `under_review` KYC status
    - Implement approve action: update KYC status to `approved`, notify rider
    - Implement reject action: update KYC status to `rejected` with reason, allow rider resubmission
    - _Requirements: 5.4, 5.5, 13.3_

  - [ ]* 9.7 Write property tests for admin (Properties 17, 18)
    - **Property 17: Admin summary card accuracy** — for any database state, summary card counts match actual table counts
    - **Validates: Requirements 13.1**
    - **Property 18: KYC review queue correctness** — the queue contains exactly riders with `under_review` status
    - **Validates: Requirements 13.3**

  - [x] 9.8 Implement admin settings screen
    - Create `src/screens/admin/settings.screen.tsx` with admin profile info and logout action
    - _Requirements: 3.1_

  - [x] 9.9 Implement Supabase RLS policies and database schema
    - Create `src/config/supabase-schema.sql` with the complete database schema from the design (tables, indexes, constraints)
    - Create `src/config/supabase-rls.sql` with all RLS policies from the design (rider self-access, admin full access)
    - Create `src/config/supabase-seed.sql` with rental plan seed data
    - Document Supabase Storage bucket setup for `kyc-documents` (private, signed URLs, 10 MB limit, JPEG/PNG only)
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

  - [ ]* 9.10 Write property tests for data storage and RLS (Properties 19, 20)
    - **Property 19: Domain object storage round-trip** — for any valid domain object, storing and retrieving preserves all fields
    - **Validates: Requirements 14.1, 14.2, 14.3, 14.4**
    - **Property 20: Row Level Security enforcement** — rider queries return only own data, admin queries return all data
    - **Validates: Requirements 14.5, 14.6**

  - [ ]* 9.11 Write property tests for dashboard display (Properties 12, 13)
    - **Property 12: Dashboard vehicle details display** — for any rider with assigned vehicle, dashboard shows correct model, registration, and vehicle ID
    - **Validates: Requirements 9.2**
    - **Property 13: Dashboard profile and KYC status display** — for any rider profile, dashboard shows correct KYC status and profile completion percentage
    - **Validates: Requirements 9.4**

- [x] 10. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation after each phase
- Property tests validate the 20 correctness properties from the design document using fast-check
- All file paths follow the design's lowercase hyphen-separated naming convention with type suffixes
- The Supabase SQL files are reference scripts to be run in the Supabase dashboard, not executed by the app

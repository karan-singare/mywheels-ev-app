# Requirements Document — MyWheels EV Rental Platform

## Introduction

MyWheels EV is a React Native mobile application for an electric two-wheeler rental platform operating in Hyderabad, India. The platform serves delivery partners (Swiggy, Zomato, Blinkit, Zepto, Amazon), daily commuters, and short/long-term rental users. The app provides rider onboarding, KYC verification, rental plan selection, payment processing, vehicle tracking, and inventory management. An existing website (SPA) defines the brand identity, content, and design language to be carried into the mobile experience.

Development follows a phased approach across four phases:
- **Phase 1**: Landing experience and authentication
- **Phase 2**: Rider onboarding, KYC, and document upload
- **Phase 3**: Rental plans, payment, and rider dashboard
- **Phase 4**: GPS tracking, battery monitoring, inventory management, and admin features

## Glossary

- **App**: The MyWheels EV React Native mobile application
- **Rider**: A registered user who rents electric two-wheelers
- **Admin**: A MyWheels EV staff member who manages riders, vehicles, and operations
- **Landing_Screen**: The initial screen displaying brand information, services, pricing, and CTAs
- **Auth_Module**: The authentication system handling login, signup, and session management via Supabase
- **Onboarding_Flow**: The multi-step rider registration process collecting personal and vehicle preference information
- **KYC_Module**: The Know Your Customer verification system for identity and document validation
- **Document_Uploader**: The component handling capture and upload of identity documents to Supabase Storage
- **Plan_Selector**: The interface for browsing and selecting rental plans (Daily, Weekly, Monthly)
- **Payment_Module**: The payment processing system for rental plan purchases
- **Rider_Dashboard**: The post-login home screen showing active rental, vehicle status, and quick actions
- **GPS_Tracker**: The module integrating with an external GPS tracking application
- **Battery_Monitor**: The module integrating with an external Bluetooth-enabled battery monitoring application
- **Inventory_Manager**: The admin module for managing vehicle fleet, availability, and assignments
- **Supabase_Backend**: The Supabase instance providing authentication, database (PostgreSQL), storage, and real-time capabilities
- **Navigation_Stack**: The React Navigation v7 stack managing screen transitions and deep linking
- **KYC_Document**: One of the required identity documents: Aadhaar card, driving license, passport-size photo, or address proof

---

## Phase 1: Landing Experience & Authentication

### Requirement 1: Landing Screen

**User Story:** As a prospective rider, I want to see an informative landing screen when I open the app, so that I can understand MyWheels EV services before signing up.

#### Acceptance Criteria

1. WHEN the App launches for an unauthenticated user, THE Landing_Screen SHALL display a hero section with the headline "We Power Hyderabad's Delivery Heroes", a subtitle describing the service, and CTA buttons for "View Plans" and "Contact Us"
2. THE Landing_Screen SHALL display a trust section showing delivery platform brand names (Swiggy, Zomato, Blinkit, Zepto, Amazon) with the label "Used by Delivery Partners Working With"
3. THE Landing_Screen SHALL display an about section with three feature cards: "High Uptime", "Cost Efficiency", and "Rapid Local Support"
4. THE Landing_Screen SHALL display a "Why Electric" section with a savings highlight card (₹500 daily savings, 100+ KM range) and four benefit bullet points
5. THE Landing_Screen SHALL display a "How It Works" section with five sequential steps: Register, KYC Verification, Choose Plan, Vehicle Allocation, Start Earning
6. THE Landing_Screen SHALL display an earnings comparison section contrasting fuel bike expenses (₹10,000–₹15,000/month) with MyWheels EV rental (₹4,999/month)
7. THE Landing_Screen SHALL display three pricing plan cards: Daily (₹249/day), Weekly (₹1,499/week), and Monthly (₹4,999/month, featured with "Best for Full-Time Riders" tag)
8. THE Landing_Screen SHALL display a testimonials section with rider reviews including name, location, and quote
9. THE Landing_Screen SHALL display an FAQ section with expandable accordion items covering license requirements, required documents, vehicle allocation time, maintenance inclusion, and breakdown support
10. THE Landing_Screen SHALL display a contact section with address (Plot no. 6, Sundarnagar, Hyderabad – 500038), phone (+91 91219 69734), and email (contactus@mywheelsev.com)
11. THE Landing_Screen SHALL display a sticky navigation bar with links to each section and the MyWheels EV logo
12. THE Landing_Screen SHALL apply the brand design system: primary color #184cba, green #84d06e, dark #141c6c, Manrope font family, and consistent spacing and border radius values
13. THE Landing_Screen SHALL include a floating WhatsApp button linking to wa.me/919121969734 with a pre-filled inquiry message
14. THE Landing_Screen SHALL include a "Get Started" or "Sign Up" CTA that navigates to the Auth_Module signup screen

### Requirement 2: Rider Authentication

**User Story:** As a rider, I want to sign up and log in to the app, so that I can access rental services securely.

#### Acceptance Criteria

1. THE Auth_Module SHALL provide a signup screen collecting phone number and password from the Rider
2. THE Auth_Module SHALL provide a login screen accepting phone number and password from the Rider
3. WHEN a Rider submits valid signup credentials, THE Auth_Module SHALL create a new user account in Supabase_Backend and navigate the Rider to the Onboarding_Flow
4. WHEN a Rider submits valid login credentials, THE Auth_Module SHALL authenticate the Rider via Supabase_Backend and navigate to the Rider_Dashboard
5. IF a Rider submits invalid credentials during login, THEN THE Auth_Module SHALL display an error message indicating incorrect phone number or password
6. IF a Rider attempts signup with a phone number already registered, THEN THE Auth_Module SHALL display an error message indicating the account already exists
7. THE Auth_Module SHALL persist the authentication session locally so the Rider remains logged in across app restarts
8. WHEN a Rider taps the logout action, THE Auth_Module SHALL clear the local session and navigate to the Landing_Screen

### Requirement 3: Admin Authentication

**User Story:** As an admin, I want to log in to the app with admin credentials, so that I can access administrative features.

#### Acceptance Criteria

1. THE Auth_Module SHALL provide a separate admin login screen accepting email and password
2. WHEN an Admin submits valid credentials, THE Auth_Module SHALL authenticate the Admin via Supabase_Backend and navigate to the admin dashboard
3. IF an Admin submits invalid credentials, THEN THE Auth_Module SHALL display an error message indicating incorrect email or password
4. THE Auth_Module SHALL verify the Admin role from Supabase_Backend before granting access to admin features
5. THE Navigation_Stack SHALL route authenticated users to either the Rider_Dashboard or admin dashboard based on the user role stored in Supabase_Backend

---

## Phase 2: Rider Onboarding, KYC & Document Upload

### Requirement 4: Rider Onboarding Flow

**User Story:** As a new rider, I want to complete an onboarding process after signup, so that MyWheels EV has the information needed to serve me.

#### Acceptance Criteria

1. WHEN a Rider completes signup, THE Onboarding_Flow SHALL present a multi-step form collecting: full name, date of birth, gender, current address, city (defaulting to Hyderabad), and emergency contact number
2. THE Onboarding_Flow SHALL validate each field before allowing the Rider to proceed to the next step: full name is non-empty, date of birth yields age 18 or older, phone numbers are valid 10-digit Indian mobile numbers, and address is non-empty
3. WHEN the Rider completes all onboarding steps, THE Onboarding_Flow SHALL store the collected information in the Supabase_Backend riders table
4. THE Onboarding_Flow SHALL display a progress indicator showing the current step and total number of steps
5. THE Onboarding_Flow SHALL allow the Rider to navigate back to previous steps to edit entered information
6. IF the Rider closes the App during onboarding, THEN THE Onboarding_Flow SHALL resume from the last completed step when the Rider reopens the App

### Requirement 5: KYC Verification

**User Story:** As a rider, I want to complete KYC verification, so that I can be approved to rent a vehicle.

#### Acceptance Criteria

1. WHEN the Rider completes onboarding, THE KYC_Module SHALL present the KYC verification flow requiring four documents: Aadhaar card, driving license, passport-size photo, and address proof
2. THE KYC_Module SHALL display the current KYC status to the Rider as one of: "Not Started", "In Progress", "Under Review", "Approved", or "Rejected"
3. WHEN the Rider submits all four KYC_Documents, THE KYC_Module SHALL update the KYC status to "Under Review" in Supabase_Backend
4. WHEN an Admin approves the KYC submission, THE KYC_Module SHALL update the status to "Approved" and notify the Rider
5. IF an Admin rejects the KYC submission, THEN THE KYC_Module SHALL update the status to "Rejected", include the rejection reason, and allow the Rider to resubmit documents
6. WHILE the KYC status is not "Approved", THE Plan_Selector SHALL remain inaccessible to the Rider with a message indicating KYC approval is required

### Requirement 6: Document Upload

**User Story:** As a rider, I want to upload my identity documents, so that I can complete KYC verification.

#### Acceptance Criteria

1. THE Document_Uploader SHALL allow the Rider to capture a document photo using the device camera or select an existing image from the device gallery
2. THE Document_Uploader SHALL accept images in JPEG and PNG formats with a maximum file size of 10 MB per document
3. WHEN the Rider selects or captures a document image, THE Document_Uploader SHALL display a preview of the image before upload
4. WHEN the Rider confirms the upload, THE Document_Uploader SHALL upload the image to Supabase_Backend Storage and store the file reference in the rider's KYC record
5. IF the upload fails due to network error, THEN THE Document_Uploader SHALL display an error message and allow the Rider to retry the upload
6. THE Document_Uploader SHALL display a checklist showing which of the four required KYC_Documents have been uploaded and which are pending
7. WHEN all four KYC_Documents are uploaded, THE Document_Uploader SHALL enable the "Submit for Review" action

---

## Phase 3: Rental Plans, Payment & Rider Dashboard

### Requirement 7: Rental Plan Selection

**User Story:** As an approved rider, I want to browse and select a rental plan, so that I can rent an electric two-wheeler.

#### Acceptance Criteria

1. WHEN a Rider with "Approved" KYC status navigates to the Plan_Selector, THE Plan_Selector SHALL display three rental plans: Daily (₹249/day), Weekly (₹1,499/week), and Monthly (₹4,999/month)
2. THE Plan_Selector SHALL highlight the Monthly plan as the featured/recommended option with a "Best for Full-Time Riders" tag
3. THE Plan_Selector SHALL display the features list for each plan matching the content defined in the Landing_Screen pricing section
4. WHEN the Rider selects a plan, THE Plan_Selector SHALL navigate to the Payment_Module with the selected plan details
5. THE Plan_Selector SHALL display a note: "Contact us for exact rates based on your usage and vehicle preference"

### Requirement 8: Payment Processing

**User Story:** As a rider, I want to pay for my selected rental plan, so that I can start using the vehicle.

#### Acceptance Criteria

1. WHEN the Rider proceeds to payment, THE Payment_Module SHALL display an order summary showing the selected plan name, price, and rental period
2. THE Payment_Module SHALL integrate with a payment gateway supporting UPI, debit cards, credit cards, and net banking
3. WHEN the payment is successful, THE Payment_Module SHALL record the transaction in Supabase_Backend with rider ID, plan ID, amount, payment method, and timestamp
4. WHEN the payment is successful, THE Payment_Module SHALL update the rider's rental status to "Active" and navigate to the Rider_Dashboard
5. IF the payment fails, THEN THE Payment_Module SHALL display an error message with the failure reason and allow the Rider to retry or choose a different payment method
6. THE Payment_Module SHALL generate a payment receipt accessible from the Rider_Dashboard

### Requirement 9: Rider Dashboard

**User Story:** As an active rider, I want a dashboard showing my rental status and vehicle information, so that I can manage my rental effectively.

#### Acceptance Criteria

1. WHEN an authenticated Rider with an active rental opens the App, THE Rider_Dashboard SHALL display the current rental plan name, start date, end date, and days remaining
2. THE Rider_Dashboard SHALL display the assigned vehicle details: vehicle model, registration number, and vehicle ID
3. THE Rider_Dashboard SHALL provide quick action buttons for: "Renew Plan", "Contact Support", and "View Payment History"
4. THE Rider_Dashboard SHALL display the rider's KYC status and profile completion percentage
5. WHEN the rental period is within 3 days of expiry, THE Rider_Dashboard SHALL display a renewal reminder with a direct link to the Plan_Selector
6. WHEN an authenticated Rider without an active rental opens the App, THE Rider_Dashboard SHALL display a prompt to select a rental plan with a link to the Plan_Selector

---

## Phase 4: Tracking, Battery Monitoring, Inventory & Admin

### Requirement 10: GPS Tracking Integration

**User Story:** As an admin, I want to track vehicle locations, so that I can monitor fleet utilization and ensure vehicle security.

#### Acceptance Criteria

1. THE GPS_Tracker SHALL integrate with the external GPS tracking application via deep linking or API, allowing the Admin to view real-time vehicle locations
2. WHEN an Admin selects a vehicle from the inventory, THE GPS_Tracker SHALL display the last known GPS coordinates and timestamp for that vehicle
3. THE Rider_Dashboard SHALL display a "Track My Vehicle" action that opens the external GPS tracking application with the assigned vehicle pre-selected
4. IF the external GPS tracking application is not installed on the device, THEN THE GPS_Tracker SHALL display a message with a link to install the tracking application

### Requirement 11: Battery Monitoring Integration

**User Story:** As an admin, I want to monitor vehicle battery levels and battery identifiers, so that I can manage charging schedules and battery inventory.

#### Acceptance Criteria

1. THE Battery_Monitor SHALL integrate with the external Bluetooth-enabled battery monitoring application via deep linking or API
2. WHEN an Admin views a vehicle's details, THE Battery_Monitor SHALL display the last known battery percentage and the tagged battery number for that vehicle
3. THE Rider_Dashboard SHALL display the current battery percentage for the assigned vehicle when data is available from the Battery_Monitor
4. IF battery data is unavailable, THEN THE Battery_Monitor SHALL display "Battery data unavailable — connect via Bluetooth app" with a link to open the external battery application

### Requirement 12: Inventory Management

**User Story:** As an admin, I want to manage the vehicle fleet, so that I can track availability, assignments, and maintenance status.

#### Acceptance Criteria

1. THE Inventory_Manager SHALL display a list of all vehicles with columns: vehicle ID, model, registration number, current status (Available, Rented, Maintenance), assigned rider (if rented), and battery number
2. WHEN an Admin adds a new vehicle, THE Inventory_Manager SHALL store the vehicle record in Supabase_Backend with vehicle ID, model, registration number, battery number, and status defaulting to "Available"
3. WHEN an Admin assigns a vehicle to a Rider, THE Inventory_Manager SHALL update the vehicle status to "Rented" and link the vehicle to the Rider's record in Supabase_Backend
4. WHEN an Admin marks a vehicle for maintenance, THE Inventory_Manager SHALL update the vehicle status to "Maintenance" and record the maintenance reason
5. THE Inventory_Manager SHALL provide filters to view vehicles by status: All, Available, Rented, Maintenance
6. THE Inventory_Manager SHALL display a summary count of vehicles in each status category

### Requirement 13: Admin Dashboard

**User Story:** As an admin, I want an overview dashboard, so that I can monitor business operations at a glance.

#### Acceptance Criteria

1. WHEN an Admin logs in, THE App SHALL display an admin dashboard with summary cards: total riders, active rentals, vehicles available, vehicles in maintenance, and pending KYC reviews
2. THE admin dashboard SHALL provide navigation to: KYC review queue, Inventory_Manager, rider list, and payment transaction history
3. WHEN an Admin navigates to the KYC review queue, THE App SHALL display a list of riders with "Under Review" KYC status, with actions to approve or reject each submission
4. THE admin dashboard SHALL display recent activity: latest signups, recent payments, and recent KYC status changes

### Requirement 14: Rider Data Storage

**User Story:** As a system operator, I want all rider information stored securely in Supabase, so that data is persistent, queryable, and protected.

#### Acceptance Criteria

1. THE Supabase_Backend SHALL store rider profiles including: user ID, full name, phone number, date of birth, gender, address, city, emergency contact, KYC status, and account creation timestamp
2. THE Supabase_Backend SHALL store KYC documents as files in Supabase Storage with references linked to the rider's profile record
3. THE Supabase_Backend SHALL store rental records including: rental ID, rider ID, vehicle ID, plan type, start date, end date, payment status, and amount paid
4. THE Supabase_Backend SHALL store vehicle records including: vehicle ID, model, registration number, battery number, current status, and assigned rider ID
5. THE Supabase_Backend SHALL enforce Row Level Security (RLS) policies so that Riders can only read and update their own profile and rental data
6. THE Supabase_Backend SHALL enforce RLS policies so that only Admin users can access the Inventory_Manager data and KYC review queue

### Requirement 15: Navigation and Session Management

**User Story:** As a user, I want smooth navigation throughout the app with proper session handling, so that I have a seamless experience.

#### Acceptance Criteria

1. THE Navigation_Stack SHALL implement a conditional root navigator: unauthenticated users see the Landing_Screen and Auth_Module screens, authenticated Riders see the Rider tab navigator, and authenticated Admins see the Admin tab navigator
2. WHEN the App launches, THE Navigation_Stack SHALL check for an existing Supabase_Backend session and route the user to the appropriate navigator without showing a login screen
3. THE Navigation_Stack SHALL implement a bottom tab navigator for Riders with tabs: Home (Rider_Dashboard), Plans, Profile, and Support
4. THE Navigation_Stack SHALL implement a bottom tab navigator for Admins with tabs: Dashboard, KYC Review, Inventory, and Settings
5. IF a Rider's session token expires, THEN THE Auth_Module SHALL attempt a silent token refresh via Supabase_Backend before falling back to the login screen

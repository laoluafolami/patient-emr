# Patient EMR System MVP - Requirements Document

## Introduction

The Patient EMR (Electronic Medical Records) System MVP is a web-based healthcare platform enabling secure, role-based access for patients, nurses, doctors, and administrators. The system provides core functionality for appointment booking, medical record management, vital sign recording, and administrative oversight through a single, unified interface with clay morphism design and dark/light theme support.

## Glossary

- **System**: Patient EMR System MVP
- **Patient**: End user seeking healthcare services
- **Nurse**: Healthcare professional assisting doctors with patient records and vital sign recording
- **Doctor**: Healthcare professional conducting consultations and managing patient care
- **Admin**: System administrator managing users, settings, and application activity
- **Role-Based Access**: System functionality restricted based on authenticated user role
- **Appointment**: Scheduled healthcare consultation between patient and doctor
- **Lab Result**: Medical test result uploaded by doctor or nurse
- **Prescription**: Medication directive issued by doctor
- **Vital Signs**: Patient health measurements (temperature, blood pressure, heart rate, etc.)
- **Consultation**: Doctor-patient interaction for medical assessment
- **Patient Report**: Clinical documentation created by doctor during or after consultation
- **Clay Morphism**: Modern UI design style with soft, rounded elements and subtle depth
- **Dark/Light Theme**: User interface color scheme options (dark mode and light mode)

## Requirements

### Requirement 1: Patient Dashboard Access

**User Story:** As a patient, I want to access my personal dashboard, so that I can view my health information and manage my healthcare needs.

#### Acceptance Criteria

1. WHEN a patient logs in successfully, THE System SHALL display the patient dashboard
2. THE Patient Dashboard SHALL display upcoming appointments, recent lab results, active prescriptions, and unread messages
3. THE System SHALL restrict dashboard access to authenticated patients only
4. THE Patient Dashboard SHALL be responsive and functional on mobile, tablet, and desktop devices

---

### Requirement 2: Appointment Booking

**User Story:** As a patient, I want to book appointments with doctors, so that I can schedule healthcare consultations.

#### Acceptance Criteria

1. WHEN a patient navigates to the appointment booking interface, THE System SHALL display available appointment slots
2. WHEN a patient selects an available slot and confirms booking, THE System SHALL create the appointment and display a confirmation
3. WHEN an appointment is booked, THE System SHALL send a confirmation message to the patient
4. IF a patient attempts to book an appointment without selecting a valid slot, THEN THE System SHALL display an error message

---

### Requirement 3: View Lab Results

**User Story:** As a patient, I want to view my lab results, so that I can monitor my health status.

#### Acceptance Criteria

1. WHEN a patient accesses the lab results section, THE System SHALL display all uploaded lab results with dates and test names
2. WHEN a patient selects a lab result, THE System SHALL display the full result details and any associated notes
3. THE System SHALL display lab results in chronological order (newest first)
4. IF no lab results exist, THE System SHALL display a message indicating no results are available

---

### Requirement 4: View Drug Prescriptions

**User Story:** As a patient, I want to view my prescriptions, so that I can track my medications.

#### Acceptance Criteria

1. WHEN a patient accesses the prescriptions section, THE System SHALL display all active prescriptions with medication name, dosage, and frequency
2. WHEN a patient selects a prescription, THE System SHALL display full prescription details including start date, end date, and doctor notes
3. THE System SHALL display prescriptions in order of most recent first
4. IF no prescriptions exist, THE System SHALL display a message indicating no prescriptions are available

---

### Requirement 5: Receive Messages from Doctors

**User Story:** As a patient, I want to receive messages from doctors, so that I can communicate about my healthcare.

#### Acceptance Criteria

1. WHEN a doctor sends a message to a patient, THE System SHALL store the message and notify the patient
2. WHEN a patient accesses the messages section, THE System SHALL display all messages from doctors with timestamps
3. WHEN a patient selects a message, THE System SHALL display the full message content
4. THE System SHALL mark messages as read/unread and display unread message count on the dashboard

---

### Requirement 6: Nurse Vital Signs Recording

**User Story:** As a nurse, I want to record patient vital signs, so that I can assist doctors with patient health monitoring.

#### Acceptance Criteria

1. WHEN a nurse accesses the vital signs recording interface, THE System SHALL display a form for entering temperature, blood pressure, heart rate, and respiratory rate
2. WHEN a nurse submits vital signs for a patient, THE System SHALL validate the data and store the record with timestamp
3. WHEN vital signs are recorded, THE System SHALL associate them with the correct patient record
4. IF a nurse enters invalid vital sign values, THEN THE System SHALL display validation errors and prevent submission

---

### Requirement 7: Nurse Patient Record Assistance

**User Story:** As a nurse, I want to assist doctors by entering patient record data, so that I can support the clinical workflow.

#### Acceptance Criteria

1. WHEN a nurse accesses the patient record entry interface, THE System SHALL display a form matching the standard patient record structure
2. WHEN a nurse enters patient information and submits, THE System SHALL validate and store the data
3. WHEN a nurse completes a patient record entry, THE System SHALL make the data available to the assigned doctor
4. IF a nurse attempts to submit incomplete required fields, THEN THE System SHALL display validation errors

---

### Requirement 8: Doctor Patient History Dashboard

**User Story:** As a doctor, I want to view patient history on my dashboard, so that I can quickly access patient information.

#### Acceptance Criteria

1. WHEN a doctor logs in, THE System SHALL display a dashboard with assigned patients and their recent medical history
2. THE Doctor Dashboard SHALL display patient names, appointment schedules, recent vital signs, and active prescriptions
3. WHEN a doctor selects a patient, THE System SHALL display the complete patient history including previous consultations and lab results
4. THE System SHALL allow doctors to filter and search patients by name or ID

---

### Requirement 9: Doctor Consultation Workflow

**User Story:** As a doctor, I want to conduct consultations and document findings, so that I can provide clinical care.

#### Acceptance Criteria

1. WHEN a doctor starts a consultation with a patient, THE System SHALL provide a consultation interface with patient history visible
2. WHEN a doctor enters consultation notes, THE System SHALL save the notes with timestamp and doctor identification
3. WHEN a doctor completes a consultation, THE System SHALL allow the doctor to issue prescriptions and create reports
4. THE System SHALL prevent consultation data loss by auto-saving at regular intervals

---

### Requirement 10: Doctor Write Patient Reports

**User Story:** As a doctor, I want to write and save patient reports, so that I can document clinical assessments.

#### Acceptance Criteria

1. WHEN a doctor accesses the report writing interface, THE System SHALL provide a text editor for clinical documentation
2. WHEN a doctor saves a report, THE System SHALL store it with timestamp, doctor identification, and associated patient
3. WHEN a doctor submits a report, THE System SHALL make it available in the patient's medical record
4. IF a doctor attempts to save a report without required fields, THEN THE System SHALL display validation errors

---

### Requirement 11: Doctor View Lab Results

**User Story:** As a doctor, I want to view patient lab results, so that I can make informed clinical decisions.

#### Acceptance Criteria

1. WHEN a doctor accesses a patient's lab results, THE System SHALL display all results with dates, test names, and values
2. WHEN a doctor selects a lab result, THE System SHALL display detailed results and any associated notes
3. THE System SHALL display results in chronological order (newest first)
4. IF no lab results exist for a patient, THE System SHALL display a message indicating no results are available

---

### Requirement 12: Doctor Upload Lab Results

**User Story:** As a doctor, I want to upload lab results for patients, so that I can add test results to patient records.

#### Acceptance Criteria

1. WHEN a doctor accesses the lab result upload interface, THE System SHALL provide a form for selecting a patient and uploading result files
2. WHEN a doctor uploads a lab result file, THE System SHALL validate the file format and store it with timestamp and doctor identification
3. WHEN a lab result is uploaded, THE System SHALL associate it with the correct patient and notify the patient
4. IF a doctor attempts to upload an invalid file format, THEN THE System SHALL display an error message and prevent upload

---

### Requirement 13: User Registration and Signup

**User Story:** As a new user, I want to create an account, so that I can access the system.

#### Acceptance Criteria

1. WHEN a user accesses the signup page, THE System SHALL display a registration form requesting email, password, and role selection
2. WHEN a user submits valid registration data, THE System SHALL create a user account and send a confirmation email
3. IF a user attempts to register with an email already in use, THEN THE System SHALL display an error message
4. IF a user enters a password that does not meet security requirements, THEN THE System SHALL display validation errors

---

### Requirement 14: Email and Password Validation

**User Story:** As the system, I want to validate user credentials, so that I can ensure account security.

#### Acceptance Criteria

1. THE System SHALL require email addresses in valid email format (RFC 5322 compliant)
2. THE System SHALL require passwords with minimum 8 characters, including uppercase, lowercase, number, and special character
3. WHEN a user enters an invalid email format, THE System SHALL display a validation error
4. WHEN a user enters a password that does not meet requirements, THE System SHALL display specific requirement failures

---

### Requirement 15: Password Reset Functionality

**User Story:** As a user, I want to reset my password, so that I can regain access if I forget my credentials.

#### Acceptance Criteria

1. WHEN a user clicks "Forgot Password" on the login page, THE System SHALL display an email entry form
2. WHEN a user enters a registered email, THE System SHALL send a password reset link valid for 24 hours
3. WHEN a user clicks the reset link and enters a new password, THE System SHALL update the password and confirm success
4. IF a user attempts to use an expired reset link, THEN THE System SHALL display an error message

---

### Requirement 16: Admin User Account Management

**User Story:** As an admin, I want to manage user accounts, so that I can control system access.

#### Acceptance Criteria

1. WHEN an admin accesses the user management interface, THE System SHALL display a list of all users with role, status, and creation date
2. WHEN an admin creates a new user account, THE System SHALL validate the input and send account credentials to the user
3. WHEN an admin resets a user account, THE System SHALL reset the password and notify the user
4. WHEN an admin deactivates a user account, THE System SHALL prevent that user from logging in

---

### Requirement 17: Admin Application Settings Management

**User Story:** As an admin, I want to manage application settings, so that I can configure system behavior.

#### Acceptance Criteria

1. WHEN an admin accesses the settings interface, THE System SHALL display configurable options for appointment duration, lab result retention, and notification preferences
2. WHEN an admin updates a setting, THE System SHALL validate the input and apply the change system-wide
3. WHEN settings are updated, THE System SHALL log the change with timestamp and admin identification
4. IF an admin enters invalid setting values, THEN THE System SHALL display validation errors

---

### Requirement 18: Admin Activity Monitoring and Logging

**User Story:** As an admin, I want to monitor application activity and view logs, so that I can track system usage and troubleshoot issues.

#### Acceptance Criteria

1. WHEN an admin accesses the activity log, THE System SHALL display real-time events including user logins, data modifications, and system errors
2. THE Activity Log SHALL include timestamp, user identification, action type, and affected resource for each event
3. WHEN an admin filters logs by date range or user, THE System SHALL display matching events
4. THE System SHALL retain activity logs for minimum 90 days

---

### Requirement 19: Role-Based Access Control

**User Story:** As the system, I want to enforce role-based access, so that users can only access appropriate features.

#### Acceptance Criteria

1. WHEN a user attempts to access a feature, THE System SHALL verify the user's role and grant or deny access
2. IF a user attempts to access a feature outside their role permissions, THEN THE System SHALL display an access denied message
3. THE System SHALL enforce role-based access at both UI and API levels
4. THE System SHALL support four roles: Patient, Nurse, Doctor, and Admin with distinct permission sets

---

### Requirement 20: Single URL with Role-Based Routing

**User Story:** As a user, I want to access all system features through a single URL, so that I have a unified entry point.

#### Acceptance Criteria

1. THE System SHALL be accessible via a single domain URL
2. WHEN a user logs in, THE System SHALL route to the appropriate dashboard based on user role
3. WHEN a user navigates between features, THE System SHALL maintain the single URL with role-based routing
4. THE System SHALL prevent direct URL access to features outside the user's role permissions

---

### Requirement 21: Clay Morphism UI Design

**User Story:** As a user, I want an interface with clay morphism design, so that I can enjoy a modern, visually appealing experience.

#### Acceptance Criteria

1. THE System UI SHALL implement clay morphism design with soft, rounded elements and subtle depth effects
2. ALL UI components SHALL use consistent spacing, typography, and color palette aligned with clay morphism principles
3. THE System SHALL display smooth transitions and animations without compromising performance
4. THE System UI SHALL maintain visual consistency across all pages and user roles

---

### Requirement 22: Dark and Light Theme Support

**User Story:** As a user, I want to toggle between dark and light themes, so that I can choose my preferred visual experience.

#### Acceptance Criteria

1. WHEN a user accesses the theme settings, THE System SHALL display a toggle for dark and light mode
2. WHEN a user selects a theme, THE System SHALL apply the theme immediately and persist the preference
3. THE System SHALL apply the selected theme consistently across all pages and components
4. THE System SHALL default to the user's system theme preference on first login

---

### Requirement 23: Responsive Design - Mobile, Tablet, Desktop

**User Story:** As a user, I want the interface to work seamlessly on all devices, so that I can access the system from any screen size.

#### Acceptance Criteria

1. THE System SHALL be fully functional on mobile devices (320px and above)
2. THE System SHALL be fully functional on tablet devices (768px and above)
3. THE System SHALL be fully functional on desktop devices (1024px and above)
4. ALL interactive elements SHALL be appropriately sized and spaced for touch and mouse input on respective devices

---

### Requirement 24: Authentication Session Management

**User Story:** As the system, I want to manage user sessions securely, so that I can protect user accounts.

#### Acceptance Criteria

1. WHEN a user logs in successfully, THE System SHALL create a secure session with appropriate timeout
2. WHEN a user session expires, THE System SHALL redirect to login and display a session expired message
3. WHEN a user logs out, THE System SHALL terminate the session and clear authentication tokens
4. THE System SHALL prevent concurrent sessions for the same user account

---

### Requirement 25: Data Validation and Error Handling

**User Story:** As the system, I want to validate all user inputs and handle errors gracefully, so that I can maintain data integrity.

#### Acceptance Criteria

1. WHEN a user submits invalid data, THE System SHALL display specific validation error messages
2. WHEN a system error occurs, THE System SHALL log the error and display a user-friendly error message
3. THE System SHALL prevent SQL injection and other common security vulnerabilities through input validation
4. IF a critical operation fails, THEN THE System SHALL provide options to retry or contact support

---

## MVP Scope Definition

### Included Features
- Patient dashboard with appointments, lab results, prescriptions, and messages
- Appointment booking system
- Nurse vital signs recording
- Doctor consultation workflow with report writing
- Lab result upload and viewing
- Admin user management and activity logging
- In-house authentication with email/password
- Role-based access control (Patient, Nurse, Doctor, Admin)
- Single URL with role-based routing
- Clay morphism UI design
- Dark/light theme toggle
- Responsive design (mobile, tablet, desktop)
- Session management and security

### Excluded Features (Post-MVP)
- Video consultation capability
- Advanced analytics and reporting
- Insurance integration
- Prescription fulfillment tracking
- Patient portal customization
- Multi-language support
- Advanced audit trails with compliance reporting
- Integration with external lab systems
- Mobile native applications
- Telemedicine features

---

## Technical Constraints

1. **Single URL Architecture**: All features accessible through one domain with role-based routing
2. **Database**: PostgreSQL for persistent data storage
3. **Frontend Deployment**: Netlify
4. **Backend Deployment**: Render (MVP), Hostinger Business (Production)
5. **Authentication**: In-house implementation (no third-party OAuth)
6. **Design System**: Clay morphism with dark/light theme support
7. **Responsive**: Mobile-first approach supporting 320px+ screens

---

## Success Criteria

1. All four user roles can successfully authenticate and access role-appropriate features
2. Patients can book appointments, view results/prescriptions, and receive messages
3. Doctors can manage patient consultations, write reports, and upload lab results
4. Nurses can record vital signs and assist with patient data entry
5. Admins can manage users and monitor system activity
6. UI is responsive and functional on mobile, tablet, and desktop
7. Dark/light theme toggle works seamlessly
8. All data persists correctly in PostgreSQL
9. Session management prevents unauthorized access
10. System handles errors gracefully with appropriate user feedback

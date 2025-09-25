# IU International University - Segment Analytics Demo

A comprehensive replica of iu.org with embedded Segment tracking for the Mobile Viking team demonstration. This demo showcases how Segment Analytics can power IU's key use cases: new student onboarding, churn prevention, and OIV participant tracking.

## 🎯 Demo Overview

This website demonstrates three critical IU use cases with full Segment tracking:

### 📧 Email-Based User Identification
- **User ID Strategy**: Actual email address used as user_id for clean, searchable profiles
- **Direct Mapping**: `student@iu.de` → user_id: `student@iu.de` (no hashing)
- **Trait Storage**: Both emails stored as profile traits:
  - `email_personal`: "john.doe@gmail.com" 
  - `email_iu`: "john.doe@student.iu.org"
- **Easy Search**: Support team can directly search Segment by email address
- **Cross-Device Journey**: Same email = same user_id across all devices and platforms
- **Clean Data**: Human-readable identifiers, no cryptic hashes to decode

### 1. New Student Onboarding (Multi-channel, Consent-aware)
- **Goal**: Guide new enrollees through first weeks to reduce "no login in 7 days"
- **Implementation**: Event-driven journey with consent management
- **Tracking**: User identification, onboarding steps, consent preferences, channel selection

### 2. Early-life Churn Prevention
- **Goal**: Reduce ~10% pre-enrollment churn and ~15% early churn
- **Implementation**: Engagement tracking and behavioral pattern analysis
- **Tracking**: Engagement events, invoice interactions, login patterns

### 3. Information Event Participant Tracking
- **Goal**: Track RSVP vs attendance, send timely reminders and follow-ups
- **Implementation**: Complete webinar journey from RSVP to attendance
- **Tracking**: Event RSVPs, reminders, attendance, engagement scoring

## 🔧 Currently Implemented Features

### ✅ Core Website Functionality
- **Responsive Design**: Mobile-first, modern UI matching IU.org aesthetic
- **User Authentication**: Complete login/signup flow with session management
- **Programme Browsing**: Interactive programme categories and detailed views
- **Information Events**: Event listing, RSVP functionality, and tracking
- **User Dashboard**: Personalized dashboard for logged-in students
- **Consent Management**: Comprehensive consent settings for all channels

### ✅ Segment Analytics Integration
- **Write Key**: `U5R8FMbQEwGcu6DGxNHTpJLEXu6h1SFs` (configured)
- **Auto-tracking**: Page views, clicks, form interactions, scroll depth
- **User Identification**: Complete user traits and consent tracking
- **Event Tracking**: All required events implemented

### ✅ Required Segment Events Implemented

#### Core Events
- ✅ **Page Viewed**: Meaningful page names (Homepage, Study Programmes, Information Events)
- ✅ **Program Viewed**: `{ Program_Id, Program_Name, Category }`
- ✅ **Application Started**: `{ Program_Id, Program_Name }`
- ✅ **Application Submitted**: `{ Program_Id, Program_Name, User_Id }`
- ✅ **Event RSVPed**: `{ Event_Id, Title, Starts_At, User_Id }`
- ✅ **Consent Updated**: `{ Channel, Purpose, Value, User_Id }`
- ✅ **Contact Preference Set**: `{ Preferred_Channel, User_Id }`
- ✅ **Invoice Viewed**: `{ Invoice_Id, Amount, Status, User_Id }`

#### User Identification & Consent
- ✅ **Identify**: Complete user traits including consent preferences
- ✅ **Reset**: Proper cleanup on logout
- ✅ **Consent Tracking**: Granular consent for email/WhatsApp marketing/transactional

#### Onboarding & Engagement Events
- ✅ **Account Created**: User account creation
- ✅ **Profile Completed**: Profile setup completion
- ✅ **Program Selected**: Programme selection
- ✅ **MyCampus Login**: Student portal access
- ✅ **Course Enrolled**: Course enrollment completion
- ✅ **Engagement Events**: Login patterns, content interaction

### ✅ User Traits Captured
```javascript
{
  userId: "student@iu.de", // Actual email as user_id
  email_personal: "student@email.com",
  email_iu: "student@student.iu.org", 
  phone: "+49123456789",
  program: "business_mba",
  semester: "2024_spring",
  preferred_channel: "email|whatsapp|sms",
  email_marketing_opt_in: boolean,
  email_transactional_opt_in: boolean,
  whatsapp_marketing_opt_in: boolean,
  whatsapp_transactional_opt_in: boolean,
  first_name: "John",
  last_name: "Doe"
}
```

## 🚀 Demo Scenarios

### Demo Functions Available
Open browser console and run these functions to see Segment tracking in action:

```javascript
// Run all demo scenarios
runDemoScenarios()

// Individual demos
demoChurnPrevention()    // Shows engagement tracking for churn prevention
demoOnboardingJourney()  // Shows onboarding step events
demoEventTracking()      // Shows information event journey
```

### User Journey Testing
1. **New Student Signup**: Complete registration with consent tracking
2. **Program Exploration**: Browse programmes with detailed tracking
3. **OIV RSVP**: Register for webinars with full event tracking
4. **Consent Management**: Update preferences with granular tracking
5. **Churn Prevention**: Simulate at-risk behaviors and interventions

## 📋 Functional Entry Points

### Public URLs (No Authentication Required)
- `/` - Homepage with hero section and programme overview
- `/#programs` - Study programmes section
- `/#oiv` - Online Information Events (webinars)
- `/#about` - About IU section
- Login/Signup modals accessible from any page

### Authenticated User Features
- User Dashboard (shows after login)
- Consent Settings Management
- Personal OIV Event Tracking
- Application Status Tracking

### Interactive Elements
- **Programme Categories**: Click to view programmes and track engagement
- **OIV Events**: RSVP functionality with complete tracking chain
- **Authentication**: Full signup/login flow with Segment identification
- **Consent Settings**: Granular consent management for all channels

## 🔄 Data Flow & Storage

### Session Management
- **LocalStorage**: User session persistence
- **Segment Identity**: Automatic re-identification on page load
- **State Management**: Global application state tracking

### Event Triggering
- **Automatic**: Page views, clicks, form focus, scroll depth
- **User Actions**: Authentication, programme views, RSVP, consent changes
- **Demo Scenarios**: Programmatic event simulation for presentation

## 🎪 Mobile Viking Demo Script

### 1. Homepage Experience (1-2 minutes)
- Load homepage → automatic Page Viewed event
- Show responsive design and IU.org aesthetic match
- Demonstrate scroll tracking and engagement measurement

### 2. New Student Onboarding (2-3 minutes)
- Click "Apply Now" → Application Started event
- Complete signup form → User Identified with all traits
- Show consent granularity (email/WhatsApp, marketing/transactional)
- Submit application → Application Submitted + Onboarding Steps

### 3. Program Exploration & Tracking (1-2 minutes)
- Browse programme categories → Program Viewed events
- Show detailed programme tracking with IDs and names
- Demonstrate engagement event capture

### 4. OIV Event Journey (2-3 minutes)
- View OIV events section
- RSVP for webinar → OIV RSVPed event
- Show follow-up tracking (confirmation, reminders, attendance)
- Run `demoOIVTracking()` in console for complete journey

### 5. Churn Prevention Demo (2-3 minutes)
- Run `demoChurnPrevention()` in console
- Show at-risk signal detection (no login, overdue invoice)
- Demonstrate escalation triggers and intervention points

### 6. Consent & Preference Management (1-2 minutes)
- Access user dashboard after login
- Open consent settings
- Update preferences → Consent Updated events
- Show channel preference tracking

### 7. Real-time Segment Data (1-2 minutes)
- Open Segment debugger/live events
- Show all tracked events in real-time
- Demonstrate data quality and completeness

## 🛠 Technical Implementation

### Architecture
- **Frontend**: Pure HTML/CSS/JavaScript (static website)
- **Analytics**: Segment Analytics.js 2.0
- **Styling**: Custom CSS with Inter font, responsive design
- **State Management**: LocalStorage + global JavaScript objects

### Key Files
- `index.html` - Main application structure
- `css/style.css` - Complete IU.org-matched styling
- `js/segment-tracking.js` - All Segment event implementations
- `js/main.js` - User interactions and application logic

### Browser Requirements
- Modern browsers (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- LocalStorage support
- No server-side requirements (fully static)

## 🚧 Features Not Yet Implemented

### Future Enhancements
- **Real Authentication API**: Currently simulated with localStorage
- **Actual Programme Database**: Static programme data, could connect to CMS
- **Real OIV Integration**: Would integrate with Zoom/Teams webhooks
- **Invoice System**: Currently shows placeholder invoice tracking
- **Multi-language Support**: Currently English only
- **Advanced Analytics Dashboard**: Could add real-time analytics visualization

### Potential Integrations
- **SendGrid**: For transactional/marketing email automation
- **Twilio/WhatsApp Business**: For WhatsApp messaging automation
- **Kafka**: For real-time event streaming integration
- **Flex**: For agent escalation and task management
- **Real CRM**: For complete student lifecycle management

## 🎯 Recommended Next Steps

1. **Production Deployment**: Deploy to live environment for broader testing
2. **Real Data Integration**: Connect to actual IU systems and databases
3. **A/B Testing Setup**: Implement Segment's A/B testing capabilities
4. **Advanced Personalization**: Use Segment data for dynamic content
5. **Audience Building**: Set up Segment audiences for targeting
6. **Downstream Activations**: Connect to email/SMS/WhatsApp platforms
7. **Analytics Dashboard**: Build comprehensive analytics reporting

## 📊 Success Metrics

### Trackable KPIs
- **Onboarding Completion Rate**: Step-by-step funnel analysis
- **Churn Risk Detection**: Early warning system effectiveness  
- **OIV Engagement**: RSVP-to-attendance conversion rates
- **Consent Rates**: Opt-in rates by channel and purpose
- **Application Conversion**: Programme view to application rates

### Demo Success Criteria
- ✅ All required Segment events firing correctly
- ✅ Complete user identification and trait capture
- ✅ Consent management working granularly
- ✅ Real-time event tracking visible in Segment
- ✅ Demo scenarios showcase all three use cases
- ✅ Mobile-responsive design matching IU.org aesthetic

---

**Demo Ready**: This application is fully prepared for the Mobile Viking demonstration, with comprehensive Segment tracking implementation covering all IU use cases and requirements.

For questions or demo support, check the browser console for detailed event logging and use the provided demo functions to showcase specific scenarios.
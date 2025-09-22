/**
 * Segment Analytics Tracking Implementation for IU.org Demo
 * 
 * This file implements all required Segment tracking events for the IU use cases:
 * 1. New student onboarding (multi-channel, consent-aware)
 * 2. Early-life churn prevention
 * 3. OIV participant tracking and website/app activation
 */

// Global user state for tracking
window.IU_UserState = {
    isLoggedIn: false,
    userId: null,
    userTraits: {},
    sessionStartTime: Date.now()
};

/**
 * Initialize Segment tracking when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Segment Analytics initialized for IU.org demo');
    
    // Track initial page view
    trackPageView();
    
    // Set up automatic page tracking for SPA-like behavior
    setupAutomaticTracking();
    
    // Track session start
    analytics.track('Session Started', {
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        referrer: document.referrer || 'direct'
    });
});

/**
 * CORE EVENT: Page Viewed
 * Tracks all page views across the site with meaningful names
 */
function trackPageView(pageName = null) {
    // Auto-detect meaningful page names based on URL and content
    if (!pageName) {
        const path = window.location.pathname;
        const hash = window.location.hash;
        
        if (path.includes('index.html') || path === '/') {
            if (hash === '#programs') {
                pageName = 'Study';
            } else if (hash === '#events') {
                pageName = 'Information Events';
            } else if (hash === '#about') {
                pageName = 'About';
            } else {
                pageName = 'Homepage';
            }
        } else if (path.includes('demo-guide')) {
            pageName = 'Demo Guide';
        } else {
            pageName = document.title;
        }
    }
    
    const pageData = {
        title: document.title,
        url: window.location.href,
        path: window.location.pathname,
        referrer: document.referrer || 'direct',
        timestamp: new Date().toISOString(),
        page_name: pageName
    };
    
    analytics.page(pageName, pageData);
    console.log('📄 Page Viewed:', pageData);
}

/**
 * CORE EVENT: Program Viewed
 * Tracks when users view specific study programmes
 */
function trackProgramViewed(programId, programName, category = null) {
    const eventData = {
        program_id: programId,
        program_name: programName,
        timestamp: new Date().toISOString()
    };
    
    if (category) {
        eventData.category = category;
    }
    
    analytics.track('Program Viewed', eventData);
    console.log('🎓 Program Viewed:', eventData);
}

/**
 * CORE EVENT: Application Started
 * Tracks when users begin the application process
 */
function trackApplicationStarted(programId, programName = null) {
    const eventData = {
        program_id: programId,
        timestamp: new Date().toISOString(),
        session_id: generateSessionId()
    };
    
    if (programName) {
        eventData.program_name = programName;
    }
    
    analytics.track('Application Started', eventData);
    console.log('📝 Application Started:', eventData);
}

/**
 * CORE EVENT: Application Submitted
 * Tracks when users complete their application
 */
function trackApplicationSubmitted(programId, programName = null, userId = null) {
    const eventData = {
        program_id: programId,
        timestamp: new Date().toISOString(),
        session_id: generateSessionId()
    };
    
    if (programName) {
        eventData.program_name = programName;
    }
    
    if (userId) {
        eventData.user_id = userId;
    }
    
    analytics.track('Application Submitted', eventData);
    console.log('✅ Application Submitted:', eventData);
}

/**
 * CORE EVENT: Event RSVPed
 * Tracks webinar/event RSVPs for participant tracking use case
 */
function trackEventRSVP(eventId, title, startsAt, userId = null) {
    const eventData = {
        event_id: eventId,
        title: title,
        starts_at: startsAt,
        rsvp_timestamp: new Date().toISOString(),
        session_id: generateSessionId()
    };
    
    if (userId) {
        eventData.user_id = userId;
    }
    
    analytics.track('Event RSVPed', eventData);
    console.log('📅 Event RSVPed:', eventData);
}

/**
 * CORE EVENT: Consent Updated
 * Tracks all consent changes for compliance and personalization
 */
function trackConsentUpdated(channel, purpose, value, userId = null) {
    const eventData = {
        channel: channel, // 'email', 'whatsapp', 'sms'
        purpose: purpose, // 'marketing', 'transactional'
        value: value, // true/false
        timestamp: new Date().toISOString()
    };
    
    if (userId) {
        eventData.user_id = userId;
    }
    
    analytics.track('Consent Updated', eventData);
    console.log('🔒 Consent Updated:', eventData);
}

/**
 * CORE EVENT: Contact Preference Set
 * Tracks preferred communication channel changes
 */
function trackContactPreferenceSet(preferredChannel, userId = null) {
    const eventData = {
        preferred_channel: preferredChannel, // 'email', 'whatsapp', 'sms'
        timestamp: new Date().toISOString()
    };
    
    if (userId) {
        eventData.user_id = userId;
    }
    
    analytics.track('Contact Preference Set', eventData);
    console.log('📞 Contact Preference Set:', eventData);
}

/**
 * OPTIONAL EVENT: Invoice Viewed
 * Tracks invoice interactions for churn prevention
 */
function trackInvoiceViewed(invoiceId, amount = null, status = null, userId = null) {
    const eventData = {
        invoice_id: invoiceId,
        timestamp: new Date().toISOString()
    };
    
    if (amount) {
        eventData.amount = amount;
    }
    
    if (status) {
        eventData.status = status; // 'paid', 'pending', 'overdue'
    }
    
    if (userId) {
        eventData.user_id = userId;
    }
    
    analytics.track('Invoice Viewed', eventData);
    console.log('💰 Invoice Viewed:', eventData);
}

/**
 * IDENTIFY AND CONSENT TRACKING
 * Called on signup/login with comprehensive user traits
 */
function identifyUser(userId, traits = {}) {
    // Ensure required fields are present
    const userTraits = {
        email_personal: traits.email_personal || traits.emailPersonal,
        email_iu: traits.email_iu || null,
        phone: traits.phone,
        program: traits.program,
        semester: traits.semester,
        preferred_channel: traits.preferred_channel || traits.preferredChannel || 'email',
        email_marketing_opt_in: traits.email_marketing_opt_in !== undefined ? traits.email_marketing_opt_in : traits.emailMarketingOptIn || false,
        email_transactional_opt_in: traits.email_transactional_opt_in !== undefined ? traits.email_transactional_opt_in : traits.emailTransactionalOptIn || true,
        whatsapp_marketing_opt_in: traits.whatsapp_marketing_opt_in !== undefined ? traits.whatsapp_marketing_opt_in : traits.whatsappMarketingOptIn || false,
        whatsapp_transactional_opt_in: traits.whatsapp_transactional_opt_in !== undefined ? traits.whatsapp_transactional_opt_in : traits.whatsappTransactionalOptIn || true,
        created_at: new Date().toISOString()
    };
    
    // Add optional traits if provided
    if (traits.firstName) userTraits.first_name = traits.firstName;
    if (traits.lastName) userTraits.last_name = traits.lastName;
    if (traits.fullName) userTraits.name = traits.fullName;
    
    // Store in global state
    window.IU_UserState.isLoggedIn = true;
    window.IU_UserState.userId = userId;
    window.IU_UserState.userTraits = userTraits;
    
    // Send only ONE email property per identify call (realistic scenario)
    // Segment's ID Resolution will merge profiles when multiple emails are detected
    if (userTraits.email_personal) {
        userTraits.email = userTraits.email_personal; // Only send personal email
    }
    
    // Call Segment identify with only ONE email property
    analytics.identify(userId, userTraits);
    console.log('👤 User Identified with single email:', userId, userTraits.email);
    
    // Store global state to simulate different login scenarios
    window.IU_UserState.userId = userId;
    window.IU_UserState.userTraits = userTraits;
    
    // Track the login/signup event
    analytics.track('User Logged In', {
        user_id: userId,
        method: traits.signupMethod || 'email',
        timestamp: new Date().toISOString()
    });
}

/**
 * LOGOUT AND RESET
 * Called when user explicitly logs out
 */
function resetAnalytics() {
    console.log('🚪 User logged out - resetting analytics');
    
    // Track logout event before reset
    if (window.IU_UserState.userId) {
        analytics.track('User Logged Out', {
            user_id: window.IU_UserState.userId,
            session_duration: Date.now() - window.IU_UserState.sessionStartTime,
            timestamp: new Date().toISOString()
        });
    }
    
    // Reset Segment state
    analytics.reset();
    
    // Clear global state
    window.IU_UserState = {
        isLoggedIn: false,
        userId: null,
        userTraits: {},
        sessionStartTime: Date.now()
    };
}

// Churn Risk Signal tracking has been removed as requested
// Churn prevention now focuses on engagement tracking and user behavior analysis

/**
 * ENGAGEMENT TRACKING
 * Tracks various engagement signals for churn prevention
 */
function trackEngagementEvent(eventType, details = {}) {
    const eventData = {
        event_type: eventType, // 'mycampus_login', 'video_watched', 'assignment_submitted'
        timestamp: new Date().toISOString(),
        session_id: generateSessionId(),
        ...details
    };
    
    if (window.IU_UserState.userId) {
        eventData.user_id = window.IU_UserState.userId;
    }
    
    analytics.track('Engagement Event', eventData);
    console.log('💡 Engagement Event:', eventData);
}

/**
 * ONBOARDING TRACKING
 * Tracks onboarding progress using step name as event name
 */
function trackOnboardingStep(step, completed = false, metadata = {}) {
    // Convert step names to proper event names
    const stepEventNames = {
        'account_created': 'Account Created',
        'profile_completed': 'Profile Completed', 
        'program_selected': 'Program Selected',
        'first_login': 'First Login',
        'mycampus_login': 'MyCampus Login',
        'course_enrollment': 'Course Enrolled',
        'course_selection': 'Course Selected',
        'profile_setup': 'Profile Setup'
    };
    
    const eventName = stepEventNames[step] || step.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    const eventData = {
        completed: completed,
        timestamp: new Date().toISOString(),
        step: step,
        ...metadata
    };
    
    if (window.IU_UserState.userId) {
        eventData.user_id = window.IU_UserState.userId;
    }
    
    analytics.track(eventName, eventData);
    console.log(`🌟 ${eventName}:`, eventData);
}

/**
 * UTILITY FUNCTIONS
 */
function generateSessionId() {
    return 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

/**
 * AUTOMATIC TRACKING SETUP
 * Sets up automatic tracking for various user interactions
 */
function setupAutomaticTracking() {
    // Track clicks on programme cards
    document.addEventListener('click', function(event) {
        const target = event.target.closest('.category-card');
        if (target) {
            const category = target.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
            if (category) {
                trackProgramViewed(`category_${category}`, category, category);
            }
        }
        
        // Track navigation clicks
        const navLink = event.target.closest('nav a');
        if (navLink) {
            const linkText = navLink.textContent.trim();
            analytics.track('Navigation Click', {
                link_text: linkText,
                link_url: navLink.href,
                timestamp: new Date().toISOString()
            });
        }
    });
    
    // Track form interactions
    document.addEventListener('focus', function(event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') {
            analytics.track('Form Field Focused', {
                field_name: event.target.name || event.target.id,
                field_type: event.target.type || event.target.tagName.toLowerCase(),
                timestamp: new Date().toISOString()
            });
        }
    });
    
    // Track scroll depth for engagement
    let maxScrollDepth = 0;
    window.addEventListener('scroll', function() {
        const scrollPercentage = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercentage > maxScrollDepth && scrollPercentage % 25 === 0) {
            maxScrollDepth = scrollPercentage;
            analytics.track('Scroll Depth', {
                depth_percentage: scrollPercentage,
                timestamp: new Date().toISOString()
            });
        }
    });
}

/**
 * DEMO-SPECIFIC HELPER FUNCTIONS
 * These functions demonstrate the tracking in action for the Mobile Viking demo
 */
function demoChurnPrevention() {
    console.log('🎬 Demo: Churn Prevention Scenario');
    
    // Track engagement patterns for churn prevention
    setTimeout(() => {
        trackEngagementEvent('no_mycampus_login', {
            days_since_login: 8,
            program: 'MBA',
            semester: '2024_spring'
        });
    }, 2000);
    
    setTimeout(() => {
        trackInvoiceViewed('inv_2024_001', 2500, 'overdue');
    }, 4000);
}

function demoOnboardingJourney() {
    console.log('🎬 Demo: New Student Onboarding Journey');
    
    // Simulate onboarding steps - each will create its own event name
    const steps = [
        'account_created',
        'profile_completed',
        'program_selected',
        'mycampus_login',
        'course_enrollment'
    ];
    
    steps.forEach((step, index) => {
        setTimeout(() => {
            trackOnboardingStep(step, true, {
                step_number: index + 1,
                total_steps: steps.length
            });
        }, (index + 1) * 1000);
    });
}

function demoEventTracking() {
    console.log('🎬 Demo: Event Participant Tracking');
    
    // Simulate Event journey
    setTimeout(() => {
        trackEventRSVP('event_demo_001', 'Demo Business Programme Info', '2024-12-20T18:00:00Z');
    }, 1000);
    
    setTimeout(() => {
        analytics.track('Event Reminder Sent', {
            event_id: 'event_demo_001',
            reminder_type: 'email',
            hours_before: 24,
            timestamp: new Date().toISOString()
        });
    }, 3000);
    
    setTimeout(() => {
        analytics.track('Event Attended', {
            event_id: 'event_demo_001',
            attendance_duration_minutes: 85,
            engagement_score: 0.8,
            timestamp: new Date().toISOString()
        });
    }, 5000);
}

/**
 * SIMULATE IU SYSTEM LOGIN
 * This simulates when the same user logs into a different IU system using their IU email
 * Segment's ID Resolution should merge these profiles
 */
function simulateIUSystemLogin(iuEmail, userId) {
    const iuTraits = {
        email: iuEmail,  // Only IU email this time
        system: 'myCampus',
        login_method: 'sso',
        timestamp: new Date().toISOString()
    };
    
    analytics.identify(userId, iuTraits);
    console.log('🎓 IU System Login - User identified with IU email only:', userId, iuEmail);
    console.log('🔄 ID Resolution will merge this with personal email profile');
    
    analytics.track('System Login', {
        system: 'myCampus',
        email_type: 'institutional',
        user_id: userId
    });
}

/**
 * DEMONSTRATE ID RESOLUTION
 * Shows how multiple emails get resolved to same profile
 */
function demonstrateIDResolution() {
    if (!window.IU_UserState.userId) {
        console.log('❌ Please sign up first to see ID Resolution demo');
        return;
    }
    
    const userId = window.IU_UserState.userId;
    const personalEmail = window.IU_UserState.userTraits.email;
    const iuEmail = personalEmail.replace('@', '@student.iu.org');
    
    console.log('🎬 ID Resolution Demo Starting...');
    console.log(`📧 Personal Email: ${personalEmail}`);
    console.log(`🎓 IU Email: ${iuEmail}`);
    
    setTimeout(() => {
        console.log('\n--- Login to myCampus with IU email ---');
        simulateIUSystemLogin(iuEmail, userId);
    }, 2000);
    
    setTimeout(() => {
        console.log('\n✅ ID Resolution Demo Complete!');
        console.log('📊 Both emails now appear in same Segment profile through ID Resolution');
    }, 4000);
}

// Make functions available globally for HTML onclick handlers
window.trackPageView = trackPageView;
window.trackProgramViewed = trackProgramViewed;
window.trackApplicationStarted = trackApplicationStarted;
window.trackApplicationSubmitted = trackApplicationSubmitted;
window.trackEventRSVP = trackEventRSVP;
window.trackConsentUpdated = trackConsentUpdated;
window.trackContactPreferenceSet = trackContactPreferenceSet;
window.trackInvoiceViewed = trackInvoiceViewed;
window.identifyUser = identifyUser;
window.resetAnalytics = resetAnalytics;
window.simulateIUSystemLogin = simulateIUSystemLogin;
window.demonstrateIDResolution = demonstrateIDResolution;
// Churn risk signal tracking removed as requested
window.trackEngagementEvent = trackEngagementEvent;
window.trackOnboardingStep = trackOnboardingStep;

// Demo functions for presentation
window.demoChurnPrevention = demoChurnPrevention;
window.demoOnboardingJourney = demoOnboardingJourney;
window.demoEventTracking = demoEventTracking;
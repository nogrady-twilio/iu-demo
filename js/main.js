/**
 * Main JavaScript functionality for IU.org demo
 * Handles UI interactions, authentication, and Segment tracking integration
 */

// Application state
let currentUser = null;
let isLoggedIn = false;

/**
 * Generate a simple hash from email for consistent user_id across devices
 * This ensures the same email always generates the same user_id
 */
function hashEmail(email) {
    let hash = 0;
    const normalizedEmail = email.toLowerCase().trim();
    
    for (let i = 0; i < normalizedEmail.length; i++) {
        const char = normalizedEmail.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert to positive hex string for cleaner user_id
    return 'user_' + Math.abs(hash).toString(16);
}

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 IU.org Demo Application Initialized');
    console.log('✅ Segment Analytics ready for demo');
    console.log('📊 Use runDemoScenarios() to see all tracking events');
    
    // Set up event listeners
    setupEventListeners();
    
    // Check for existing session
    checkExistingSession();
    
    // Set up mobile navigation
    setupMobileNavigation();
    
    // Demo indicator removed per request
});

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Login/Signup buttons
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', showLogin);
    }
    
    if (signupBtn) {
        signupBtn.addEventListener('click', showSignup);
    }
    
    // Modal close buttons
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });
    
    // Modal background clicks
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    });
    
    // Form submissions
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const consentForm = document.getElementById('consentForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    if (consentForm) {
        consentForm.addEventListener('submit', handleConsentUpdate);
    }
}

/**
 * Mobile navigation setup
 */
function setupMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
}

/**
 * Check for existing session (simulate)
 */
function checkExistingSession() {
    const savedUser = localStorage.getItem('iu_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isLoggedIn = true;
        showDashboard();
        
        // Re-identify user in Segment
        identifyUser(currentUser.userId, currentUser);
        
        trackEngagementEvent('session_resumed', {
            user_id: currentUser.userId
        });
    }
}

/**
 * Show login modal
 */
function showLogin() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'block';
        
        // Track modal view
        analytics.track('Modal Viewed', {
            modal_type: 'login',
            timestamp: new Date().toISOString()
        });
    }
}

/**
 * Show signup modal
 */
function showSignup() {
    const modal = document.getElementById('signupModal');
    if (modal) {
        modal.style.display = 'block';
        
        // Track modal view
        analytics.track('Modal Viewed', {
            modal_type: 'signup',
            timestamp: new Date().toISOString()
        });
    }
}

/**
 * Show consent settings modal
 */
function showConsentSettings() {
    const modal = document.getElementById('consentModal');
    if (modal && currentUser) {
        // Pre-populate with current settings
        populateConsentForm(currentUser);
        modal.style.display = 'block';
        
        analytics.track('Modal Viewed', {
            modal_type: 'consent_settings',
            user_id: currentUser.userId,
            timestamp: new Date().toISOString()
        });
    }
}

/**
 * Close all modals
 */
function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

/**
 * Handle login form submission
 */
function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    
    // Generate consistent user_id from hashed email for cross-device recognition
    const userId = hashEmail(email);
    
    // Create user object with existing data (simulate database lookup)
    currentUser = {
        userId: userId,
        email_personal: email,
        email_iu: email.replace('@', '@student.iu.org'),
        firstName: 'Demo',
        lastName: 'Student',
        phone: '+49123456789',
        program: 'business_mba',
        semester: '2024_spring',
        preferred_channel: 'email',
        email_marketing_opt_in: true,
        email_transactional_opt_in: true,
        whatsapp_marketing_opt_in: false,
        whatsapp_transactional_opt_in: true
    };
    
    // Track login
    identifyUser(userId, currentUser);
    
    // Show cross-device recognition in console
    console.log(`🔗 Cross-Device Recognition: Email "${email}" → User ID "${userId}"`);
    console.log(`📧 Personal Email: ${currentUser.email_personal}`);
    console.log(`🎓 IU Email: ${currentUser.email_iu}`);
    console.log('💡 Same user_id used across all devices and IU systems');
    console.log('🎯 Try: demonstrateIDResolution() to see email merging in action');
    
    // Track onboarding step - will create "MyCampus Login" event
    trackOnboardingStep('mycampus_login', true, {
        login_method: 'email_password'
    });
    
    // Track engagement
    trackEngagementEvent('mycampus_login', {
        login_method: 'email_password'
    });
    
    // Save to localStorage (simulate session)
    localStorage.setItem('iu_user', JSON.stringify(currentUser));
    
    isLoggedIn = true;
    closeModal();
    showDashboard();
    
    // Show success message
    showNotification('Welcome back! You\'re now logged in to myCampus.', 'success');
}

/**
 * Handle signup form submission
 */
function handleSignup(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const userData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email_personal: formData.get('emailPersonal'),
        phone: formData.get('phone'),
        program: formData.get('program'),
        semester: formData.get('semester'),
        preferred_channel: formData.get('preferredChannel'),
        email_marketing_opt_in: formData.get('emailMarketingOptIn') === 'on',
        email_transactional_opt_in: true, // Always true
        whatsapp_marketing_opt_in: formData.get('whatsappMarketingOptIn') === 'on',
        whatsapp_transactional_opt_in: true // Always true
    };
    
    // Generate consistent user_id from hashed email for cross-device recognition
    const userId = hashEmail(userData.email_personal);
    userData.userId = userId;
    
    // Generate IU email address for students
    const emailPrefix = userData.email_personal.split('@')[0];
    userData.email_iu = `${emailPrefix}@student.iu.org`;
    
    // Track application started
    trackApplicationStarted(userData.program, getProgramName(userData.program));
    
    // Identify user in Segment
    identifyUser(userId, userData);
    
    // Show cross-device recognition in console
    console.log(`🔗 Cross-Device Recognition: Email "${userData.email_personal}" → User ID "${userId}"`);
    console.log(`🎓 Generated IU Email: ${userData.email_iu}`);
    console.log('💡 Same user_id will be used across all devices and IU systems');
    console.log('🎯 Try: demonstrateIDResolution() to see email merging in action');
    
    // Track application submitted
    trackApplicationSubmitted(userData.program, getProgramName(userData.program), userId);
    
    // Track onboarding steps - will create "Account Created" and "Profile Completed" events
    trackOnboardingStep('account_created', true, {
        program: userData.program,
        semester: userData.semester
    });
    
    trackOnboardingStep('profile_completed', true);
    
    // Track consent settings
    trackConsentUpdated('email', 'marketing', userData.email_marketing_opt_in, userId);
    trackConsentUpdated('whatsapp', 'marketing', userData.whatsapp_marketing_opt_in, userId);
    trackContactPreferenceSet(userData.preferred_channel, userId);
    
    // Save user data
    currentUser = userData;
    localStorage.setItem('iu_user', JSON.stringify(userData));
    
    isLoggedIn = true;
    closeModal();
    showDashboard();
    
    // Show success message
    showNotification('Application submitted successfully! Welcome to IU.', 'success');
    
    // Simulate onboarding journey for demo
    setTimeout(() => demoOnboardingJourney(), 2000);
}

/**
 * Handle consent form updates
 */
function handleConsentUpdate(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    // Update user preferences
    const oldPreferences = { ...currentUser };
    
    currentUser.email_marketing_opt_in = formData.get('emailMarketingOptIn') === 'on';
    currentUser.whatsapp_marketing_opt_in = formData.get('whatsappMarketingOptIn') === 'on';
    currentUser.preferred_channel = formData.get('preferredChannel');
    
    // Track consent changes
    if (oldPreferences.email_marketing_opt_in !== currentUser.email_marketing_opt_in) {
        trackConsentUpdated('email', 'marketing', currentUser.email_marketing_opt_in, currentUser.userId);
    }
    
    if (oldPreferences.whatsapp_marketing_opt_in !== currentUser.whatsapp_marketing_opt_in) {
        trackConsentUpdated('whatsapp', 'marketing', currentUser.whatsapp_marketing_opt_in, currentUser.userId);
    }
    
    if (oldPreferences.preferred_channel !== currentUser.preferred_channel) {
        trackContactPreferenceSet(currentUser.preferred_channel, currentUser.userId);
    }
    
    // Re-identify with updated traits
    identifyUser(currentUser.userId, currentUser);
    
    // Update localStorage
    localStorage.setItem('iu_user', JSON.stringify(currentUser));
    
    closeModal();
    showNotification('Preferences updated successfully!', 'success');
}

/**
 * Populate consent form with current user data
 */
function populateConsentForm(user) {
    const emailMarketing = document.getElementById('updateEmailMarketing');
    const whatsappMarketing = document.getElementById('updateWhatsAppMarketing');
    const preferredChannel = document.getElementById('updatePreferredChannel');
    
    if (emailMarketing) {
        emailMarketing.checked = user.email_marketing_opt_in;
    }
    
    if (whatsappMarketing) {
        whatsappMarketing.checked = user.whatsapp_marketing_opt_in;
    }
    
    if (preferredChannel) {
        preferredChannel.value = user.preferred_channel;
    }
}

/**
 * Show user dashboard
 */
function showDashboard() {
    // Hide main sections
    document.body.classList.add('logged-in');
    
    // Show dashboard
    const dashboard = document.getElementById('userDashboard');
    const userName = document.getElementById('userName');
    
    if (dashboard) {
        dashboard.style.display = 'block';
    }
    
    if (userName && currentUser) {
        userName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    }
    
    // Update application status
    updateApplicationStatus();
    
    // Load user's events
    loadUserEvents();
}

/**
 * Update application status display
 */
function updateApplicationStatus() {
    const statusElement = document.getElementById('applicationStatus');
    if (statusElement && currentUser) {
        const programName = getProgramName(currentUser.program);
        statusElement.innerHTML = `
            <div class="status-item">
                <strong>Program:</strong> ${programName}
            </div>
            <div class="status-item">
                <strong>Start:</strong> ${getSemesterName(currentUser.semester)}
            </div>
            <div class="status-item">
                <strong>Status:</strong> <span class="status-active">Application Approved</span>
            </div>
        `;
    }
}

/**
 * Load user's events
 */
function loadUserEvents() {
    const eventsContainer = document.getElementById('userEvents');
    if (eventsContainer) {
        eventsContainer.innerHTML = `
            <div class="event-item">
                <strong>Business & Management Info Session</strong><br>
                <small>December 15, 2024 - RSVP'd</small>
            </div>
        `;
    }
}

/**
 * Logout function
 */
function logout() {
    // Track logout
    if (currentUser) {
        analytics.track('User Logged Out', {
            user_id: currentUser.userId,
            session_duration: Date.now() - window.IU_UserState.sessionStartTime,
            timestamp: new Date().toISOString()
        });
    }
    
    // Reset analytics
    resetAnalytics();
    
    // Clear application state
    currentUser = null;
    isLoggedIn = false;
    localStorage.removeItem('iu_user');
    
    // Hide dashboard and show main content
    document.body.classList.remove('logged-in');
    const dashboard = document.getElementById('userDashboard');
    if (dashboard) {
        dashboard.style.display = 'none';
    }
    
    showNotification('You have been logged out successfully.', 'info');
}

/**
 * Program category view handler
 */
function viewProgramCategory(category) {
    trackProgramViewed(`category_${category}`, getCategoryName(category), category);
    
    // Simulate navigation to category page
    showNotification(`Viewing ${getCategoryName(category)} programmes...`, 'info');
    
    // Track engagement
    trackEngagementEvent('category_browsed', {
        category: category
    });
}

/**
 * Specific program view handler
 */
function viewProgram(programId, programName) {
    trackProgramViewed(programId, programName);
    
    showNotification(`Viewing ${programName} programme details...`, 'info');
    
    // Simulate showing program details
    setTimeout(() => {
        if (confirm(`Interested in applying for ${programName}?`)) {
            startApplication(programId, programName);
        }
    }, 1000);
}

/**
 * Start application process
 */
function startApplication(programId = null, programName = null) {
    if (!programId) {
        // Show signup modal if no specific program
        showSignup();
        return;
    }
    
    trackApplicationStarted(programId, programName);
    
    if (isLoggedIn) {
        showNotification('Application process started!', 'success');
        // In a real app, navigate to application form
    } else {
        showSignup();
    }
}

/**
 * View programs handler
 */
function viewPrograms() {
    trackEngagementEvent('programs_explored');
    
    // Scroll to programs section
    const programsSection = document.getElementById('programs');
    if (programsSection) {
        programsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * RSVP to Event
 */
function rsvpEvent(eventId, title, startsAt) {
    if (!isLoggedIn) {
        showNotification('Please log in to RSVP for events.', 'warning');
        showLogin();
        return;
    }
    
    trackEventRSVP(eventId, title, startsAt, currentUser?.userId);
    
    showNotification(`Successfully RSVP'd for "${title}"!`, 'success');
    
    // Simulate follow-up tracking
    setTimeout(() => {
        analytics.track('Event Confirmation Email Sent', {
            event_id: eventId,
            user_id: currentUser?.userId,
            timestamp: new Date().toISOString()
        });
    }, 1000);
    
    // Demo Event tracking workflow
    setTimeout(() => demoEventTracking(), 3000);
}

/**
 * Utility Functions
 */
function getProgramName(programId) {
    const programs = {
        'business_mba': 'Master of Business Administration (MBA)',
        'business_marketing': 'Bachelor of Marketing',
        'cs_software': 'Bachelor of Software Engineering',
        'cs_data': 'Master of Data Science',
        'health_psychology': 'Bachelor of Psychology',
        'design_ux': 'Bachelor of UX/UI Design'
    };
    return programs[programId] || programId;
}

function getCategoryName(category) {
    const categories = {
        'business': 'Business & Management',
        'tech': 'Computer Science & IT',
        'health': 'Health & Social Work',
        'design': 'Design & Architecture'
    };
    return categories[category] || category;
}

function getSemesterName(semester) {
    const semesters = {
        '2024_spring': 'Spring 2024',
        '2024_summer': 'Summer 2024',
        '2024_fall': 'Fall 2024',
        '2025_spring': 'Spring 2025'
    };
    return semesters[semester] || semester;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        maxWidth: '300px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
    });
    
    // Set background color based on type
    const colors = {
        success: '#48bb78',
        warning: '#ed8936',
        error: '#f56565',
        info: '#4299e1'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
    
    // Track notification display
    analytics.track('Notification Displayed', {
        message: message,
        type: type,
        timestamp: new Date().toISOString()
    });
}

// Demo functions for presentation
function runDemoScenarios() {
    console.log('🎬 Running all demo scenarios...');
    
    setTimeout(() => {
        console.log('🎬 Starting Churn Prevention Demo...');
        demoChurnPrevention();
    }, 2000);
    
    setTimeout(() => {
        console.log('🎬 Starting Onboarding Journey Demo...');
        demoOnboardingJourney();
    }, 8000);
    
    setTimeout(() => {
        console.log('🎬 Starting Event Tracking Demo...');
        demoEventTracking();
    }, 15000);
}

// Demo indicator function removed per request

// Make functions available globally
window.showLogin = showLogin;
window.showSignup = showSignup;
window.showConsentSettings = showConsentSettings;
window.logout = logout;
window.viewProgramCategory = viewProgramCategory;
window.viewProgram = viewProgram;
window.startApplication = startApplication;
window.viewPrograms = viewPrograms;
window.rsvpEvent = rsvpEvent;
window.runDemoScenarios = runDemoScenarios;
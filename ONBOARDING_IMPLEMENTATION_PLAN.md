# User Onboarding Flow Implementation Plan

## Overview
Implement a 3-step onboarding flow that appears after user login/signup to collect comprehensive profile information.

## Flow Structure

### Step 1: Personal Information
- Full Name
- Email
- Phone number
- Address
- Open to relocate? (Yes/No toggle)
- Country of work (Dropdown)
- Visa sponsorship required? (Yes/No toggle)

### Step 2: Job Preferences & Compensation
- Primary Job Title (Max 3) - Multi-select or tags
- Total years of Experience (Number input)
- Seniority level (Radio/Select: Intern, Junior, Mid level, Senior/Lead)
- Job type (Multi-select: Full time, Part-time, Contract, Internship)
- Remote / Hybrid office (Select: Remote, Hybrid, On-site)
- Location Preference (Text input with "Remote only" toggle)
- Compensation - Min acceptable salary (Number input)
- Preferred Salary Range (Min-Max inputs)
- Equity Preference (Yes/No toggle)

### Step 3: Documents & Links
- Resume (File upload)
- Cover letter (File upload)
- Portfolio website (URL input)
- Github (URL input)
- LinkedIn Profile (URL input)
- Personal blog (URL input)

## Implementation Steps

### Phase 1: State Management Updates
1. **Update authSlice.js**
   - Add `isOnboardingComplete` field to user object
   - Add `setOnboardingComplete` action
   - Store onboarding status in localStorage

### Phase 2: Create Onboarding Components
1. **Create `/app/onboarding/page.js`**
   - Main onboarding page with step navigation
   - Progress indicator (Step 1 of 3, Step 2 of 3, Step 3 of 3)
   - Step navigation (Previous/Next buttons)

2. **Create `/components/onboarding/OnboardingStep1.jsx`**
   - Personal Information form
   - Form validation
   - Save to state/context

3. **Create `/components/onboarding/OnboardingStep2.jsx`**
   - Job Preferences form
   - Complex inputs (multi-select, ranges, toggles)
   - Form validation

4. **Create `/components/onboarding/OnboardingStep3.jsx`**
   - Documents & Links form
   - File upload handlers
   - URL validation

5. **Create `/components/onboarding/OnboardingContext.jsx`**
   - Context to manage form data across steps
   - Form state management
   - Submit handler (will call API later)

### Phase 3: Update Authentication Flow
1. **Update Login.jsx**
   - After successful login, check `user.isOnboardingComplete`
   - If false, redirect to `/onboarding`
   - If true, redirect to `/dashboard`

2. **Update Signup.jsx**
   - After successful signup, always redirect to `/onboarding`
   - New users should always complete onboarding

3. **Update DashboardLayout**
   - Add check for onboarding completion
   - If not complete, redirect to `/onboarding`
   - Protect dashboard routes

### Phase 4: Onboarding Page Features
1. **Progress Indicator**
   - Visual progress bar showing current step
   - Step numbers (1/3, 2/3, 3/3)

2. **Navigation**
   - "Previous" button (disabled on step 1)
   - "Next" button (validates current step)
   - "Skip" option (optional, for later steps)
   - "Save & Continue" button

3. **Form Validation**
   - Required field validation per step
   - Email/URL format validation
   - File type/size validation for uploads

4. **Data Persistence**
   - Save form data to localStorage (temporary)
   - Restore data if user navigates back
   - Submit all data on final step

### Phase 5: API Integration Points (For Later)
1. **Onboarding Submit Endpoint**
   - POST `/api/user/onboarding`
   - Send all collected data
   - Mark user as onboarding complete
   - Update user profile

2. **File Upload Endpoints**
   - POST `/api/user/upload/resume`
   - POST `/api/user/upload/cover-letter`
   - Handle file storage

## File Structure
```
app/
  onboarding/
    page.js                    # Main onboarding page
components/
  onboarding/
    OnboardingStep1.jsx        # Personal Information
    OnboardingStep2.jsx        # Job Preferences
    OnboardingStep3.jsx        # Documents & Links
    OnboardingContext.jsx     # Form state management
    OnboardingProgress.jsx    # Progress indicator component
store/
  authSlice.js                # Updated with onboarding status
```

## Routing Logic

### After Login:
```
Login Success → Check user.isOnboardingComplete
  ├─ false → Redirect to /onboarding
  └─ true → Redirect to /dashboard
```

### After Signup:
```
Signup Success → Always redirect to /onboarding
```

### Dashboard Access:
```
Dashboard Access → Check user.isOnboardingComplete
  ├─ false → Redirect to /onboarding
  └─ true → Show dashboard
```

### Onboarding Completion:
```
Onboarding Submit → Mark complete → Redirect to /dashboard
```

## Technical Considerations

1. **No Code Breaking**
   - All changes are additive
   - Existing routes remain functional
   - Backward compatible with existing users

2. **State Management**
   - Use Context API for form state across steps
   - Redux for authentication/onboarding status
   - localStorage for temporary form persistence

3. **Form Validation**
   - Use Formik + Yup for validation
   - Consistent with existing auth forms
   - Show validation errors inline

4. **Responsive Design**
   - Mobile-friendly multi-step form
   - Consistent with existing UI patterns
   - Material-UI components

5. **Error Handling**
   - Handle API errors gracefully
   - Show user-friendly error messages
   - Allow retry on failure

## Implementation Order

1. ✅ Create plan document
2. ⏳ Update authSlice with onboarding status
3. ⏳ Create onboarding context and state management
4. ⏳ Create Step 1 component (Personal Information)
5. ⏳ Create Step 2 component (Job Preferences)
6. ⏳ Create Step 3 component (Documents & Links)
7. ⏳ Create main onboarding page with navigation
8. ⏳ Update Login redirect logic
9. ⏳ Update Signup redirect logic
10. ⏳ Update DashboardLayout protection
11. ⏳ Add progress indicator
12. ⏳ Test complete flow
13. ⏳ Add API integration (later)

## Testing Checklist

- [ ] New user signup → redirects to onboarding
- [ ] Existing user login (no onboarding) → redirects to onboarding
- [ ] Existing user login (completed onboarding) → goes to dashboard
- [ ] Onboarding step navigation (Next/Previous)
- [ ] Form validation on each step
- [ ] Data persistence across steps
- [ ] Dashboard protection (redirects if not complete)
- [ ] Onboarding completion → redirects to dashboard
- [ ] Mobile responsiveness
- [ ] File upload functionality


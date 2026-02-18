# Google Places API Setup for Address Autocomplete

The onboarding form uses **Places API (New)** REST API for address autocomplete functionality. This allows users to search for addresses by typing partial information (e.g., "20a esther") and get suggestions with properly parsed address components.

## Setup Instructions

1. **Get a Google Places API (New) Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the **"Places API (New)"** for your project (NOT the legacy Places API)
   - Go to "Credentials" and create an API key
   - (Optional) Restrict the API key to only allow Places API (New) requests

2. **Add the API Key to Backend Environment Variables:**
   - Create or update your `.env` file in the `applyforme_backend` directory
   - Add the following line:
     ```
     GOOGLE_PLACES_API_KEY=your_api_key_here
     ```
   - **Note:** The API key is stored in the backend, not the frontend, for security

3. **Restart the Backend Server:**
   - After adding the API key, restart your backend server for the changes to take effect

## Features

- **Address Autocomplete:** As users type, Places API (New) provides address suggestions via backend API
- **Automatic Parsing:** When an address is selected, it's automatically parsed into:
  - House Number
  - Street Name
  - Suburb
  - State
  - Postcode
- **Australia Focus:** The autocomplete is restricted to Australian addresses
- **Backend API:** Uses REST API calls from backend (no Maps JavaScript API required)
- **Fallback:** If the API key is not configured, users can still manually enter addresses

## Architecture

- **Frontend:** Makes requests to `/api/address/suggestions` and `/api/address/details`
- **Backend:** Uses Places API (New) REST API to fetch suggestions and place details
- **Security:** API key is stored server-side, not exposed to frontend

## Usage

Users can:
1. Start typing an address (e.g., "20a esther")
2. Select an address from the dropdown suggestions
3. The address components are automatically populated and displayed below the input field
4. All address fields are saved separately in the database

## Cost

Google Places API has a free tier:
- $200 free credit per month
- Autocomplete requests: $2.83 per 1,000 requests
- After free tier: Pay-as-you-go pricing

For most applications, the free tier should be sufficient.


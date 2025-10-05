# Firebase Firestore Setup Guide

Your app is now connected to Firebase! Follow these steps to complete the setup:

## 1. Enable Phone Authentication

1. Go to your [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** → **Sign-in method**
4. Enable **Phone** authentication
5. Add your Replit domain to **Authorized domains** (found in Authentication → Settings)
   - Add both your dev URL and production URL

## 2. Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a region close to you

## 3. Add Users Collection

Create a collection called `users` with documents structured as:

**Document ID:** Phone number (without +91, e.g., "9876543210")

**Fields:**
```
name: "Student Name" (string)
room: "A-204" (string)
phone: "9876543210" (string)
```

Example documents:
```
Document ID: 9876543210
{
  name: "Rahul Kumar",
  room: "A-204",
  phone: "9876543210"
}

Document ID: 9123456789
{
  name: "Priya Singh",
  room: "B-101",
  phone: "9123456789"
}
```

## 4. Add Slots Collection

Create a collection called `slots` with documents for each time slot:

**Document ID:** Auto-generated or custom (e.g., "slot1", "slot2")

**Fields:**
```
time: "08:00 AM" (string)
date: "Today, Oct 5" (string)
available: true (boolean)
bookedBy: "" (string, optional - room number)
```

Example documents:
```
Document ID: slot1
{
  time: "08:00 AM",
  date: "Today, Oct 5",
  available: true
}

Document ID: slot2
{
  time: "10:00 AM",
  date: "Today, Oct 5",
  available: true
}

Document ID: slot3
{
  time: "12:00 PM",
  date: "Today, Oct 5",
  available: false,
  bookedBy: "A-204"
}
```

Create 8-12 slots for different times throughout the day.

## 5. Update Firestore Rules (Production)

For production, update your Firestore rules to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - read only
    match /users/{phone} {
      allow read: if request.auth != null;
      allow write: if false; // Only admins should create users
    }
    
    // Slots collection
    match /slots/{slotId} {
      allow read: if request.auth != null;
      allow update: if request.auth != null 
        && request.resource.data.keys().hasOnly(['available', 'bookedBy'])
        && request.resource.data.available == false;
    }
  }
}
```

## Testing the App

1. Add your phone number to the `users` collection
2. Try logging in with your phone number
3. You'll receive an OTP via SMS
4. After verification, you should see the dashboard with available slots
5. Try booking a slot - it should update in real-time!

## Notes

- Phone authentication requires a valid phone number that can receive SMS
- Test mode Firestore rules allow open access - secure them for production
- Real-time updates work automatically through Firestore listeners

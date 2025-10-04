# Profile Photo Upload Feature

This document describes the profile photo upload functionality that has been implemented in the SEM application.

## Overview

Users can now upload profile photos that are stored in the backend and displayed in their dashboard. The photos are stored in the `backend/uploads` directory and the file path is saved in the MongoDB user document.

## Backend Implementation

### Files Modified/Created:

1. **`backend/middlewares/upload.middleware.js`** - New file
   - Configures multer for file uploads
   - Validates file types (images only: jpeg, jpg, png, gif, webp)
   - Sets file size limit (5MB)
   - Generates unique filenames

2. **`backend/controllers/dashboard.controller.js`** - Modified
   - Added `uploadProfilePhoto` function
   - Added `getProfilePhoto` function
   - Handles file upload, validation, and database updates
   - Manages old photo deletion when new photo is uploaded

3. **`backend/routes/dasboard.route.js`** - Modified
   - Added POST route: `/user/:email/upload-photo`
   - Added GET route: `/user/:email/profile-photo`

4. **`backend/index.js`** - Modified
   - Added static file serving for uploads directory
   - Photos are accessible via `http://localhost:3000/uploads/filename`

5. **`backend/models/user.model.js`** - Already had profilePhoto field
   - Field stores the relative path to the uploaded photo

## Frontend Implementation

### Files Modified:

1. **`frontend/sem-angular/src/app/services/dash-service.ts`** - Modified
   - Added `uploadProfilePhoto()` method for file uploads
   - Added `getProfilePhotoUrl()` method for photo URL generation

2. **`frontend/sem-angular/src/app/user-dashboard/user-dashboard.ts`** - Modified
   - Added file selection handling (`onFileSelected()`)
   - Added photo upload functionality (`uploadProfilePhoto()`)
   - Added photo URL generation (`getProfilePhotoUrl()`)
   - Added file validation (type and size)

3. **`frontend/sem-angular/src/app/user-dashboard/user-dashboard.html`** - Modified
   - Added profile photo display in edit mode
   - Added file input for photo selection
   - Added upload button
   - Updated photo display to use proper URLs

4. **`frontend/sem-angular/src/app/user-dashboard/user-dashboard.css`** - Modified
   - Added styles for file input and upload button
   - Added responsive design for mobile devices
   - Added hover effects and transitions

## API Endpoints

### Upload Profile Photo
- **Method**: POST
- **URL**: `/api/dash/user/:email/upload-photo`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: FormData with `profilePhoto` field
- **Response**: Updated user object with new photo path

### Get Profile Photo
- **Method**: GET
- **URL**: `/api/dash/user/:email/profile-photo`
- **Response**: Image file or 404 if not found

## Usage

1. **Upload a Photo**:
   - Click "Edit Profile" button
   - In the Profile Photo section, click "Choose Photo"
   - Select an image file (JPEG, PNG, GIF, or WebP)
   - Click "Upload Photo" button
   - Photo will be uploaded and displayed immediately

2. **View Photo**:
   - Profile photos are displayed in the dashboard header
   - Photos are also shown in the Profile Photo field when not in edit mode

## File Validation

- **Allowed Types**: JPEG, JPG, PNG, GIF, WebP
- **Maximum Size**: 5MB
- **File Naming**: `profile-{timestamp}-{random}.{extension}`

## Security Features

- File type validation on both frontend and backend
- File size limits
- Authentication required for uploads
- Old photos are automatically deleted when new ones are uploaded
- Unique filename generation to prevent conflicts

## Error Handling

- Frontend validation for file type and size
- Backend error handling with proper HTTP status codes
- User-friendly error messages
- Automatic cleanup of failed uploads

## Dependencies Added

- **Backend**: `multer` for file upload handling
- **Frontend**: No new dependencies (uses existing Angular HttpClient)

## File Structure

```
backend/
├── uploads/                 # Directory for uploaded photos
├── middlewares/
│   └── upload.middleware.js # Multer configuration
├── controllers/
│   └── dashboard.controller.js # Photo upload logic
└── routes/
    └── dasboard.route.js   # Photo upload routes
```

The implementation is complete and ready for use!

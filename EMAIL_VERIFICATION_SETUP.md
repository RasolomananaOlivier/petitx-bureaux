# Email Verification Setup

This document explains how to set up email verification for leads using Gmail SMTP.

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Gmail SMTP Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# Application URL (for verification links)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Gmail App Password Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Name it "PetitsBureaux"
   - Copy the generated 16-character password
3. **Use the app password** in `GMAIL_APP_PASSWORD` (not your regular Gmail password)

## Features Implemented

### 1. Database Schema Updates

- Added `emailVerifiedAt` timestamp field
- Added `emailVerificationToken` field for secure verification

### 2. Email Service (`lib/email/email.service.ts`)

- **Nodemailer integration** with Gmail SMTP
- **Verification email** with secure token
- **Confirmation email** after successful verification
- **Professional HTML templates** in French

### 3. Lead Creation Flow

- **Automatic token generation** when lead is created
- **Verification email sent** immediately
- **Token stored** in database for verification

### 4. Email Verification API (`/api/auth/verify-email`)

- **Token validation** and verification
- **Database update** to mark email as verified
- **Confirmation email** sent after verification
- **Security checks** for invalid/expired tokens

### 5. Verification Page (`/auth/verify-email`)

- **User-friendly interface** for email verification
- **Loading, success, and error states**
- **Responsive design** with proper UX
- **Navigation links** to continue user journey

### 6. Admin Interface Updates

- **Email verification status** displayed in leads table
- **Visual indicators** for verified vs unverified emails
- **Enhanced lead management** capabilities

## Security Features

- **Cryptographically secure tokens** (32-byte random)
- **Token expiration** (24-hour validity)
- **One-time use** tokens (deleted after verification)
- **SQL injection protection** with proper parameterization
- **Input validation** with Zod schemas

## Email Templates

### Verification Email

- Professional branding with PetitsBureaux logo
- Clear call-to-action button
- Fallback link for accessibility
- Security notice about token expiration

### Confirmation Email

- Success confirmation message
- Next steps information
- Professional closing

## Testing

Run the email verification tests:

```bash
npm test -- app/api/auth/verify-email/__tests__/route.test.ts
```

## Usage Flow

1. **User submits lead form** → Verification email sent
2. **User clicks email link** → Redirected to verification page
3. **Token validated** → Email marked as verified
4. **Confirmation email sent** → User notified of success
5. **Admin can see verification status** → Better lead management

## Troubleshooting

### Email Not Sending

- Check Gmail app password is correct
- Verify 2FA is enabled on Gmail account
- Check environment variables are set correctly

### Verification Not Working

- Ensure database migration has been run
- Check token format in database
- Verify API endpoint is accessible

### Template Issues

- Check HTML template syntax
- Verify environment variables for URLs
- Test with different email clients

# Security Policies

This document outlines the core security implementations within the Greetly application.

## Password Hashing
All user passwords are mathematically securely hashed before being stored in the database. Greetly uses `bcrypt` (`flask-bcrypt`) for all password hashing with a secure auto-generated salt and work factor. We **never** store plaintext passwords or use weak algorithms (like MD5 or SHA1).

## Rate Limiting
To protect our infrastructure and third-party API quotas from abuse or brute-forcing, we enforce strict rate limits across critical endpoints via Redis-backed `Flask-Limiter`:
- **Login (`/api/auth/login`)**: 5 attempts per minute per IP.
- **Registration (`/api/auth/register`)**: 3 attempts per hour per IP.
- **Password Reset Request (`/api/auth/forgot-password`)**: 3 attempts per hour per IP.
- **AI Message Generation (`/api/messages/generate`)**: 20 requests per hour per user/IP.

## Authentication & CSRF
Greetly utilizes JSON Web Token (JWT) concepts via stateless timed tokens (implemented securely via `itsdangerous.URLSafeTimedSerializer`).
- **Token Delivery**: Tokens are strictly delivered and consumed via the HTTP `Authorization: Bearer <token>` header.
- **CSRF Protection**: Because Greetly does **not** rely on cookies for session state (tokens are manually attached by the frontend to API requests), Cross-Site Request Forgery (CSRF) attacks are naturally mitigated. No explicit CSRF tokens are required.
- **Expiry**: Tokens expire automatically after 24 hours (86400 seconds).

## Password Recovery (OTP)
- Forgotten passwords are recovered via a secure 6-digit One-Time Password (OTP) sent to the registered email address via Brevo.
- **OTP Expiry**: OTPs are valid for exactly 15 minutes.
- **Brute Force Protection**: Failed OTP verifications increment a counter. After 5 failed attempts, the OTP is permanently locked and invalidated.

## Input Validation
All incoming JSON payloads to POST/PUT endpoints are strictly validated and sanitized using `marshmallow` schemas (`app/schemas.py`). This guarantees only expected data types and lengths reach the database or the AI Engine (Groq).

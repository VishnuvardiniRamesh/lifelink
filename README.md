# LifeLink — Real-Time Emergency Blood Donor Network

A MERN-stack starter for the project described in the Zeroth Review deck:
donors, hospitals, and recipients connected through real-time donor search,
eligibility verification, emergency alerts, and location-based services.

## Structure

```
lifelink-project/
├── backend/            Express + MongoDB API
│   ├── models/          Donor, Hospital, BloodRequest (Mongoose schemas)
│   ├── routes/          auth, donors, requests
│   ├── middleware/       JWT auth guard
│   ├── utils/eligibility.js   eligibility rule + blood-type compatibility
│   └── server.js
└── frontend/            React (Vite) client
    └── src/
        ├── pages/        Home, DonorRegister, HospitalRequest, SearchResults
        └── api/client.js Axios instance with auth header
```

## How the four core features map to code

| Deck feature              | Where it lives |
|---------------------------|----------------|
| Real-Time Donor Search    | `GET /api/donors/search` — MongoDB `$nearSphere` geo query |
| Eligibility Verification  | `backend/utils/eligibility.js` — gap-days + health-flag rules |
| Emergency Alerts          | `POST /api/requests` — matches + records notified donors |
| Location-Based Services   | `2dsphere` indexes on `Donor.location` / `Hospital.location` |

## Getting started

### 1. Backend

```bash
cd backend
cp .env.example .env      # fill in MONGO_URI and JWT_SECRET
npm install
npm run dev                # requires a local or Atlas MongoDB instance
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api` requests to `http://localhost:5000` (see
`vite.config.js`), so both must be running together during development.

## Extending this scaffold

- **Real alerts**: wire `POST /api/requests` to a push/SMS provider (Firebase
  Cloud Messaging, Twilio) instead of just recording matches.
- **Admin/hospital dashboard**: add a page that lists `GET /api/requests/mine`
  with donor response status.
- **Donor eligibility questionnaire**: expand `healthFlags` on the Donor model
  and the eligibility function as your project's rules are finalized.
- **Auth**: this scaffold uses a shared JWT scheme for donors and hospitals;
  add refresh tokens / password reset for a production build.
- **Maps**: the interactive demo uses Leaflet + OpenStreetMap — the same
  approach can be dropped into the React frontend with `react-leaflet`.

## Note

This is a functional starting point, not a finished product — validation,
error handling, and security hardening (rate limiting, input sanitization,
HTTPS, etc.) should be added before any real deployment.

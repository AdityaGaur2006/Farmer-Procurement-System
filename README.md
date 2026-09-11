# Kisan-Procurement-system
# 🌾 KisanFlow

### Smart Procurement, Mandi Discovery & Queue Management Platform

KisanFlow is a digital platform designed to simplify the agricultural procurement journey for farmers.

The platform aims to connect farmers with nearby procurement centres and mandis, helping them discover market prices, book procurement slots, manage their queue position, track procurement progress, and monitor payment status from a single platform.

The project is currently under active development.

> **Current Status:** Frontend is actively developed and functional. Backend services and external integrations are currently under development.

---

## 🚧 Project Status

### Frontend

The frontend currently contains the primary user experience and application interfaces for KisanFlow.

Current frontend development includes:

* Farmer dashboard
* Farmer registration/login interface
* Procurement-centre discovery
* Mandi discovery interface
* Slot-booking interface
* Queue-management interface
* Procurement-status interface
* Payment-status interface
* Notifications interface
* AI-powered Mandi recommendation interface
* Responsive/mobile-friendly UI

### Backend

The backend is currently being developed to connect the frontend with real services and data.

Planned backend capabilities include:

* Mobile-number authentication
* OTP generation and verification
* Farmer profile management
* GPS/location services
* Nearby mandi discovery
* Mandi and procurement-centre data
* Live mandi market-rate fetching
* Market-price comparison
* Slot management
* Booking management
* Real-time queue management
* Procurement tracking
* Payment-status management
* SMS notifications
* Push/WhatsApp notifications
* AI-based mandi recommendation
* Queue ETA prediction
* Administrative APIs

---

# 🚀 Running the Project

## Prerequisites

Make sure the following are installed:

* Node.js
* npm

Check the installation:

```bash
node --version
npm --version
```

## Installation

Clone the repository and navigate into the project directory:

```bash
git clone <repository-url>
cd <project-directory>
```

Install dependencies:

```bash
npm install
```

## Start the Application

Run the frontend using:

```bash
npm start
```

The application will start on the local development server.

Open the URL displayed in the terminal to access KisanFlow.

---

# 🏗️ Current Architecture

The current project is being developed toward the following architecture:

```text
                    ┌──────────────────────┐
                    │    Farmer Frontend   │
                    │      React / PWA     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      API Gateway     │
                    └──────────┬───────────┘
                               │
       ┌───────────────────────┼────────────────────────┐
       │                       │                        │
       ▼                       ▼                        ▼
 Farmer Service        Booking & Queue            Procurement
                              Service                Service
       │                       │                        │
       └───────────────────────┼────────────────────────┘
                               │
                     ┌─────────▼─────────┐
                     │    PostgreSQL     │
                     └─────────┬─────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        Queue Engine     Notification       Payment
                              Service         Service
              │
              ▼
       ┌──────────────────────┐
       │ AI / ML Services     │
       │                      │
       │ Mandi Recommendation │
       │ ETA Prediction       │
       │ Market Analysis      │
       └──────────────────────┘
```

The architecture may evolve as backend development progresses.

---

# 🤖 AI-Powered Mandi Advisor

One of KisanFlow's planned intelligent features is an AI-powered Mandi Advisor.

The system will use:

```text
Farmer Location
       +
Nearby Mandis
       +
Current Market Rates
       +
Distance / Travel Time
       +
Queue Status
       +
Expected Transport Cost
       ↓
Mandi Recommendation
```

Instead of simply recommending the mandi offering the highest price, KisanFlow aims to calculate the **overall expected benefit** for the farmer.

For example:

> Mandi A offers a higher price but has a significantly longer queue and greater transportation cost.

The system can therefore recommend another mandi if its overall expected return is better.

---

# 📍 Location & Mandi Discovery

The backend will eventually provide location-aware mandi discovery.

A farmer will be able to share their current location and receive:

* Nearby mandis
* Distance
* Estimated travel time
* Available commodities
* Current market rates
* Procurement availability
* Queue information
* Recommended mandi

---

# 📊 Market Rate Integration

KisanFlow is designed to consume authoritative mandi-market data through external data providers such as government agricultural datasets.

The backend will normalize and cache market data so that the application does not depend on an external API for every user request.

Market information will include:

* Commodity
* Variety
* Mandi
* Minimum price
* Maximum price
* Modal price
* Arrival date
* Data source
* Last updated timestamp

---

# 📱 Notifications

The planned notification system will support:

* OTP messages
* Booking confirmation
* Slot reminders
* Queue-approaching alerts
* Queue-delay alerts
* Procurement completion
* Payment-status updates

Notification channels may include:

```text
SMS
Push Notifications
WhatsApp
In-App Notifications
```

---

# 💳 Procurement & Payment Tracking

KisanFlow is designed to provide a complete procurement lifecycle:

```text
Slot Booking
      ↓
Check-In
      ↓
Queue
      ↓
Weighment
      ↓
Quality Verification
      ↓
Procurement
      ↓
Receipt
      ↓
Payment Initiated
      ↓
Payment Completed
```

The current frontend provides the interfaces for these workflows, while the corresponding backend services are under development.

---

# 🔐 Security

The production architecture will include:

* OTP-based authentication
* Secure session management
* API authentication
* Role-based access control
* Rate limiting
* Input validation
* Secure handling of farmer information
* Audit logging
* Secure payment-webhook verification
* Controlled access to external government services

---

# 🛠️ Technology Stack

### Frontend

* React
* JavaScript / TypeScript
* HTML5
* CSS
* Responsive UI

### Backend

Planned:

* Node.js
* REST APIs
* WebSockets
* PostgreSQL
* Redis

### AI / ML

Planned:

* Python
* Machine Learning models
* AI Agent / Recommendation Engine

### External Integrations

Planned:

* Government mandi-price data
* Geolocation services
* Routing services
* SMS gateway
* Payment services
* Optional WhatsApp integration

---

# 🗺️ Development Roadmap

### Phase 1 — Frontend

* [x] Core UI
* [x] Farmer interface
* [x] Mandi discovery UI
* [x] Booking UI
* [x] Queue UI
* [x] Procurement UI
* [x] Payment UI

### Phase 2 — Backend

* [ ] Backend foundation
* [ ] Database
* [ ] Authentication
* [ ] OTP service
* [ ] Farmer APIs
* [ ] Mandi APIs
* [ ] Booking APIs
* [ ] Queue APIs

### Phase 3 — External Services

* [ ] GPS/location integration
* [ ] Nearby mandi service
* [ ] Market-rate API
* [ ] Routing/travel-time service
* [ ] SMS gateway
* [ ] Payment integration

### Phase 4 — Intelligence

* [ ] Mandi recommendation engine
* [ ] Queue ETA prediction
* [ ] Market comparison
* [ ] AI assistant

### Phase 5 — Production Readiness

* [ ] Security hardening
* [ ] Load testing
* [ ] Monitoring
* [ ] Logging
* [ ] Deployment automation
* [ ] Government-system integrations where officially authorised

---

## ⚠️ Development Notice

KisanFlow is currently an **active development project**.

The frontend is the currently functional portion of the application. Backend APIs, database services, external integrations, authentication, notifications, payment workflows, and AI services are being implemented progressively.

Some frontend screens may therefore currently use static/demo data until their corresponding backend services are connected.

---

## 🎯 Vision

KisanFlow aims to reduce unnecessary waiting and uncertainty in agricultural procurement by giving farmers a single platform to:

**Discover → Compare → Book → Queue → Procure → Track → Get Paid**

The long-term objective is to transform procurement-centre management from a primarily physical queue-based process into a **data-driven, location-aware and intelligent procurement workflow**.

# Andhra Response Hub

Below is a final master prompt you can give to an AI coding tool to build the project end-to-end. It is designed around your agreed architecture: government-style disaster platform, role-based authentication, dynamic portals, GIS, AI intelligence, and a cinematic landing page.

Master Development Prompt: AI-Powered Government Disaster Intelligence & Response Platform

Build a complete, production-quality full-stack web application called:

AP Disaster Intelligence & Emergency Response Platform

The platform should feel like an official modern government disaster management platform for Andhra Pradesh, India.

The application must be professional, trustworthy, accessible, modern, responsive, and suitable for presentation as a government technology platform. Do not create a generic startup dashboard or an overly colorful commercial design.

1. PRIMARY OBJECTIVE

Create a unified disaster intelligence and emergency response platform that connects:

Citizens

Volunteers

Field Officers

Donors and Partner Organizations

Disaster Management Administrators / Control Room

The system must use:

Role-Based Authentication

Role-Based Access Control

Dynamic portal routing

GIS and location intelligence

Incident reporting and verification

Shelter and resource management

Disaster alerts

AI-assisted incident intelligence

Infrastructure and risk analysis

Human-in-the-loop emergency decisions

The platform must be designed as one unified government system, not as five separate applications.

After authentication, the portal, sidebar navigation, dashboard data, modules, and permissions must automatically change according to the authenticated user's role.

2. BRANDING AND GOVERNMENT IDENTITY

Use a professional government-style identity.

Suggested platform name:

Andhra Pradesh Disaster Intelligence & Response System

Alternative short name:

AP-DIRS

Subtitle:

AI-Assisted Disaster Intelligence, Emergency Coordination and Resilient Infrastructure Monitoring

The visual identity should communicate:

Government authority

Public safety

Trust

Emergency response

Geographic intelligence

Modern technology

Use a clean light interface.

Avoid:

Gaming UI

Excessive gradients

Neon colors

Cryptocurrency-style dashboards

Excessive glassmorphism

Too many cards

Cluttered sidebars

Use a professional palette inspired by:

Deep government blue

White

Slate/neutral backgrounds

Red only for critical emergencies

Orange/amber for warnings

Green for safe/available status

3. LANDING PAGE

Create a cinematic, professional government landing page.

The landing page should immediately communicate:

Prepared. Connected. Ready to Respond.

Hero Section

Create a full-screen cinematic hero section.

Use background video support with disaster-related visual content such as:

Flooded streets

Heavy rainfall

Overflowing rivers

Rescue boats

Emergency response teams

Damaged roads

Infrastructure damage

Emergency shelters

Government response operations

The videos must be presented respectfully and professionally.

Do not show graphic injuries, dead bodies, or disturbing imagery.

Use a dark overlay so text remains readable.

Hero content:

Main heading

AI-Powered Disaster Intelligence for a Safer Andhra Pradesh

Supporting text

A unified government platform connecting citizens, emergency responders, volunteers and partner organizations through real-time disaster intelligence, location-aware coordination and AI-assisted decision support.

Primary actions

View Live Situation

Report an Emergency

Secondary actions

Explore Safety Map

Emergency Contacts

The landing page should contain subtle animated elements such as:

Live alert ticker

Animated GIS lines

Emergency status indicators

Data counters

Moving map layers

Smooth transitions

4. LANDING PAGE SECTIONS

Section: Live Situation

Display:

Active incidents

Critical incidents

Open shelters

Available response teams

Current weather status

Example:

ACTIVE INCIDENTS       128
CRITICAL               12
OPEN SHELTERS          84
RESPONSE TEAMS         42

Use animated counters.

Section: Live Disaster Map

Show an interactive Andhra Pradesh map.

Display:

Active incidents

Flood-risk zones

Shelters

Hospitals

Response teams

Blocked roads

Infrastructure risks

Include a button:

Open Disaster Intelligence Map

Section: How the System Works

Show a visual workflow:

REPORT
   ↓
VERIFY
   ↓
ANALYZE
   ↓
PRIORITIZE
   ↓
RESPOND
   ↓
RESOLVE

Each step should have a clear icon and short explanation.

Section: Disaster Intelligence

Explain the intelligence layer.

Display:

Citizen Reports
       +
Volunteer Updates
       +
Field Verification
       +
Weather Data
       +
GIS Data
       +
Infrastructure Data
       ↓
DISASTER INTELLIGENCE ENGINE
       ↓
Risk Analysis
Priority Recommendation
Resource Recommendation

Section: Emergency Preparedness

Provide:

Flood safety

Cyclone preparedness

Emergency contacts

Shelter guidance

Evacuation guidance

Section: Transparency and Public Trust

Display:

Response statistics

Verified incidents

Resources deployed

People assisted

Resolution rate

5. AUTHENTICATION SYSTEM

Implement:

Login

Registration where appropriate

Password reset

JWT authentication

Refresh tokens if architecture supports it

Secure logout

Protected routes

Role validation

Roles:

CITIZEN
VOLUNTEER
FIELD_OFFICER
DONOR
ADMIN

After login:

Authentication
      ↓
Retrieve User Profile
      ↓
Retrieve Role + Permissions
      ↓
Automatically Redirect
      ↓
Correct Role Portal

Example:

CITIZEN       → /citizen/dashboard
VOLUNTEER     → /volunteer/dashboard
FIELD_OFFICER → /officer/dashboard
DONOR         → /donor/dashboard
ADMIN         → /admin/dashboard

Never allow users to manually access another role's protected portal by changing the URL.

Validate permissions in both:

Frontend

Backend

The frontend is not the security boundary. The backend must enforce authorization.

6. ROLE-BASED PORTALS

Keep navigation simple.

Maximum approximately 5–6 main sidebar modules per role.

Do not create 20 sidebar items.

Related features should be grouped into parent modules.

7. CITIZEN PORTAL

Sidebar

Dashboard
Get Help
Safety Map
My Activity
Account

Dashboard

Display:

Nearby alerts

Current weather

Nearby active incidents

Quick emergency actions

Nearby shelters

Safety recommendations

Quick actions:

Report Incident

Request Rescue

Request Medical Help

Find Shelter

Get Help

Use tabs or cards:

Report Incident

Fields:

Incident type

Description

Number of people affected

Urgency

Location

Photo/video evidence

Voice note if supported

Rescue Request

Fields:

Number of people

Vulnerable people

Water level/severity

Current location

Contact details

Medical Help

Fields:

Medical emergency type

Number of patients

Location

Urgency

Emergency Contacts

Show official emergency contact information.

Safety Map

Include:

Active incidents

Flood zones

Shelters

Hospitals

Safe routes

Blocked roads

My Activity

Display:

Submitted reports

Request status

Notifications

Incident timeline

Example workflow:

Submitted
↓
Under Review
↓
Verified
↓
Response Assigned
↓
In Progress
↓
Resolved

8. VOLUNTEER PORTAL

Sidebar

Dashboard
Response Work
Field Updates
Community
Profile

Response Work

Include:

Assigned tasks

Accept/decline task

Task location

Instructions

Update progress

Complete task

Field Updates

Allow volunteers to:

Submit observations

Report road conditions

Report shelter conditions

Upload evidence

View live field map

Volunteer updates must not automatically become verified official information.

Workflow:

Volunteer Report
↓
Pending Review
↓
Officer/Admin Verification
↓
Verified / Rejected

9. FIELD OFFICER PORTAL

Sidebar

Dashboard
Incident Operations
Field Intelligence
Relief Operations
Team
Insights

Incident Operations

Include:

Assigned incidents

New reports

Incident verification

Duplicate detection suggestions

Priority recommendations

Incident status updates

Evidence review

The AI may recommend actions, but the officer must make the final operational decision.

Field Intelligence

Include:

Live GIS map

Roads

Bridges

Infrastructure assets

Risk zones

Weather overlay

Field evidence

Use layers that can be enabled or disabled.

Relief Operations

Group together:

Shelters

Food

Water

Medicine

Relief resources

Resource requests

Do not create each as a separate sidebar item.

Team

Include:

Team members

Availability

Assignments

Current location/status

Task progress

10. DONOR / PARTNER PORTAL

Sidebar

Dashboard
Contribute
Projects & Needs
Impact
Account

Contribute

Support:

Financial contribution workflow placeholder

Food

Water

Medical supplies

Relief materials

Clearly separate donation pledges from verified received resources.

Projects & Needs

Show:

Active disaster response needs

Verified urgent requirements

Partner projects

Required resources

Impact

Show:

Donations submitted

Resources delivered

Beneficiary impact

Project progress

Downloadable reports if implemented

Donors must not access sensitive victim data.

11. ADMIN / CONTROL ROOM

Sidebar

Command Center
Operations
Disaster Intelligence
Relief Management
People & Partners
Analytics & System

Command Center

This is the main government emergency dashboard.

Display:

Critical incidents

Live alerts

Incident trend

Response teams

Shelter availability

Resource status

Weather overview

AI recommendations

Use a large live map as the central visual component.

Operations

Group:

Incidents

Verification

Response assignments

Team coordination

Escalations

Disaster Intelligence

Include:

Live GIS map

Risk zones

Infrastructure analysis

Weather analysis

AI recommendations

Predictive risk layer

Relief Management

Include:

Shelters

Resource inventory

Food/water

Medical resources

Donations

Distribution tracking

People & Partners

Manage:

Citizens

Volunteers

Field officers

Donors

Organizations

Analytics & System

Include:

Incident analytics

Response performance

AI insights

Reports

Audit logs

System settings

Role and permission management

12. DISASTER INTELLIGENCE ENGINE

This is the core innovation.

Architecture:

MULTI-SOURCE DATA
│
├── Citizen Reports
├── Volunteer Reports
├── Field Officer Verification
├── Weather Data
├── GIS Data
├── Infrastructure Data
├── Shelter Data
└── Resource Availability
          │
          ▼
DISASTER INTELLIGENCE ENGINE
          │
 ┌────────┼─────────┬───────────────┐
 ▼        ▼         ▼               ▼
Classification Duplicate Trust    Priority
              Detection Score     Analysis
          │
          ▼
GIS-Aware Resource Recommendation
          │
          ▼
Human Officer Decision

13. AI FEATURES

Incident Classification

Analyze report text.

Possible categories:

Flood

Road damage

Bridge damage

Medical emergency

Rescue request

Fire

Shelter issue

Food shortage

Water shortage

Infrastructure damage

Use a modular ML service.

Start with a simple baseline if no large labeled dataset is available.

Design the architecture so it can later support transformer-based NLP models.

Duplicate Detection

Use:

Semantic text similarity

Geographic proximity

Time similarity

Recommended architecture:

New Report
   ↓
Text Similarity
   +
Location Distance
   +
Time Window
   ↓
Duplicate Probability

Do not automatically delete reports.

Show:

Possible duplicate detected

Allow an officer/admin to decide.

Trust Score

Calculate report confidence using:

GPS accuracy

Evidence availability

Similar nearby reports

Reporter history

Time

Location risk context

Verification status

Example:

Confidence Score: 84%

Factors:
+ GPS location verified
+ Image evidence
+ Similar reports nearby
- First-time reporter

Priority Recommendation

Use structured data to recommend:

Critical

High

Medium

Low

Consider:

Threat to life

Medical urgency

People affected

Disaster severity

Accessibility

Report confidence

Waiting time

Nearby resources

Example:

Priority: CRITICAL
Score: 91/100

Primary factors:
• Medical emergency
• 42 people affected
• High flood severity
• No accessible road route

Do not claim AI is making the final decision.

Use:

AI-Assisted Recommendation

Final decision must remain with the authorized officer.

14. RESOURCE RECOMMENDATION

For an emergency incident, recommend:

Nearest available response team

Rescue boat

Ambulance

Medical facility

Shelter

Consider:

Distance

Estimated travel time

Road status

Resource availability

Incident severity

Shelter capacity

Example:

Recommended Response

Boat Team B
Distance: 2.3 km
Status: Available

Ambulance A7
Estimated ETA: 8 min

Shelter 04
Available Capacity: 127

All recommendations must be reviewable and modifiable by authorized personnel.

15. GIS AND MAP SYSTEM

Use a modern web mapping library.

Recommended:

MapLibre GL or Leaflet

The map must support layers:

Incidents
Flood Zones
Shelters
Hospitals
Roads
Blocked Roads
Bridges
Infrastructure Assets
Response Teams
Resources
Weather / Risk Layers

Use PostGIS for:

Spatial queries

Nearest facility

Incident proximity

Duplicate report detection

Risk zone intersections

Distance calculations

16. DATA SOURCES

Create a modular data integration layer.

Potential sources:

Andhra Pradesh infrastructure dataset

OpenStreetMap

Weather provider

Official disaster alert feeds where access is supported

User-generated reports

Shelter and resource databases

Satellite data in advanced phases

Do not tightly couple the application to one external provider.

Use service abstractions such as:

WeatherService
MapDataService
AlertService
RoutingService
SatelliteService
NotificationService

17. BACKEND

Use:

Python

FastAPI

SQLAlchemy

Pydantic

PostgreSQL

PostGIS

Organize backend:

app/
├── main.py
├── core/
│   ├── config.py
│   ├── security.py
│   └── permissions.py
│
├── api/
│   ├── auth.py
│   ├── users.py
│   ├── incidents.py
│   ├── shelters.py
│   ├── resources.py
│   ├── alerts.py
│   ├── volunteers.py
│   ├── donations.py
│   ├── gis.py
│   └── analytics.py
│
├── models/
├── schemas/
├── services/
├── repositories/
│
└── ml/
    ├── classification/
    ├── duplicate_detection/
    ├── trust_scoring/
    ├── priority_prediction/
    └── explainability/

Implement:

API versioning

Validation

Error handling

Logging

RBAC middleware/dependencies

Audit logging

Pagination

Filtering

Sorting

18. DATABASE DESIGN

Use PostgreSQL + PostGIS.

Core entities:

users
roles
permissions
user_roles

incidents
incident_reports
incident_evidence
incident_status_history
incident_verifications

shelters
shelter_status_history

resources
resource_inventory
resource_assignments

response_teams
team_members
team_locations

volunteer_tasks

donations
donation_items
donation_projects

alerts

infrastructure_assets
roads
risk_zones

audit_logs
notifications

Use geographic fields where appropriate:

geometry
latitude
longitude

Prefer PostGIS geometry/geography for spatial entities.

19. FRONTEND

Use:

React

TypeScript

Vite

TanStack Router

Tailwind CSS

Component-based architecture

Recommended structure:

src/
├── app/
├── features/
│   ├── auth/
│   ├── citizen/
│   ├── volunteer/
│   ├── officer/
│   ├── donor/
│   ├── admin/
│   ├── incidents/
│   ├── shelters/
│   ├── resources/
│   └── map/
│
├── components/
│   ├── layout/
│   ├── ui/
│   ├── maps/
│   └── charts/
│
├── lib/
│   ├── api.ts
│   └── auth.ts
│
└── routes/

20. DYNAMIC NAVIGATION

Do not hard-code one sidebar for every user.

Create role-based configuration.

Concept:

Role
   ↓
Navigation Configuration
   ↓
Allowed Modules
   ↓
Allowed Actions
   ↓
Dynamic Sidebar

Example:

CITIZEN
Dashboard
Get Help
Safety Map
My Activity
Account

The navigation must be generated based on the authenticated role.

21. UI/UX REQUIREMENTS

The application should feel like a real government emergency operations platform.

Requirements:

Responsive desktop/tablet/mobile

Accessible color contrast

Clear emergency hierarchy

Large readable typography

Status badges

Loading states

Empty states

Error states

Confirmation dialogs for critical actions

Audit indicators for official changes

Clear timestamps

"Last Updated" information

Verification badges

Use consistent status colors:

Critical      Red
High          Orange
Medium        Amber
Low           Blue/Neutral
Resolved      Green
Unverified    Gray

22. REAL-TIME ARCHITECTURE

Design the application to support real-time updates.

For example:

New Incident
     ↓
Backend
     ↓
WebSocket / Event Layer
     ↓
Admin Dashboard
Officer Portal
Live Map
Citizen Notifications

Use a modular architecture so polling can be used for the MVP and WebSockets can be added where appropriate.

23. LANDING PAGE VIDEO IMPLEMENTATION

Create dedicated video slots:

/public/videos/
├── hero-flood.mp4
├── rescue-operation.mp4
├── infrastructure-damage.mp4
└── emergency-response.mp4

If video assets are not available, implement placeholders with:

Poster images

Gradient overlay

Fallback static background

Do not use copyrighted video assets without permission.

The application should make it easy to replace placeholder video files later.

24. MOCK DATA AND DEVELOPMENT MODE

The application must be fully usable before all APIs and AI models are connected.

Create a development/demo mode with realistic Andhra Pradesh sample data.

Include:

Sample incidents

Sample shelters

Sample response teams

Sample resources

Sample weather data

Sample risk zones

Sample infrastructure assets

Clearly mark mock/demo data in development mode.

When the backend API is available, seamlessly switch to real data.

Do not leave broken screens because an API is unavailable.

25. REQUIRED DELIVERABLES

Generate the complete project with:

Professional landing page

Authentication system

Role-based routing

Dynamic role-based navigation

Citizen portal

Volunteer portal

Field officer portal

Donor/partner portal

Admin/control room

Incident management

Shelter management

Resource management

GIS map integration

AI intelligence architecture

Duplicate detection interface

Priority recommendation interface

Trust score interface

Analytics dashboard

Responsive design

Demo data

API integration layer

Backend API architecture

PostgreSQL/PostGIS schema

Docker configuration

.env.example

Clear README

Setup instructions

26. DOCKER DEPLOYMENT

Provide:

docker-compose.yml

Services:

frontend
backend
postgres
postgis
redis

Use environment variables.

Do not expose secrets.

Include:

.env.example

27. README

The README must include:

Project overview

Architecture diagram

Technology stack

Installation

Environment setup

Database setup

Docker instructions

Running frontend

Running backend

API documentation

Role descriptions

Demo credentials

Future AI integration

28. IMPLEMENTATION PRIORITY

Build in this order:

Phase 1 — Foundation

Landing page

Authentication

RBAC

Dynamic portals

Database

API structure

Phase 2 — Core Disaster Platform

Incident reporting

Incident verification

Shelters

Resources

GIS map

Alerts

Phase 3 — Intelligence

Duplicate detection

Trust scoring

Priority recommendations

Explainability

Phase 4 — Advanced

Weather integration

Routing

Resource recommendations

Satellite/flood layers

Digital Twin capabilities

FINAL DEVELOPMENT RULES

Do not build a generic admin template.

Do not create unnecessary pages.

Do not create 20 sidebar menu items.

Group related functionality into logical modules.

Every page must have a clear purpose.

Use reusable components.

Use realistic Andhra Pradesh disaster-response examples.

Ensure the design looks complex and capable internally, but remains simple and intuitive for each user role.

The application must demonstrate this complete flow:

CITIZEN REPORT
       ↓
AUTOMATIC CLASSIFICATION
       ↓
DUPLICATE CHECK
       ↓
TRUST / CONFIDENCE ANALYSIS
       ↓
PRIORITY RECOMMENDATION
       ↓
FIELD OFFICER VERIFICATION
       ↓
RESOURCE RECOMMENDATION
       ↓
ADMIN / CONTROL ROOM APPROVAL
       ↓
RESPONSE TEAM ASSIGNED
       ↓
LIVE STATUS UPDATES
       ↓
RESOLVED

The final result should look like a real, modern Government of Andhra Pradesh disaster intelligence and emergency coordination platform, combining public safety, GIS intelligence, infrastructure monitoring, AI-assisted analysis, and coordinated emergency response.

Build the system end-to-end with clean, maintainable, scalable code and ensure every frontend module has either working API integration or clearly marked realistic demo data.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ff22aee1-3f4e-4c85-8aac-29eb7f2e0f1e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

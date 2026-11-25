RoomFinder – Find Rooms & Flatmates: Product Requirements Document
RoomFinder – Find Rooms & Flatmates: 
Product Requirements Document
Status: Draft v0.1 (Day 1 team specification) Domain: PropTech (rental housing and shared
accommodation) Location: Pokhara, Nepal
1. Overview
RoomFinder is a mobile-first web platform where people in Pokhara can find rooms, flats,
and compatible flatmates in one place. Landlords, property owners, and existing tenants
can list available spaces. The team is four people working on a short group project.
2. Problem Statement
People looking for rooms, flats, or compatible flatmates in Pokhara struggle to find
suitable and reliable accommodation because rental information is scattered across social
media, personal networks, and local agents. This leads to wasted time, difficulty
comparing options, and uncertainty about accommodation. Today, they rely on Facebook
groups, brokers, and word of mouth, which can be unreliable, time-consuming, and
limited.
3. Target Users
Seekers
Students looking for affordable rooms.
Working professionals searching for accommodation.
Individuals moving to Pokhara searching for rooms, flats, or compatible flatmates.
People looking for flatmates to share rent.
Suppliers
Landlords and property owners listing rooms or flats.
Existing tenants looking for someone to share their accommodation.
4. Pain Points
Difficulty finding affordable and suitable rooms.
Page 1 of 6
Rental information scattered across Facebook groups and personal networks.
Lack of verified and reliable room listings.
Difficulty finding compatible flatmates.
Wasting time contacting owners and visiting unsuitable properties.
5. Current Alternatives
5.1 How RoomFinder Differs from Current Alternatives
RoomFinder puts room, flat, and flatmate information in one place instead of scattered
posts and personal contacts. The team's stated goal is to avoid being a generic room
listing platform and to focus on clear property information, rental preferences, and
shared-accommodation discovery.
Alternative Known from our
notes
Gaps
Facebook groups Used today to find
rooms
Described as unreliable, time
consuming, and limited
Brokers / local agents Used today Described as unreliable, time
consuming, and limited
Word of mouth / personal
networks
Used today Described as unreliable, time
consuming, and limited
Problem with current alternatives
(from notes)
RoomFinder response Status
Rental information is scattered
across Facebook groups, personal
networks, and agents
One platform where landlords and
owners list rooms and flats, and
existing tenants list shared spaces
(M1)
In MVP
Difficulty comparing options and
wasted time
Browse, search, and filter by
location, price, and room type, with
detail pages and photos (M2)
In MVP
RoomFinder – Find Rooms & Flatmates: Product Requirements Document
Page 2 of 6
RoomFinder – Find Rooms & Flatmates: Product Requirements Document
Problem with current alternatives
(from notes)
RoomFinder response
Status
Difficulty finding compatible
flatmates
Wasting time contacting owners
and visiting unsuitable properties
Post and browse flatmate
requirements with preferences
such as student or working
professional, smoking and
drinking, maximum occupants, and
budget (M3)
In MVP
Contact information on listing
details so seekers can reach
owners and flatmates directly
(M4)
Lack of verified and reliable
listings
Verified owners and listings, and
reporting of fake or suspicious
listings
In MVP
Future phase,
not in MVP
ASSUMPTION: Showing structured property details and rental preferences up front
helps seekers rule out unsuitable options before contacting or visiting, compared
with free-form Facebook posts.
ASSUMPTION: The flatmate preference fields from the earlier project summary are
used in M4, with the final field list still to be agreed.
Not yet differentiated: the MVP has no verification, and flatmate discovery is limited
to posting and browsing requirements because AI-based flatmate matching is a
future phase.
The notes do not describe other Nepali rental sites or apps, so this PRD makes no
claim about how RoomFinder compares with them.
6. Goals and Success Metrics
Goals (from the problem statement)
Reduce time wasted finding and comparing accommodation.
Bring scattered rental information into one place.
Make it easier to find compatible flatmates.
Page 3 of 6
RoomFinder – Find Rooms & Flatmates: Product Requirements Document
7. Scope
7.1 Must features
The notes list 7 MVP features. Registration and login (item 1) is dropped because the
instructor requires no authentication. ASSUMPTION: the remaining six items are merged
into 4 Must features and nothing else from the 7 is dropped.
#
Must feature
M1 Post room or flat listing
M2 Browse, search, filter, and
view listings
M3 Post and browse flatmate
requirements
Covers notes
item(s)
Description
2
3, 4, 5
Owners or tenants post a listing
with photos (Cloudinary per the
tech stack).
Browse available rooms, filter by
location, price, and room type, and
open a detail page with photos and
contact information.
6
M4 Contact owners or potential
flatmates
Open points on the Must features:
7
Users post what they need in a
flatmate and browse others'
requirements.
A seeker can reach a room owner or
potential flatmate.
ASSUMPTION: "Contact" in M4 means showing the owner's or flatmate's contact
information, since in-app chat is a future phase.
7.2 Future phases (not in the MVP)
1. Verified room owners and listings.
2. In-app chat and messaging.
3. Map-based room search.
4. User reviews and ratings.
5. AI-based flatmate matching.
6. Save favourite listings.
7. Online booking and payment integration.
Page 4 of 6
RoomFinder – Find Rooms & Flatmates: Product Requirements Document
8. Report fake or suspicious listings.
The project constraints also apply: no real payment integration (payment can be
simulated), no real-time chat, and no AI added unnecessarily.
8. User Flows
ASSUMPTION: these flows are inferred from the Must features. Per the instructor, users
are assumed to be already logged in.
1. Seeker finds a room: browses or filters listings, opens a detail page, views photos and
contact information, contacts the owner.
2. Owner or tenant lists a space: fills in the listing form, uploads photos, publishes.
3. Seeker finds a flatmate: browses flatmate requirements, contacts a potential
flatmate.
4. Seeker posts a flatmate requirement: fills in preferences, publishes.
9. Technical Approach
Layer
Choice (from notes)
Frontend
Styling
Backend
Database
React.js
Tailwind CSS
Node.js + Express.js
MongoDB
Authentication Not used (no login or registration, per the
instructor)
Image storage
Cloudinary
Version control Git + GitHub
Deployment
Vercel (frontend) + Render (backend)
ASSUMPTION: three data collections are enough: Users, Listings, FlatmateRequirements.
Page 5 of 6
RoomFinder – Find Rooms & Flatmates: Product Requirements Document
10. Non-Functional Requirements
Mobile-first design (from the earlier summary).
11. Timeline
Available time: 4 days for the Must features.
12. Risks and Dependencies
Listings and flatmate requirements need content to be useful.
Dependencies on third-party services: Cloudinary, Vercel, Render, and the MongoDB
host.

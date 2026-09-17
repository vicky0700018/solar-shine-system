# Solar Shine System

https://github.com/vicky0700018/solar-shine-demo

copy this repo

initial prompt
Create a complete DEMO website for:

CLIENT DETAILS
Client Name: Sartaj Solar Water System
Business Name: Sartaj Solar Water System
Address: Blue Cross Road, Sr. No. 5, Sharad Nagar, Mundhwa, Pune, Maharashtra 411036
Phone: 08446614927
Email: info@sartajsolar.in

REFERENCE WEBSITES
Public Website:
https://sunshine-admin-portal.lovable.app/

Admin Panel Reference:
https://sunshine-admin-portal.lovable.app/admin

IMPORTANT:
Use the reference website and its /admin panel as the visual and functional reference.

The new website should recreate the same overall website structure, sections, navigation, content management concept, forms, fields, buttons, cards, layouts and admin workflow visible in the reference.

Do NOT blindly copy the branding/name of the reference website. Replace all business information with Sartaj Solar Water System information.

==================================================
TECHNOLOGY REQUIREMENTS — VERY IMPORTANT
==================================================

Use ONLY:

- React
- Vite
- Tailwind CSS

Do NOT use:
- Next.js
- Vue
- Angular
- Laravel
- PHP
- Node/Express backend
- MongoDB
- MySQL
- PostgreSQL
- Supabase
- Firebase
- Any external database
- Any unnecessary third-party library
- Any UI component library

This is ONLY a DEMO WEBSITE.

Use mock/static data and React state/localStorage where necessary to simulate functionality.

NO DATABASE.

==================================================
DESIGN / COLOR THEME
==================================================

The business is a Solar Water System / Solar Water Heating business.

Create a professional solar-energy-inspired visual identity.

Use colors based on the business type:

Primary:
- Solar Orange / Warm Orange: #F59E0B

Secondary:
- Deep Solar/Engineering Blue: #0F4C81

Dark:
- #0F172A

Light:
- #F8FAFC

White:
- #FFFFFF

Green can be used selectively for:
- Eco-friendly indicators
- Energy saving
- Success/status indicators

The overall design should communicate:
- Solar Energy
- Clean Energy
- Water Heating
- Reliability
- Engineering
- Sustainability
- Professional Service

Do NOT make the website overly colorful.

Use a clean, modern, premium corporate design.

==================================================
PUBLIC WEBSITE
==================================================

Create a complete responsive public website.

Navigation should contain relevant sections such as:

- Home
- About
- Services
- Products / Solutions
- Projects
- Gallery
- Testimonials
- Contact

Use smooth scrolling/navigation.

Header should contain:

Business logo/name:
"Sartaj Solar Water System"

Phone:
08446614927

CTA:
"Get a Quote"

Make the header responsive for mobile.

==================================================
HERO SECTION
==================================================

Create a large professional hero section.

IMPORTANT:
The hero section MUST contain banner imagery related to:

- Solar water heater
- Solar panels
- Hot water system
- Rooftop solar water heating
- Residential solar water heater
- Commercial solar water heating

Since this is a DEMO and there is no backend/database, use local/mock image URLs or visually appropriate placeholder banner images.

Create a hero slider/banner area with multiple mock banners.

Example banner concepts:

1. Solar Water Heating Solutions
2. Save Energy With Solar Water Heater
3. Reliable Hot Water For Home & Business

Hero content should include:

"Sustainable Solar Water Heating Solutions"

"Efficient • Reliable • Eco-Friendly"

CTA buttons:
- Get a Quote
- Explore Services

Use strong contrast and professional typography.

==================================================
ABOUT SECTION
==================================================

Create an About section for:

"Sartaj Solar Water System"

Use professional mock content explaining:

- Solar water heating solutions
- Energy-efficient systems
- Residential solutions
- Commercial solutions
- Installation
- Maintenance
- Customer support

Do not claim fake certifications, awards or government approvals.

Use mock statistics only where clearly presented as demo content.

Example:

10+ Years Experience
500+ Installations
100% Customer Focus
Eco-Friendly Solutions

These are DEMO values and should be easily editable from Admin Panel.

==================================================
SERVICES MODULE
==================================================

Create a Services section.

Services should be dynamically rendered from mock data.

Include demo services such as:

- Solar Water Heater Installation
- Solar Water Heater Maintenance
- Residential Solar Water Heating
- Commercial Solar Water Heating
- Solar System Consultation
- Repair & Service

Each service should have:

- Service title
- Description
- Image
- Icon
- Status
- CTA/button

Admin must be able to manage these fields in the demo admin panel.

==================================================
PRODUCTS / SOLUTIONS
==================================================

Create a professional product/solution section.

Mock products can include:

- Residential Solar Water Heater
- Commercial Solar Water Heater
- Rooftop Solar Water Heating System
- High Efficiency Solar Water Heating System

Each product should support:

- Product name
- Short description
- Detailed description
- Image
- Features
- Price/price text
- Status

Use mock data only.

==================================================
PROJECTS MODULE
==================================================

Create a Projects section.

Display projects in modern cards/grid.

Each project should have:

- Project title
- Location
- Description
- Project image
- Category
- Completion/status

Use DEMO project data.

Do not use fake real customer information.

==================================================
GALLERY MODULE
==================================================

Create a responsive Gallery section.

Gallery items should have:

- Image
- Title
- Category
- Description
- Status

Use solar-energy related demo images.

Add category filtering if practical.

Example categories:

- Solar Water Heater
- Installation
- Residential
- Commercial
- Projects

==================================================
TESTIMONIALS
==================================================

Create a Testimonials section using mock/demo testimonials.

Each testimonial should have:

- Customer name
- Message
- Rating
- Image/avatar
- Location
- Status

Clearly treat these as demo content in the code/data structure.

==================================================
CONTACT SECTION
==================================================

Use the actual client contact information:

Business:
Sartaj Solar Water System

Address:
Blue Cross Road, Sr. No. 5, Sharad Nagar, Mundhwa, Pune, Maharashtra 411036

Phone:
08446614927

Email:
info@sartajsolar.in

Create a professional contact form.

Fields:

- Full Name
- Phone
- Email
- Service
- Message

When submitted, do NOT send data to a backend.

Instead:
- Validate the form
- Store submitted demo leads in localStorage
- Show success message
- Make the leads visible inside Admin Panel

==================================================
FOOTER
==================================================

Create a complete professional footer.

Include:

Sartaj Solar Water System

Address

Phone

Email

Quick Links

Services

Contact

Social media placeholders/icons if appropriate.

IMPORTANT:
Add an "Admin Login" / "Admin Panel" link in the footer.

The footer admin link must redirect to:

/admin/login

==================================================
ADMIN PANEL
==================================================

Create a complete DEMO Admin Panel.

Admin panel should follow the structure and visual concept of:

https://sunshine-admin-portal.lovable.app/admin

Create:

/admin/login

/admin

/admin/services

/admin/products

/admin/projects

/admin/gallery

/admin/testimonials

/admin/leads

/admin/settings

The admin should have a professional dashboard layout with sidebar navigation.

==================================================
ADMIN LOGIN
==================================================

Create a demo admin login.

Login fields:

Email
Password

Demo credentials:

Email:
admin@sartajsolar.in

Password:
admin123

This is DEMO authentication only.

Do NOT implement a real backend authentication system.

Use React state/localStorage to simulate login.

After successful login:

redirect to:

/admin

If user is not logged in and tries to access an admin route:

redirect to:

/admin/login

Add Logout functionality.

==================================================
ADMIN DASHBOARD
==================================================

Dashboard should contain summary cards:

- Total Services
- Total Products
- Total Projects
- Gallery Images
- Testimonials
- Contact Leads

Use dynamic values based on mock/localStorage data.

Also create:

Recent Contact Leads

Recent Projects

Quick Actions

==================================================
ADMIN SERVICES
==================================================

Create full CRUD-like DEMO interface.

Admin should be able to:

- View services
- Add service
- Edit service
- Delete service
- Enable/disable service

Fields:

- Service Name
- Short Description
- Full Description
- Image
- Icon
- Status

Use React state/localStorage.

Changes should immediately reflect on the public website.

==================================================
ADMIN PRODUCTS
==================================================

Create product management.

Fields:

- Product Name
- Short Description
- Full Description
- Image
- Features
- Price
- Status

Actions:

- Add
- Edit
- Delete
- Enable/Disable

==================================================
ADMIN PROJECTS
==================================================

Fields:

- Project Name
- Location
- Category
- Description
- Image
- Status

Actions:

- Add
- Edit
- Delete
- Enable/Disable

==================================================
ADMIN GALLERY
==================================================

Fields:

- Image
- Title
- Category
- Description
- Status

Actions:

- Add
- Edit
- Delete
- Enable/Disable

Use mock image URLs.

==================================================
ADMIN TESTIMONIALS
==================================================

Fields:

- Customer Name
- Location
- Rating
- Testimonial
- Avatar
- Status

Actions:

- Add
- Edit
- Delete
- Enable/Disable

==================================================
ADMIN CONTACT LEADS
==================================================

All submissions from the public Contact Form should appear here.

Display:

- Name
- Phone
- Email
- Service
- Message
- Date
- Status

Statuses:

- New
- Contacted
- Closed

Admin should be able to change lead status.

Provide:

- View
- Delete
- Mark Contacted
- Mark Closed

Use localStorage only.

==================================================
ADMIN SETTINGS
==================================================

Create a Settings section where admin can edit:

Business Name
Phone
Email
Address
About Text
Hero Heading
Hero Description
Footer Information

The updated information should reflect on the public website.

Use localStorage.

==================================================
DATA / MOCK DATA
==================================================

IMPORTANT:

NO DATABASE.

Create centralized mock data.

Example structure:

src/data/

services.js
products.js
projects.js
gallery.js
testimonials.js
leads.js

Use localStorage to simulate persistence.

When the demo starts for the first time:

- Load default mock data
- Save it to localStorage
- Use localStorage afterwards

Do not use any backend.

==================================================
RESPONSIVE DESIGN
==================================================

The complete website must work properly on:

- Desktop
- Laptop
- Tablet
- Mobile

Admin panel must also be responsive.

On mobile:
- Sidebar should become a collapsible menu
- Tables should be horizontally scrollable or converted into cards
- Forms should stack vertically

==================================================
UI / UX
==================================================

Use:

- Modern cards
- Rounded corners
- Clean shadows
- Proper spacing
- Professional typography
- Hover effects
- Smooth transitions
- Clear CTA buttons
- Responsive grids
- Accessible labels
- Loading states where appropriate
- Empty states
- Confirmation dialogs for delete actions

Avoid excessive animations.

Keep the interface professional and suitable for a solar-energy company.

==================================================
IMPORTANT ADMIN/PUBLIC CONNECTION
==================================================

This is a DEMO, but it should behave like a real CMS.

If admin adds/edits/deletes:

Services
Products
Projects
Gallery
Testimonials
Business Settings

the public website must update using localStorage.

Example:

Admin adds a new service
→ service appears automatically on public Services section.

Admin edits phone number
→ updated phone appears on Header/Footer/Contact.

Admin disables a gallery item
→ it disappears from public Gallery.

Admin submits contact form
→ lead appears in Admin Leads.

==================================================
REFERENCE REQUIREMENT
==================================================

Use these references for the structure and UI concept:

Public:
https://sunshine-admin-portal.lovable.app/

Admin:
https://sunshine-admin-portal.lovable.app/admin

Inspect the reference carefully.

Keep the SAME GENERAL:
- Page structure
- Navigation concept
- Admin sidebar concept
- Dashboard concept
- CRUD workflow
- Field organization
- Forms
- Tables/cards
- Buttons
- Admin/public relationship

But customize the branding completely for:

Sartaj Solar Water System

Do NOT copy the reference business identity.

==================================================
FINAL REQUIREMENTS
==================================================

1. React + Vite + Tailwind CSS ONLY.
2. No database.
3. No backend.
4. No unnecessary libraries.
5. Mock data only.
6. localStorage can be used for demo persistence.
7. Fully responsive.
8. Public website + Admin Panel.
9. Admin login required.
10. Admin redirect link in footer.
11. Admin should manage most website modules.
12. Public website should reflect admin changes.
13. Hero must contain solar-water-system banner images.
14. Use solar-energy appropriate color palette.
15. Use the actual Sartaj Solar Water System contact details provided above.
16. Do not leave reference business name anywhere.
17. Do not use fake certifications/claims.
18. Make the project polished and presentation-ready as a client DEMO.
19. Ensure all routes work correctly.
20. Ensure there are no broken buttons, empty pages, or placeholder navigation.
21. Add sensible default mock content so every section looks complete on first load.
22. Keep all editable/mock data organized and easy to modify.
23. Make the Admin Panel visually consistent with the public website.
24. Do not add any technology/library outside React + Vite + Tailwind CSS.


plan:-
The project setup and implementation plan were prepared, but the website and admin panel were not built because workspace credits ran out before code changes could be applied. Further implementation and testing require available credits.

clone the repo and implement the plan

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fe68814c-1eb7-44d3-8a5d-f1d725c1767e).

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

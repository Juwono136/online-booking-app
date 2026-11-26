# 🚗 RodaRent — Online Vehicle Rental Booking System

## 📖 Project Overview

This is a responsive web application for a **car and motorcycle rental booking system** (**RodaRent**). It enables customers to sign up or log in (via form or Google SSO), pick rental dates, filter available vehicles, lock a unit for checkout, proceed to payment, and view or access digital booking tickets. It is built using **HTML5**, **CSS3**, **JavaScript**, and **jQuery**.

- URL Link to website: `[Add your live URL here]`
- URL Link to website design: `[Add your Figma/Canva design link here]`

## 🎯 Purpose

The goal of this project is to:

- Practice responsive web design and modular front-end development
- Implement interactive date calculation, category filtering, and booking hold states with jQuery
- Support a clear end-to-end rental flow from account sign-in to digital pickup ticket access

## 👥 Target Audience

This platform is designed for:

- [✅] General users / customers looking to rent cars or motorcycles
- [✅] Rental business administrators managing fleet availability, bookings, and tickets

  > _Note: Payment gateway processing and admin management views can be connected to a backend API or simulated for front-end testing._

## 🧱 Technologies Used

- HTML5
- CSS3 (CSS Grid, Flexbox, CSS Variables, Media Queries)
- JavaScript (ES6+)
- jQuery (`3.7.1`)

## 📐 Layout & Sections

The web application includes the following sections and interactive features:

- **Top Navigation Bar** – Brand identity (`RodaRent`), section links (`Fleet Catalog`, `My Tickets`, `Checkout`), and `Google Sign-In` / `Sign Up` actions
- **Hero & Status Grid** – Booking flow summary, pickup/return date inputs with automatic duration calculation, `Fleet Ready Now` counter, and `Active Ticket` preview card with a `Show QR` modal
- **Available Fleet Catalog** – Date range badge, category filter pills (`All Vehicles`, `Cars`, `Motorcycles`), and dynamic vehicle cards with `Reserve Unit` buttons
- **Checkout Hold Bar** – Displays the selected vehicle, rental duration, 10-minute inventory hold notice, total price in Rupiah, and `Proceed to Payment` trigger
- **Interactive Modals** – Handles Google SSO sign-in, account registration form, QR pickup ticket display, and payment gateway checkout flow

## 📱 Responsiveness

The site is optimized for:

- Desktop
- Tablet
- Mobile

> Responsive design is achieved using CSS Grid, Flexbox, and media queries across desktop (`> 1024px`), tablet (`≤ 1024px`), and mobile (`≤ 768px`) viewports.

## 🧪 How to Run Locally

1. Open your code editor (e.g., Visual Studio Code).
2. In your code editor, open the terminal.
3. Clone the repository:
   ```bash
   git clone https://github.com/your-username/rodarent-web.git
   ```
4. Open `index.html` in your browser, or run the website locally using the **Live Server** extension in Visual Studio Code.

## 📂 Folder Structure

```text
rodarent-web/
│
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── data.js
│   └── app.js
└── README.md
```

## 📄 Notes

- jQuery is loaded via CDN in `index.html` and used in `js/app.js` for DOM updates, event handling, and interactive modals.
- Fleet sample data is stored in `js/data.js` and can be replaced with live data from a backend REST API.
- Authentication and payment gateway actions in the front-end prototype can be wired to real OAuth 2.0 and payment gateway endpoints during backend integration.

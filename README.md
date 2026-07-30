# Intervelox

Hotel discovery and booking prototype for Colombia, built around a distinctive early concept: **flash hotel deals with substantial discounts available only for a limited time**.

[View live application](https://intervelox.vercel.app)

## Project Story

Intervelox began in 2022 as an academic web-programming and database project created by two students from Universidad Industrial de Santander.

The original idea was to help travelers search and compare Colombian hotels while giving participating hotels a channel for releasing highly discounted rooms during short promotional windows. Unlike conventional coupon systems, the discount belonged to a specific hotel offer and expired when its countdown ended.

The first implementation used PHP, MySQL, HTML, CSS, JavaScript, jQuery, and Leaflet. It established the visual concept, hotel catalog, location search, map, contact registration, and an automatic flash-offer popup. However, the original database schema was not preserved, and search and booking buttons were only visual.

This repository now includes a reconstructed public demo that preserves the original concept while making its main experience interactive and deployable.

## Current Demo Features

- Search hotels by Colombian destination
- Select arrival and departure dates
- Validate the date range
- Choose the number of guests
- Filter the hotel catalog by city
- Compare nightly prices, ratings, and amenities
- Explore time-limited flash deals with a live countdown
- Receive a delayed animated flash-offer invitation after browsing
- Confirm before dismissing a flash promotion without removing it from the catalog
- View hotel locations on an interactive Leaflet/OpenStreetMap map
- Filter destinations such as San Gil and focus the map on matching hotels
- Calculate the number of nights and reservation total
- Create non-commercial demonstration reservations
- Generate a unique reservation reference
- Review reservations stored locally in the visitor's browser
- Submit a demonstration contact form
- Responsive navigation and layouts for desktop, tablet, and mobile
- Accessible labels, keyboard-friendly dialogs, feedback messages, and basic security headers

## Flash Deal Concept

The flash-sale workflow is central to Intervelox:

1. A hotel makes a limited number of discounted rooms available.
2. Intervelox publishes the original price and the temporary deal price.
3. A visible countdown communicates the remaining promotional window.
4. The traveler books before the offer expires.

The current version resets a two-hour demonstration window locally so reviewers can always experience this interaction.

## Technology

### Reconstructed public demo

- HTML5
- Modern CSS
- Vanilla JavaScript
- Vercel Functions
- Leaflet
- OpenStreetMap
- Browser Local Storage

### Original academic implementation

- PHP
- MySQL / MySQLi
- HTML
- CSS
- JavaScript
- jQuery
- Leaflet

## Project Structure

```text
Intervelox/
├── api/
│   ├── contact.js          # Demonstration contact endpoint
│   └── reservations.js     # Reservation validation and reference generation
├── imagenes/
│   ├── Logo.jpg                         # Original 2022 logo
│   └── intervelox-logo-restored.png     # Restored logo with corrected name
├── index.html              # Current public application
├── intervelox.css          # Responsive visual system
├── intervelox.js           # Search, offers, map, reservations, and contact flows
├── vercel.json             # Deployment and security-header configuration
├── index.php               # Original 2022 home page
├── contact.php             # Original database-backed contact page
├── con_db.php              # Original local MySQL connection
└── registrar.php           # Original contact insert workflow
```

The additional HTML, CSS, and JavaScript files at the repository root are preserved as part of the original 2022 implementation.

## Run Locally

The public demo has no build step.

For the complete local experience, including the demonstration API:

```bash
npx vercel dev --local
```

Then open the local address shown in the terminal.

A basic static server can also display the interface, but reservation and contact submissions require the API endpoints.

## Run the Original PHP/MySQL Version

The original 2022 implementation was designed to run locally with XAMPP. These steps preserve the workflow documented in the first version of the project:

1. Download and install [XAMPP](https://www.apachefriends.org/).
2. Place the repository inside XAMPP's `htdocs` directory. For example:

   ```text
   C:\xampp\htdocs\intervelox
   ```

3. Open `xampp-control.exe`.
4. Start the **Apache** and **MySQL** services.
5. Open the original application at:

   ```text
   http://localhost/intervelox/index.php
   ```

6. Open phpMyAdmin in another browser tab to inspect the local database:

   ```text
   http://localhost/phpmyadmin
   ```

The legacy connection file expects a MySQL database named `registro` running on `localhost`, with the default XAMPP user `root` and no password:

```php
mysqli_connect("localhost", "root", "", "registro");
```

The original contact workflow used a table named `datos`. Its fields were `id`, `name`, `email`, `elpepe`, and `etesech`; the final two were provisional names used for the subject and message. Because the original SQL export was not committed, the exact database schema and historical records cannot be recovered from this repository alone.

This XAMPP version is retained for historical and academic reference. The deployed application uses the reconstructed demo and does not require PHP, MySQL, XAMPP, or phpMyAdmin.

## Demo Data and Limitations

- Hotel and price information is illustrative and does not represent current commercial availability.
- Reservations are demonstrations and do not charge the visitor or contact a hotel.
- Reservation history is stored only in the current browser.
- Contact messages are validated but not delivered to an external inbox.
- The original MySQL schema and production data were not available in the repository.

## Main Improvements over the Original Version

- Repaired broken navigation and replaced missing `index.html`
- Standardized the brand name as **Intervelox**
- Replaced expired logo and image dependencies in the primary interface
- Implemented the previously visual-only hotel search
- Implemented actual flash-deal countdown behavior
- Implemented reservation calculation and confirmation
- Added clear demo boundaries instead of presenting simulated data as real inventory
- Removed the public demo's dependency on a local XAMPP/MySQL installation
- Replaced unsafe raw contact insertion in the deployed experience
- Corrected invalid and duplicated HTML structure
- Added responsive and accessible interaction patterns

## Academic Context

Intervelox demonstrates early product ideation, frontend development, relational-database integration, map integration, form handling, and the evolution of a prototype into a functional portfolio demo.

This is an academic project and is not affiliated with the hotels displayed.

# PRATIK PHATAKE (प्रतीक फटाके)
### Authorized Fireworks Retail Business Management & Multilingual Product Catalog

[![Angular](https://img.shields.io/badge/Angular-22.2.2-DD0031?style=flat&logo=angular)](https://angular.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.3-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore%20%7C%20Storage-FFCA28?style=flat&logo=firebase)](https://firebase.google.com/)
[![PESO Certified](https://img.shields.io/badge/PESO-Certified%20Retailer-green?style=flat)](https://peso.gov.in/)
[![Green Crackers](https://img.shields.io/badge/CSIR--NEERI-Green%20Crackers-emerald?style=flat)](https://www.neeri.res.in/)

---

## 1. Business & Legal Overview

**PRATIK PHATAKE (प्रतीक फटाके)** is a production-ready, digital fireworks business management platform and customer catalog web application built for an authorized, licensed retail fireworks establishment in Pune, Maharashtra.

### ⚖️ Statutory Legal Compliance Notice
In strict accordance with Indian legal frameworks, the Supreme Court of India directives, and PESO (Petroleum and Explosives Safety Organisation) retail regulations:
- **Zero Online Checkout or Transactions:** The platform **strictly prohibits and excludes** online payment gateways, digital shopping carts for explosive materials, and courier home-delivery mechanisms.
- **Store-Visit Inquiry Model:** The application operates on an authentic **digital catalog exploration and non-binding store inquiry** model.
- **Green Crackers Certification:** Every listed firework is categorized under verified CSIR-NEERI Green Cracker formulations (SWAS, STAR, SAFAL) offering 30% lower particulate emissions and barium-free compositions.

---

## 2. Technology Stack

- **Frontend Framework:** Angular **22.2.2** (Standalone Components, Signals, OnPush change detection, Reactive Forms)
- **Styling & UI:** Tailwind CSS **4.3.3** (Tailwind v4 PostCSS integration, `@theme` token blocks, custom responsive festive palettes)
- **Cloud Infrastructure:** Firebase (Authentication, Cloud Firestore, Firebase Storage, Firebase Hosting)
- **Internationalization (i18n):** Native signal-based Multilingual Translation Engine supporting **Marathi (मराठी - Default)**, **Hindi (हिंदी)**, and **English**.
- **Testing Engine:** Vitest + Angular Build Unit Test runner.

---

## 3. Key Features

### 🎆 Customer-Facing Public Experience
1. **Festive Homepage (`/`):**
   - High-impact visual hero banner with sparkle ambiance and Devanagari typography.
   - Category exploration tiles (Sparklers, Chakkars, Flower Pots, Fountains, Sky Shots, Assortments, Green Crackers, Novelties).
   - Featured & best-selling fireworks carousel.
   - Statutory compliance alert container.
   - Physical store details, timings, phone call trigger, and Google Maps direction launcher.
2. **Dynamic Product Catalog (`/products`):**
   - Live instant search by firework name (Marathi/Hindi/English) and SKU.
   - Category filtering pills with smooth transitions.
   - Price-range sorting (Low to High, High to Low, Popularity, Alphabetical).
   - In-stock availability toggle filter and responsive pagination.
3. **Product Details View (`/products/:slug`):**
   - High-resolution gallery with thumbnail switcher.
   - Retail price and stock level indicator.
   - Technical specifications: sound rating, visual effect, pieces per pack.
   - CSIR-NEERI green cracker identification code.
   - Product safety instructions and pre-filled inquiry launcher.
   - Related fireworks recommendations.
4. **All Categories Page (`/categories`):** Visual card breakdown of all 8 fireworks categories.
5. **Festive Offers (`/offers`):** Curated Diwali family packages and festival hampers.
6. **Store Stock Inquiry (`/inquiry`):**
   - Non-binding customer inquiry form with multi-product selection.
   - Mandatory statutory compliance consent checkbox.
   - Automatic unique tracking reference generation (`INQ-2026-XXXX`).
   - Direct WhatsApp launcher pre-formatted with inquiry items.
7. **Safety & Regulations (`/safety`):** Official Do's and Don'ts, child safety rules, storage protocols, emergency helpline numbers (101, 108, 112).
8. **About Us (`/about`) & Contact (`/contact`):** Business credentials, PESO license disclosures, and physical store locator.

---

### 🛡️ Back-Office Admin Suite (`/admin`)
1. **Executive Dashboard (`/admin/dashboard`):**
   - Real-time KPI metrics: Total Products, Active Catalog, Out of Stock, Low Stock Warnings, Total Inquiries, Pending Inquiries, Inventory Valuation (₹).
   - Recent inquiries table with quick status transitions.
   - Critical low-stock warning table.
   - Live audit trail log feed.
2. **Product Catalog CRUD (`/admin/products`):**
   - Add/Edit/Delete products with reactive forms and validation.
   - Image URL preview, multilingual labels, retail and cost pricing (restricted).
   - CSV export and import.
3. **Inventory Movements & Stock Adjustment (`/admin/inventory`):**
   - Atomic inventory adjustments: `STOCK_IN`, `STOCK_OUT`, `DAMAGE`, `ADJUSTMENT`.
   - Comprehensive movement history audit table with delta, previous/new quantities, reasons, and user timestamps.
4. **Inquiry Pipeline Tracking (`/admin/inquiries`):**
   - Lifecycle stages: `New` ➔ `Contacted` ➔ `In Review` ➔ `Closed` ➔ `Cancelled`.
   - Staff internal notes modal.
   - Click-to-call phone and WhatsApp contact launcher.
   - Date filtering and CSV export.
5. **Customer Directory (`/admin/customers`):** Consolidated inquiring customer profiles with inquiry counts and consent records.
6. **Campaign Banners (`/admin/banners`):** Promotional hero banner scheduling with start and end dates.
7. **Category Manager (`/admin/categories`):** Dynamic category hierarchy, sort order, and status toggles.
8. **Business Reports (`/admin/reports`):**
   - Printable Inventory Valuation Statement.
   - Low-Stock Reorder Report.
   - Customer Interest Ranking.
   - CSV exports and print preview.
9. **Staff Authorization (`/admin/users`):**
   - Role-based authorization (`Super Admin`, `Store Manager / Admin`, `Staff`).
10. **Store Settings (`/admin/settings`):**
    - Store details, phone, WhatsApp, physical address, business hours, license credentials, GSTIN, and statutory legal disclosures.
    - One-click "Reset Catalog to Demo Data" trigger.

---

## 4. Quick Start & Local Development

### Prerequisites
- Node.js `v20.x` or `v24.x`
- npm `v10.x` or `v11.x`

### Installation
```powershell
# Clone or navigate to the project directory
cd d:\Hotel

# Install dependencies
npm install

# Start development server
npm start
```
Navigate to `http://localhost:4200` in your browser.

### Test Credentials (Instant Access)
For review and evaluation, use the one-click demo credentials buttons on the login page (`/admin/login`):

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin@pratikphatake.com` | `admin123` | Full access, settings, staff management, audit log |
| **Store Manager** | `admin@pratikphatake.com` | `admin123` | Products, inventory movements, inquiries, reports |
| **Billing Staff** | `staff@pratikphatake.com` | `staff123` | Inquiry viewing, customer contact, stock checks |

*(You can also freely switch roles anytime using the role badges inside the admin sidebar!)*

---

## 5. Verification & Testing

### Running Automated Unit Tests
```powershell
npm test -- --watch=false
```
Executes 10 automated unit test suites covering the root application, `TranslationService`, `ProductService`, `InquiryService`, `InventoryService`, and `AuthService`.

### Running Production Build
```powershell
npm run build
```
Generates an optimized, tree-shaken, code-split production bundle inside `dist/pratik-phatake/browser` ready for Firebase Hosting.

---

## 6. Physical Store Location

**Pratik Phatake (प्रतीक फटाके)**  
Shop No. 12, Phatake Galli, Laxmi Road, Pune, Maharashtra 411030  
- **PESO License:** PESO-PUN-RET-2024/7890  
- **Phone:** +91 98220 12345  
- **WhatsApp:** +91 98220 12345  
- **Hours:** 9:00 AM – 10:00 PM (All 7 Days during festive seasons)

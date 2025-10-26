# Multi-Warehouse Inventory Management System

## Overview
Enhance the existing Multi-Warehouse Inventory Management System built with Next.js and Material-UI (MUI) for GreenSupply Co, a sustainable product distribution company. The current system is functional but needs significant improvements to be production-ready.

## 🎯 Business Context
GreenSupply Co distributes eco-friendly products across multiple warehouse locations throughout North America. They need to efficiently track inventory across warehouses, manage stock movements, monitor inventory values, and prevent stockouts. This system is critical for their daily operations and customer satisfaction.

## 🛠️ Tech Stack
- [Next.js](https://nextjs.org/) - React framework
- [Material-UI (MUI)](https://mui.com/) - UI component library
- [React](https://reactjs.org/) - JavaScript library
- JSON file storage (for this assessment)

## 📋 Current Features (Already Implemented)
The basic system includes:
- ✅ Products management (CRUD operations)
- ✅ Warehouse management (CRUD operations)
- ✅ Stock level tracking per warehouse
- ✅ Basic dashboard with inventory overview
- ✅ Navigation between pages
- ✅ Data persistence using JSON files

**⚠️ Note:** The current UI is intentionally basic. We want to see YOUR design skills and creativity.

---

## 🚀 Your Tasks (Complete ALL 3)

---

## Task 1: Redesign & Enhance the Dashboard

**Objective:** Transform the basic dashboard into a professional, insightful command center for warehouse operations.

### Requirements:

Redesign the dashboard to provide warehouse managers with actionable insights at a glance. Your implementation should include:

- **Modern, professional UI** appropriate for a sustainable/eco-friendly company
- **Key business metrics** (inventory value, stock levels, warehouse counts, etc.)
- **Data visualizations** using a charting library of your choice
- **Enhanced inventory overview** with improved usability
- **Fully responsive design** that works across all device sizes
- **Proper loading states** and error handling

Focus on creating an interface that balances visual appeal with practical functionality for daily warehouse operations.

---

## Task 2: Implement Stock Transfer System

**Objective:** Build a complete stock transfer workflow with proper business logic, validation, and data integrity.

### Requirements:

**A. Stock Transfer System**

Build a complete stock transfer system that allows moving inventory between warehouses. Your implementation should include:

- Data persistence for transfer records (create `data/transfers.json`)
- API endpoints for creating and retrieving transfers
- Proper validation and error handling
- Stock level updates across warehouses
- Transfer history tracking

Design the data structure, API contracts, and business logic as you see fit for a production system.

**B. Transfer Page UI**

Create a `/transfers` page that provides:
- A form to initiate stock transfers between warehouses
- Transfer history view
- Appropriate error handling and user feedback

Design the interface to be intuitive for warehouse managers performing daily operations.

---

## Task 3: Build Low Stock Alert & Reorder System

**Objective:** Create a practical system that helps warehouse managers identify and act on low stock situations.

### Requirements:

Build a low stock alert and reorder recommendation system that helps warehouse managers proactively manage inventory levels.

**Key Functionality:**
- Identify products that need reordering based on current stock levels and reorder points
- Categorize inventory by stock status (critical, low, adequate, overstocked)
- Provide actionable reorder recommendations
- Allow managers to track and update alert status
- Integrate alerts into the main dashboard

**Implementation Details:**
- Create an `/alerts` page for viewing and managing alerts
- Calculate stock across all warehouses
- Persist alert tracking data (create `data/alerts.json`)
- Design appropriate status workflows and user actions

Use your judgment to determine appropriate thresholds, calculations, and user workflows for a production inventory management system.

---

## 📦 Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Screen recording software for video submission (Loom, OBS, QuickTime, etc.)

### Installation
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser to http://localhost:3000

Implementation SummaryName: Hamid Akhavan
Completion Time: Approximately 16 hours (October 24-26, 2025)Features Completed:Task 1: Dashboard Redesign  Created a modern dashboard using Material-UI Cards and Grid for a clean, professional look.  
Added key metrics: total inventory value, number of warehouses, and count of low stock alerts.  
Used Chart.js to show stock levels and alert status with bar and doughnut charts.  
Made the dashboard responsive for mobile and desktop using MUI Grid.  
Added loading states with CircularProgress and error messages with Alert.  
Applied green theme (#2e7d32, #4caf50) to match GreenSupply Co’s eco-friendly brand.

Task 2: Stock Transfer System  Built a /transfers page with a form using MUI Autocomplete for products and warehouses, and TextField for quantity.  
Added validation to check for empty fields and same source/destination warehouses, with errors shown in a Snackbar.  
Created a scrollable table to display transfer history (Product, Source, Destination, Quantity, Actions).  
Implemented API endpoints: GET /api/transfers (list transfers) and POST /api/transfers (create transfer).  
Updated data/stock.json after each transfer to reflect new stock levels.  
Stored transfer records in data/transfers.json.

Task 3: Low Stock Alert & Reorder System  Created an /alerts page to show low stock products (Critical: <10 units, Low: <50 units).  
Added a dropdown to filter alerts by status (All, Critical, Low) and a "Resolve" button for each alert.  
Generated alerts automatically by comparing data/stock.json with reorderPoint in data/products.json.  
Stored alerts in data/alerts.json with fields: id, productId, warehouseId, status, reorderAmount, resolved.  
Built API endpoints: GET /api/alerts (list alerts) and POST /api/alerts/resolve (mark alert as resolved).  
Integrated alerts into the dashboard for quick access.

Key Technical Decisions:Used Material-UI for a consistent, responsive UI with built-in components like Grid and Snackbar.  
Implemented useMediaQuery for the sidebar to switch between permanent (desktop) and temporary (mobile) modes.  
Chose Snackbar for user feedback on form errors and actions (e.g., transfer success, alert resolution).  
Selected Chart.js for simple, clear visualizations in the dashboard.  
Kept JSON files for data storage as per assignment requirements, ensuring simplicity.  
Applied a custom MUI theme with green colors (#2e7d32, #4caf50) to align with the eco-friendly brand.

Known Limitations:JSON files limit scalability compared to a database like MongoDB.  
No real-time notifications (e.g., email or push) for low stock alerts.  
Limited error handling for edge cases, such as corrupted JSON files.  
No advanced filtering in tables (e.g., by date or product category).  
No unit tests due to time constraints, but code is structured for future testing.

Testing Instructions:Clone the repository: git clone https://github.com/hamidak22/inventory-management-task.git.  
Install dependencies: npm install.  
Ensure JSON files (products.json, stock.json, warehouses.json, transfers.json, alerts.json) are in the data/ folder.  
Run the app: npm run dev.  
Open http://localhost:3000 in a browser.  
Test features:  Dashboard: Check metrics and charts, resize browser to test responsiveness.  
Transfers: Submit a valid transfer and an invalid one (e.g., empty quantity) to see Snackbar errors.  
Alerts: Filter by Critical or Low, resolve an alert, and check Snackbar feedback.  
Sidebar: Resize browser to mobile view (<600px) to test the hamburger menu.

Video Walkthrough Link: https://www.loom.com/share/8c0f31d1efa04ad09ceb241236da34d3  New Dependencies:chart.js (for dashboard charts)
@mui/icons-material (for sidebar and button icons)

Additional Notes:The project meets all three task requirements with a focus on usability for warehouse managers.  
The UI is clean and responsive, with a green theme to match the brand.  
The code is organized with reusable components (e.g., Sidebar, TransfersPage) for maintainability.


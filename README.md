# 🛍️ Yajara - E-Commerce Website

Yajara is a modern e-commerce web application built to provide a smooth and responsive shopping experience. It includes category-wise product listings, filters, pagination, and a clean UI for both desktop and mobile users.

---

## 🚀 Features

### 🏠 Home Page
- **Header:** Contains logo, navigation menu, and utility icons (wishlist, cart, etc.)
- **Slider Banner:** Displays promotional banners with smooth transitions.
- **Category Menu:** Shows main product categories.
- **Main Layout:** Split into `Aside` and `Body` sections:
  - **Aside Section:**
    - Subcategory menu with filter options
    - Advertisement banner area
    - Best Seller section (displays 5 top products)
  - **Body Section:**
    - Displays all products with pagination support
- **Footer:** Contains useful links and site info.

---

## 📂 Project Structure

```bash
src/
├── app/
│   ├── (root)/
│   │   ├── category/
│   │   │   ├── [subcategory]/
│   │   │   │   └── [product]/
│   │   │   │       ├── page.jsx       # Product Details Page
│   │   │   │       └── ...
│   │   │   └── page.jsx               # Category Page
│   │   ├── layout.jsx                 # Main layout for client pages
│   │   ├── page.jsx                   # Home Page
│   │   └── ...
│   └── (admin)/                       # Admin-specific pages (if available)
│
├── components/
│   ├── Header/
│   ├── Footer/
│   ├── Slider/
│   ├── CategoryMenu/
│   ├── ProductCard/
│   ├── FilterSidebar/
│   └── ...
│
├── context/
│   ├── CartContext.js
│   ├── WishlistContext.js
│   └── ...
│
├── utils/
│   └── api.js                         # API functions (fetch, post, delete)
│
└── styles/
    └── globals.css

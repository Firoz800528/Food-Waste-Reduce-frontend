# ♻️ Local Food Waste Reduction Platform

A full-stack MERN-based platform designed to reduce food waste by connecting **Restaurants**, **Charities**, and **Users**. Restaurants can donate surplus food, Charities can request and pick up verified donations, and Users can browse, favorite, and review donations.

### 🔗 Live Site
[🌐 Visit Website](https://foode-waste-platform.web.app/)

### 🛠 Admin Credentials
- **Username (Email):** admin@food.com  
- **Password:** 123456

---

## 🌟 Features

- ✅ **JWT Authentication** with Firebase Login and Register support (including Google login).
- 🔐 **Role-based dashboards** for User, Charity, Restaurant, and Admin.
- 🏢 **Restaurant role** can add, edit, and manage their food donations.
- 🧑‍🤝‍🧑 **Charity role** can request, track, and manage received donations.
- 👥 **User dashboard** includes profile, charity role request (with Stripe payment), favorites, reviews, and transaction history.
- 💳 **Stripe Integration** for charity role upgrade payments.
- 🧾 **Admin Panel** to manage users, change roles, verify donations, and handle role requests.
- 📝 **Review system** where users can post and delete reviews on donations.
- ❤️ **Favorites system** for users to save favorite donations.
- 📊 **Dashboard stats and charts** for role-based data visualization.
- 📷 **Image upload support** in donations with secure data handling.
- 🔎 **Donation browsing** with search, filtering, and detailed views.

---

## 🚀 Tech Stack

- **Frontend:** React.js, Tailwind CSS, DaisyUI, React Router
- **Backend:** Express.js, MongoDB (Native Driver)
- **Authentication:** Firebase Auth + JWT
- **Payment:** Stripe API
- **State Management:** React Query (TanStack Query)
- **Deployment:** Vercel (Frontend), Vercel/Render (Backend)

---

## 📁 Project Structure


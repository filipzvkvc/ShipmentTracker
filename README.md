# Shipment Tracker

A full-stack web application for managing shipments, sub-shipments, and cargo deliveries. Supports multiple user roles with different levels of access.

## 🌐 Live Demo

[https://shipment-tracker-gilt.vercel.app](https://shipment-tracker-gilt.vercel.app/login)

## Features

- Manage shipments, sub-shipments, countries, item types and users
- Role-based access (Admin, Employee, Client)
- Statistics dashboard with charts
- Password reset via email
  
## Test Accounts

| Role     | Email                 | Password |
|----------|-----------------------|----------|
| Admin    | admin@admin.com       | admin    |
| Employee | employee@employee.com | employee |
| Client   | client@client.com     | client   |

## Tech Stack

**Frontend**
- React
- Redux + Redux Thunk
- Material-UI
- React Router
- Axios

**Backend**
- Node.js + Express
- Sequelize ORM
- MySQL (TiDB Cloud)
- JWT Authentication
- Cloudinary (file storage)
- Brevo (email)

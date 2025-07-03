# Agres ID - Ecommerce Platform

Internal ecommerce platform for **Agres ID**. Built with Next.js 15, TypeScript, and Tailwind CSS, this platform provides ecommerce solution with advanced features to manage Agres ID's online store.

## Key Features

### 🛍️ **Product Management**
- **Complete Product Catalog**: Product management system with categories, variants, and custom attributes
- **Product Variants**: Support for multiple colors, sizes, and images for each product
- **SKU Management**: Automatic SKU system for inventory tracking
- **Dynamic Pricing**: Flexible discount and special pricing system
- **Stock Management**: Real-time stock tracking with automatic notifications

### 💳 **Payment System**
- **Midtrans Integration**: Bank transfer, e-wallet, and credit card payments
- **Stripe Payment**: International payments with multi-currency support
- **Multiple Payment Methods**: Bank transfer, e-wallet, credit card, and COD
- **Payment Status Tracking**: Real-time payment status tracking
- **Secure Transactions**: End-to-end encryption for transaction security

### 🛒 **Shopping Experience**
- **Shopping Cart**: Persistent shopping cart with localStorage
- **Wishlist**: Wishlist system for saving favorite products
- **Quick View**: Quick product preview without leaving the page
- **Product Search**: Advanced product search with Algolia
- **Product Filtering**: Filter by category, price, and attributes
- **Product Reviews**: Product review and rating system

### 👤 **User Management**
- **Authentication**: Login with email/password, Google, and GitHub OAuth
- **User Profiles**: User profile management with multiple addresses
- **Order History**: Complete order history with tracking
- **Address Management**: Shipping and billing address system
- **Role-based Access**: Admin, Manager, and User roles

### 📊 **Admin Dashboard**
- **Analytics Dashboard**: Analytics dashboard with Chart.js
- **Order Management**: Order management with status tracking
- **Product Management**: Product CRUD with bulk operations
- **Customer Management**: Customer management and their data
- **Sales Reports**: Sales reports and business analytics
- **Inventory Management**: Stock tracking and low stock alerts

### 🎨 **Content Management**
- **Blog System**: Blog system with categories and authors
- **Hero Banners**: Promotional banner management
- **Countdown Timers**: Countdown timers for flash sales
- **SEO Management**: SEO optimization with dynamic meta tags
- **Content Editor**: Rich text editor with Quill.js

### 🚚 **Shipping & Logistics**
- **Multiple Shipping Methods**: DHL, FedEx, and custom shipping
- **Shipping Calculator**: Automatic shipping cost calculation
- **Order Tracking**: Real-time shipping status tracking
- **Address Validation**: Shipping address validation

### 🎯 **Marketing & Promotions**
- **Coupon System**: Coupon system with usage limitations
- **Discount Management**: Product and category discount management
- **Email Marketing**: Automatic emails for order confirmation
- **Newsletter**: Newsletter system with Formbold integration

### 🔍 **Search & Discovery**
- **Algolia Search**: Advanced product search with AI
- **Product Recommendations**: Product recommendations based on behavior
- **Category Navigation**: Intuitive category navigation
- **Product Tags**: Product tagging system for discovery

### 📱 **Responsive Design**
- **Mobile-First**: Responsive design for all devices
- **Progressive Web App**: PWA features for mobile experience
- **Touch-Friendly**: Interface optimized for touch devices
- **Fast Loading**: Performance optimization with Next.js 15

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type safety and developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **Redux Toolkit**: State management
- **React Hook Form**: Form handling
- **Swiper**: Touch slider for carousel

### **Backend**
- **Next.js API Routes**: Serverless API endpoints
- **Prisma ORM**: Database ORM with type safety
- **PostgreSQL**: Main database
- **NextAuth.js**: Authentication system
- **Midtrans**: Indonesian payment gateway
- **Stripe**: Payment processing

### **Third-Party Services**
- **Cloudinary**: Image hosting and optimization
- **Algolia**: Search engine
- **Resend / Brevo**: Email service
- **Formbold**: Form handling

## 🚀 Installation

### Prerequisites
- Node.js 19.0.0 or higher
- npm 10.0.0 or higher
- PostgreSQL database
- Git

### Setup Environment
Create a `.env` file in the root directory:

## 📈 Analytics Features

### Sales Analytics
- Daily/monthly/yearly total sales
- Best-selling products
- Most popular categories
- Customer behavior analysis

### Performance Metrics
- Page load times
- Search performance
- Conversion rates
- User engagement

## 🔒 Security Features

- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control
- **Data Encryption**: End-to-end encryption
- **Rate Limiting**: Protection against abuse
- **CSRF Protection**: Cross-site request forgery protection

## 📱 Mobile Features

- **Responsive Design**: Optimal on all devices
- **Touch Gestures**: Gesture support for mobile
- **Offline Support**: Basic offline functionality
- **Push Notifications**: Real-time notifications

## 🌐 Internationalization

- **Currency Support**: Multiple currency support
- **Localization**: Adaptation for local markets
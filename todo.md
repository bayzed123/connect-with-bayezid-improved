# Connect With Bayezid - Project TODO

## Core Features (Completed)
- [x] Home page with hero section and services
- [x] Blog system with database storage
- [x] Blog detail pages with markdown rendering
- [x] News/Links management system
- [x] Client reviews submission and approval workflow
- [x] Admin panel with password protection
- [x] Analytics dashboard with visitor tracking
- [x] Google Analytics and GTM integration
- [x] Contact form with email notifications
- [x] Navigation menu with all pages

## In Progress
- [x] Blog comments system - Allow readers to leave comments on blog posts
- [x] Newsletter signup form - Add email subscription in footer to build mailing list

## In Progress - Products/Services System
- [x] Products page with listing and filtering
- [x] Product detail page with purchase form
- [x] Products management in Admin Dashboard
- [x] Orders management in Admin Dashboard
- [x] Navigation menu for Products
- [x] Database schema for products, orders, and promotions
- [x] Backend API endpoints for all operations
- [x] Unit tests for products and orders

## In Progress - Blog Moderation & Visitor Submissions
- [x] Blog comment moderation UI in admin dashboard
- [x] Visitor blog submission page
- [x] Blog status indicators (Published/Private/Pending)
- [ ] Blog submission approval workflow
- [ ] Admin dashboard blog status filtering
- [ ] Admin auto-publish feature for admin-authored blogs
- [ ] Fix blog title truncation in admin dashboard
- [x] Add AdSense monetization code to blog pages (ca-pub-9789336661158068)
  - Proper ad unit configuration with unique slots
  - Shared AdSense loader utility to prevent duplicate scripts
  - Ad rendering initialization with adsbygoogle.push()
- [x] Fix News page routing (added /news route and navigation link)
- [x] Add Write Blog option to admin dashboard

## Future Enhancements
- [ ] Stripe payment integration for services/products
- [ ] Custom domain binding (Connectwithbayezid.it.com)
- [ ] Newsletter email campaign features
- [ ] WhatsApp order notifications

## Professional Blog Features (Complete)
- [x] Add social media sharing buttons (Facebook, Twitter, LinkedIn, WhatsApp)
  - Integrated on blog detail pages
  - Opens share dialogs for each platform
  - Includes fallback share option
- [x] Implement auto-approve comments (no manual approval needed)
  - Comments now auto-publish instantly
  - No admin approval required
  - User sees success message immediately
- [x] Review and verify AdSense code setup for proper ad display
  - Shared script utility prevents duplicate loading
  - Blog listing page with ad slot 1234567890
  - Blog detail page with ad slot 9876543210
  - Responsive ads enabled

- [x] Fix AdSense duplicate ads error
  - Improved pushAdUnits() to check for already-processed ads
  - Silently handle errors to avoid console spam

## Newsletter Auto-Popup System (Complete)
- [x] Design and implement auto-popup newsletter component
  - Beautiful modal with smooth animations
  - 30-second auto-trigger on page load
  - localStorage to prevent multiple popups per session
  - Success state with auto-close after 3 seconds
- [x] Newsletter database schema (already existed)
  - newsletterSubscribers table with email, name, status, timestamps
- [x] Backend API for newsletter management
  - subscribe: Public mutation with email validation
  - getAll: Public query to retrieve all subscribers
  - unsubscribe: Change status to unsubscribed
  - delete: Remove subscriber from database
- [x] Admin dashboard newsletter section
  - Newsletter Subscribers tab in admin panel
  - Beautiful table with email, name, status, date, actions
  - Unsubscribe and delete buttons
  - Subscriber count display
  - Status indicators (subscribed, unsubscribed, bounced)
- [x] Unit tests for newsletter functionality
  - Newsletter subscription tests
  - Auto-popup feature tests
  - Admin dashboard tests
  - All tests passing


## Payment Methods Integration (In Progress)
- [ ] Store payment credentials securely (Payoneer, PayPal, Bkash, Nagad, Rocket, Binance)
- [ ] Add payment method selection to checkout page
- [ ] Display payment instructions based on selected method
- [ ] Add transaction ID/payment proof upload field

## Digital Product Checkout & Invoice System (In Progress)
- [ ] Dynamic invoice generation with PENDING status watermark
- [ ] User can view/download PENDING invoice immediately after submission
- [ ] Admin approval workflow in dashboard
- [ ] Automatic invoice status update to SUCCESSFUL on approval
- [ ] Professional invoice template with Connect With Bayezid branding
- [ ] Display payment method used on invoice
- [ ] Admin dashboard shows buyer email in easy-to-copy format
- [ ] Order details clearly visible for manual email sending
- [ ] Digital product ZIP file delivery for approved orders
- [ ] Invoice download functionality for both PENDING and SUCCESSFUL statuses
- [ ] Email notification to buyer on order approval
- [ ] Order history tracking in user dashboard

## UI/UX Fixes - Payment & Order Management (Complete)
- [x] Add payment proof screenshot display to admin order modal
- [x] Fix and test invoice download button in OrderConfirmation page
- [x] Improve payment details visibility (method, transaction ID) in invoice
- [x] Improve payment details visibility in admin dashboard
- [x] End-to-end test of checkout -> payment proof -> admin approval -> invoice download workflow
- [x] Implement file upload endpoint for payment proof storage
- [x] Add comprehensive payment and order workflow tests

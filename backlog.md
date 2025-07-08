Midtrans Integration
- [ok] Add Midtrans Integration
- [ok] Add Midtrans Snap Integration
- [ok] Add Midtrans Bank Transfer Integration
- [] Change payment after order is placed
- [] Check order payment status for public view
- [] Check order payment status for user dashboard
- [ok] Test bank transfer payment
- [] Test snap payment
- [] Cancel placed order by user after 1 hours
- [] Email notification template to user when order is placed with payment link
- [] Link to success page after order is placed to enable revisit the payment instruction
- [] Email notification template to user when order is canceled
- [] Email notification template to user when order is shipped

RajaOngkir Integration
- [ok] Integration to set Country and City on Billing detail using v1
- [ok] Integration to set destination city on Shipping detail using v2
- [ok] Create options
- [] Repack using modular option
- [ok] Test Rajaongkir API
- [ok] Fix:checkout doesn't have weight to calculate shipping cost

Shopping Cart Page
- [ok] Fix: Formatting language and currency

Checkout Page
- [ok] fix: Autofill name show Full Name as First Name
- [ok] Region select box cannot use directional arrow to select region
- [ok] fix: email is prefilled with the email of the user who is logged in, but checkout is failed with email not filled
- [] Page for user to check order status based on Order ID
- [ok] Calculate total with shipping cost
- [] "Pickup di Gerai AGRES" option shows Pickup Point selection
- [] Show map for Pickup Point selection
- [ok] fix: orders summary, product lines broken when product name is too long
- [ok] Get province and city from database/json instead of using RajaOngkir API
- [ok] Implement province and city local datalist
- [ok] Remove RajaOngkir API from the code and Rajaongkir name from any route and path
- [ok] auto fetch billing address from user account management page to billing section
- [ok] auto fetch shipping address from user account management page to shipping section
- [ok] fix: checkout page doesn't show the product variant selected - show color
- [] fix: db doesn't have the product variant selected
- [ok] fix: count weight and dimension of product variant

RBAC / Fine Grained Access Control
- [] Add RBAC / Fine Grained Access Control
- [] --- discuss with Mr Riki about the sales & logistic process flow to know the role of each user

Admin Page
- [] Use buttons to set shipping status to Processing, Finished, Canceled from Pending
- [] Restrictions: Finished cannot be Canceled or set to Processing, Canceled cannot be set to Processing
- [] Use button to set payment status to Paid or Failed from Pending
- [] Button to set paid/failed can only be accessed by finance team
- [ok] FIx admin page padding and off-scroll caused by double height of container

User Account Management Page
- [ok] Add Join Date to User Account Management Page, show in Sidebar
- [ok] Change Address to Json with Address1 and Address2 on User Account Management Page

Auth
- [ok] fix: after success login, user is being redirected, but no information is shown on the page when loading and might confuse users
- [] Email verification is not implemented yet, need to set verificationUrl, clue in WelcomeEmail.tsx

Overview
- [ok] Use Indonesian language and currency symbol

Footer
- [] Social links can be dynamic from the database and edited on admin page

Pickup Point
- [ok] Add Pickup Point
- [ok] Add Pickup Management Page to Admin Page
- [] Add Pickup Point to the Checkout Page
- [] Save Pickup Point to the Order

Affiliate & Store Account Management
- [] Confirm how to treat the store account and affiliate account, bonus, discount, etc.
- [] Add Affiliate & Store Account Management Page to Admin Page

Product Management
- [ok] Add ProductCode to main Product model
- [ok] Add Weight to main Product model
- [ok] Add Dimension to main Product model
- [ok] fix: product page doesn't show the updated data after editing or adding new product

Product Page
- [ok] Grouping Product Variant on Product Page
- [ok] Add Product Variant to Shopping Cart - added color
Site Nav
- [] Add product menu with category filter

Data Preparation
- [] Converter from MPL to clean_import.csv
- [] Query import from clean_import.csv to database
- [] Query import from master_product_attributes.csv to update products
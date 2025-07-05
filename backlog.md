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
- [] Fixcheckout doesn't have weight to calculate shipping cost

Checkout Page
- [ok] fix: Autofill name show Full Name as First Name
- [ok] Region select box cannot use directional arrow to select region
- [ok] fix: email is prefilled with the email of the user who is logged in, but checkout is failed with email not filled
- [] Page for user to check order status based on Order ID
- [] Calculate total with shipping cost
- [] "Pickup di Gerai AGRES" option shows Pickup Point selection
- [] Show map for Pickup Point selection

RBAC / Fine Grained Access Control
- [] Add RBAC / Fine Grained Access Control
- [] --- discuss with Mr Riki about the sales & logistic process flow to know the role of each user

Admin Page
- [] Use buttons to set shipping status to Processing, Finished, Canceled from Pending
- [] Restrictions: Finished cannot be Canceled or set to Processing, Canceled cannot be set to Processing
- [] Use button to set payment status to Paid or Failed from Pending
- [] Button to set paid/failed can only be accessed by finance team
- [] FIx admin page padding and off-scroll caused by double height of container

Auth
- [ok] fix: after success login, user is being redirected, but no information is shown on the page when loading and might confuse users
- [] Email verification is not implemented yet, need to set verificationUrl, clue in WelcomeEmail.tsx

Overview
- [ok] Use Indonesian language and currency symbol

Footer
- [] Social links can be dynamic from the database and edited on admin page

Pickup Point
- [] Add Pickup Point
- [] Add Pickup Point to the Checkout Page
- [] Add Pickup Management Page to Admin Page

Product Management
- [] Add Weight to main Product model
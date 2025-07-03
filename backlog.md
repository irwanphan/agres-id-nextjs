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
- [] Link to success page after order is placed
- [] Email notification template to user when order is canceled
- [] Email notification template to user when order is shipped

Checkout Page
- [] fix: Autofill name show Full Name as First Name
- [] Region select box cannot use directional arrow to select region
- [] fix: email is prefilled with the email of the user who is logged in, but checkout is failed with email not filled
- [] Page for user to check order status based on Order ID

RBAC / Fine Grained Access Control
- [] Add RBAC / Fine Grained Access Control
- [] --- discuss with Mr Riki about the sales & logistic process flow to know the role of each user

Admin Page
- [] Use buttons to set shipping status to Processing, Finished, Canceled from Pending
- [] Restrictions: Finished cannot be Canceled or set to Processing, Canceled cannot be set to Processing
- [] Use button to set payment status to Paid or Failed from Pending
- [] Button to set paid/failed can only be accessed by finance team

Auth
- [] fix: after success login, user is being redirected, but no information is shown on the page when loading and might confuse users
- [] Email verification is not implemented yet, need to set verificationUrl, clue in WelcomeEmail.tsx

Overview
- [] Use Indonesian language and currency symbol

Footer
- [] Social links can be dynamic from the database and edited on admin page
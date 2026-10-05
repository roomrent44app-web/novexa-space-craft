# Add automatic subscriptions to the student panel

## Student experience
- Redesign the signed-in account page as a compact student dashboard.
- Show the active plan, amount paid, start date, expiry date, days remaining, and active/expired status.
- Keep a prominent **Join Class** button with the class timing and existing Google Meet link.
- Show an at-a-glance attendance summary, followed by the existing full monthly attendance calendar.
- Show a clear renewal action when a plan is near expiry or has expired.

## Razorpay checkout
- Add secure Razorpay checkout for the existing 5AM plans.
- Require students to sign in before purchasing so each payment is linked to the correct account.
- Create payment orders on the secure backend and verify payment signatures before activating a plan.
- Add a Razorpay webhook so successful payments activate subscriptions even if the student closes the payment screen early.
- Calculate the expiry date from the purchased plan and display it immediately after verified payment.

## Data and security
- Store subscriptions and payment references in a protected table.
- Students can read only their own subscription records; administrative access remains role-protected.
- Never expose Razorpay private credentials in website code.
- Keep the existing class link restricted to signed-in students.

## Technical details
- Use the existing plan names, durations, and prices from the shared 5AM content module.
- Add backend functions for creating Razorpay orders, verifying completed checkout, and handling signed webhook events.
- After the backend endpoints exist, securely add the Razorpay Key ID, Key Secret, and webhook secret.

## Verification
- Test signed-in purchase, successful activation, expiry calculation, page refresh, and expired-plan states.
- Confirm one student cannot access another student's subscription.
- Verify Join Class and monthly attendance still work on phone and desktop.
Wild Modern Nail Spa & Barber
A responsive React + Vite booking website.
Run locally
Install Node.js.
Copy .env.example to .env and fill in Supabase URL, publishable key, and WhatsApp number (digits only, Kenya country code 254).
Run npm install, then npm run dev.
Deploy to Vercel
Import this folder/repository as a Vite project. Add the same environment variables in Vercel Project Settings > Environment Variables, then deploy.
Supabase setup
Run supabase-wm-bookings.sql in the Supabase SQL Editor. It creates a separate wm_bookings table so it does not overwrite the earlier project tables. Public clients can submit booking requests; only accounts listed in wm_admins can read booking rows.
Add the owner email to wm_admins using the SQL shown at the end of the script. Do not put a Supabase secret/service-role key in the frontend.

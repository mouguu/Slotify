# Slotify — Multi-Provider Booking Platform

## Description

Slotify is a multi-provider, multi-city service booking platform. It enables intermediaries to manage multiple service providers across different cities, handle client bookings, and track schedules — all from a single dashboard.

Built with the latest web technologies, Slotify provides a clean, Cal.com-inspired admin interface and a streamlined public booking flow.

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org) (App Router)
- **Authentication:** [NextAuth v5](https://next-auth.js.org/)
- **Database:** [PostgreSQL (Neon)](https://neon.tech/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team)
- **Forms:** [React Hook Form](https://react-hook-form.com)
- **Validations:** [Zod](https://zod.dev/)
- **Email:** [React Email](https://react.email) + [Resend](https://resend.com)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com)
- **Hosting:** [Vercel](https://vercel.com)

## Features

- **Multi-provider management** — Add providers, assign services, set travel schedules across cities
- **Schedule overlap detection** — Prevents a provider from being booked in two cities on the same date
- **Public booking flow** — Select city → browse providers → pick service & time slot → confirm
- **Booking conflict detection** — Prevents double-booking at the same provider + date + time
- **Admin dashboard** — Cal.com-style sidebar with pages for Providers, Services, Locations, Bookings, Clients, Reviews
- **Role-based access** — Admin, Provider, and Client roles
- **Auth system** — Email/password authentication with email verification and password reset
- **Transactional emails** — Verification and password reset emails via Resend

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- A [Neon](https://neon.tech/) PostgreSQL database
- A [Resend](https://resend.com) account for emails

### Setup

1. Clone the repository:

```bash
git clone https://github.com/mouguu/Slotify.git
cd Slotify
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file based on `environment.d.ts`:

```env
DATABASE_URL=your_neon_connection_string
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
RESEND_API_KEY=your_resend_api_key
RESEND_EMAIL_FROM=onboarding@resend.dev
RESEND_EMAIL_TO=your_email@example.com
```

4. Push the database schema:

```bash
pnpm db:push
```

5. Start the development server:

```bash
pnpm dev
```

## Project Structure

```
src/
├── actions/          # Server actions (CRUD for all entities)
├── app/
│   ├── (admin)/      # Admin dashboard routes
│   ├── (auth)/       # Authentication routes
│   ├── (landing)/    # Landing page
│   └── (public)/     # Public booking flow
├── components/
│   ├── admin/        # Admin sidebar
│   ├── booking/      # Date picker, time slot picker
│   ├── forms/        # Auth, provider, location, service forms
│   ├── emails/       # Email templates
│   └── ui/           # shadcn/ui components
├── config/           # Site, auth, database, email config
├── db/
│   ├── schema/       # Drizzle table definitions
│   └── prepared-statements/
├── lib/              # Utilities, schedule logic
└── validations/      # Zod schemas
```

## License

MIT — see [LICENSE](./LICENSE) for details.

import { type AdminNavItem, type NavItem } from "@/types"

const links = {
  github: "https://github.com",
  openGraphImage: "/opengraph-image.png",
}

export const siteConfig = {
  links,
  nameShort: "Slotify",
  nameLong: "Slotify — Multi-Provider Booking Platform",
  description:
    "Manage providers, schedules, and bookings across multiple cities.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: links.openGraphImage,
  author: "Slotify",
  hostingRegion: "fra1",
  keywords: [
    "Booking",
    "Scheduling",
    "Multi-provider",
    "Appointment",
    "Service management",
  ],
  mainNavItems: [] satisfies NavItem[],

  adminNavItems: [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
    },
    {
      title: "Calendar",
      href: "/admin/calendar",
    },
    {
      title: "Providers",
      href: "/admin/providers",
    },
    {
      title: "Services",
      href: "/admin/services",
    },
    {
      title: "Locations",
      href: "/admin/locations",
    },
    {
      title: "Bookings",
      href: "/admin/bookings",
    },
    {
      title: "Clients",
      href: "/admin/clients",
    },
    {
      title: "Reviews",
      href: "/admin/reviews",
    },
    {
      title: "Settings",
      href: "/admin/settings",
    },
  ] satisfies AdminNavItem[],

  mobileNav: [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
    },
    {
      title: "Providers",
      href: "/admin/providers",
    },
    {
      title: "Bookings",
      href: "/admin/bookings",
    },
    {
      title: "Profile",
      href: "/admin/profile",
    },
  ] satisfies AdminNavItem[],
}

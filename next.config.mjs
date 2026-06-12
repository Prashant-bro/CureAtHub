/** @type {import('next').NextConfig} */
const nextConfig = {
  // Skip TS errors during build (already set)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Re-enable Next.js image optimization (was disabled — wastes CDN/caching benefits)
  images: {
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
  },

  // Compress responses (gzip) for faster transfer
  compress: true,

  // Tree-shake heavy packages — only import the icons/modules actually used
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-context-menu",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-hover-card",
      "@radix-ui/react-label",
      "@radix-ui/react-menubar",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-progress",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slider",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toast",
      "@radix-ui/react-toggle",
      "@radix-ui/react-toggle-group",
      "@radix-ui/react-tooltip",
      "recharts",
      "date-fns",
    ],
  },
}

export default nextConfig

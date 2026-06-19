import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console system
  // for debugging.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample fewer revenues in production.
  replaysSessionSampleRate: 0.1,

  // You can define a custom integration here if needed
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});

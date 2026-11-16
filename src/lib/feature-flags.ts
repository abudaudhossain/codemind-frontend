/**
 * When true, hooks use isolated mock modules instead of live CAP HTTP calls.
 * Defaults to false so the application uses the configured backend.
 * Set NEXT_PUBLIC_USE_API_MOCKS=false to hit the NestJS server.
 */
export const USE_API_MOCKS =
  process.env.NEXT_PUBLIC_USE_API_MOCKS === undefined
    ? false
    : process.env.NEXT_PUBLIC_USE_API_MOCKS === "true";

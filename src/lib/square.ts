declare global {
  interface Window {
    Square?: {
      payments: (
        applicationId: string,
        locationId: string,
      ) => {
        card: () => Promise<{
          attach: (selector: string) => Promise<void>;
          destroy: () => Promise<void>;
          tokenize: (details?: {
            amount: string;
            currencyCode: string;
            intent: string;
            billingContact?: {
              givenName?: string;
              familyName?: string;
              email?: string;
              phone?: string;
              addressLines?: string[];
              city?: string;
              state?: string;
              postalCode?: string;
              countryCode?: string;
            };
          }) => Promise<{
            status: string;
            token?: string;
            errors?: Array<{ message?: string }>;
          }>;
        }>;
      };
    };
  }
}

const SANDBOX_SCRIPT = "https://sandbox.web.squarecdn.com/v1/square.js";
const PROD_SCRIPT = "https://web.squarecdn.com/v1/square.js";

export function getSquareConfig() {
  const applicationId = import.meta.env['VITE_SQUARE_APPLICATION_ID'] as string | undefined;
  const locationId = import.meta.env['VITE_SQUARE_LOCATION_ID'] as string | undefined;
  const environment = (import.meta.env['VITE_SQUARE_ENVIRONMENT'] as string | undefined) ?? "sandbox";

  return {
    applicationId: applicationId?.trim() || "",
    locationId: locationId?.trim() || "",
    environment: (environment === "production" ? "production" : "sandbox") as
      | "production"
      | "sandbox",
    configured: Boolean(applicationId?.trim() && locationId?.trim()),
  };
}

export function loadSquareSdk(
  environment: "sandbox" | "production",
): Promise<NonNullable<typeof window.Square>> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Square SDK requires a browser."));
  }

  if (window.Square) {
    return Promise.resolve(window.Square);
  }

  const src = environment === "production" ? PROD_SCRIPT : SANDBOX_SCRIPT;
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);

  return new Promise<NonNullable<typeof window.Square>>((resolve, reject) => {
    const onReady = () => {
      if (window.Square) resolve(window.Square);
      else reject(new Error("Square SDK failed to load."));
    };

    if (existing) {
      existing.addEventListener("load", onReady);
      existing.addEventListener("error", () => reject(new Error("Square SDK failed to load.")));
      if (window.Square) onReady();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = onReady;
    script.onerror = () => reject(new Error("Square SDK failed to load."));
    document.head.appendChild(script);
  });
}

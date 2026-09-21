import { setupWorker } from "msw/browser";
import { handlers } from "@/mocks/handlers";

export const worker = setupWorker(...handlers);

export const startMocks = async () => {
  await worker.start({
    onUnhandledRequest: "bypass",
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
  });
};

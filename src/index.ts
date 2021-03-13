import { server } from "./server";

// uncaught/unhandled exception handling
// exit process to avoid unpredictable state
process.on("uncaughtException", (err) => {
  console.error(err);
  process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error(reason, promise);
  process.exit(1);
});

(async function start() {
  // Start the server
  try {
    await server();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

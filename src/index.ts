import { server } from "./server";

(async function start() {
  // Start the server
  try {
    await server();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

/**
 * Entry point cPanel's "Setup Node.js App" (Phusion Passenger) runs directly.
 * Passenger assigns the port via process.env.PORT — always listen on that,
 * never hardcode a port in production.
 */
const createApp = require('./src/createApp');
const config = require('./src/config');

const app = createApp();

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Zexora API listening on port ${config.port} [${config.env}]`);
});

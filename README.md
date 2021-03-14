# NodeJS Token Service

Token exchange service.

## Running

Service runs on `http://localhost:PORT` with 8080 as default

```
nvm use # node 14 expected (see .nvmrc); <14 would work with minimal syntax tweaks

npm install
npm run dev # or npm start

npm run test # in another terminal
```

## Functional features

- Allows for creating, retrieving and deleting secrets
- Storage is in-memory
- See [test](src/__tests__/service.test.js) for exact usage

## Security features

- Maximum of `100` secret retrievals per request
- Maximum request body size of `100kb` (default of `express.json()`)
- Rate limiting (although this is ideally handled at infra-level)
- Content-type sanity checking
- Security header best-practices (via `helmet`)
- Catching and exiting process on `uncaughtException` and `unhandledRejection`
- Activity logging
- For future: Since a webapp frontend isn't in scope for this project, haven't yet added anti-CSRF

---

_Jeremy Gayed_

# NodeJS Token Service

Token exchange service.

## Running

Service runs on `http://localhost:PORT` with 8080 as default

```
nvm use # node 14 expected, but should work with others (.nvmrc)

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

---

_Jeremy Gayed for Doppler_

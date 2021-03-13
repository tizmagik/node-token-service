/**
 * @jest-environment node
 */
// @ts-check

import axios from "axios";

const SERVICE_URL = `http://localhost:${process.env.PORT || "8080"}`;
const url = (path) => `${SERVICE_URL}/${path}`;

describe("service", () => {
  const secret = "my-very-super-secret";
  let token;

  it("GET", async () => {
    const response = await axios.get(`${SERVICE_URL}`);
    expect(response.data).toBe("hello!");
  });

  it("can POST tokens", async () => {
    const response = await axios.post(url("token"), {
      secret,
    });

    expect(response.data.token).toBeTruthy();
    token = response.data.token;
  });

  it("can GET tokens", async () => {
    const response = await axios.get(url("tokens"), {
      params: {
        t: token,
      },
    });

    expect(response).toBeTruthy();
    expect(response.data[token]).toBe(secret);
  });

  it("can DELETE tokens", async () => {
    const response = await axios.delete(url("token/" + token));
    expect(response.status).toBe(204);
  });
});

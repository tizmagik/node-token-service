// @ts-check
import axios from "axios";

const SERVICE_URL = `http://localhost:${process.env.PORT || "8080"}`;
const url = (path) => `${SERVICE_URL}/${path}`;

/**
 * These tests are meant to be run as a unit, sequentially
 * since they rely on state from previous it()'s.
 *
 * Normally each test would be written so that it's stateless.
 */
describe("service", () => {
  describe("sunny day", () => {
    const secret = "my-very-super-secret";
    let token;

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
      expect(response.status).toBe(200);
      expect(response.data[token]).toBe(secret);
    });

    it("can DELETE tokens", async () => {
      const response = await axios.delete(url("token/" + token));
      expect(response.status).toBe(204);
    });
  });

  describe("error cases", () => {
    it("Blocks unsupported content-types", async () => {
      expect.assertions(1);
      try {
        await axios.post(
          url("token"),
          {},
          {
            headers: {
              "content-type": "foo/bar",
            },
          }
        );
      } catch (e) {
        expect(e.response.data).toContain(
          "Error Invalid or no content-type specified: foo/bar"
        );
      }
    });

    it("Blocks requests with unrecognized headers", async () => {
      expect.assertions(1);
      try {
        await axios.post(
          url("token"),
          {
            secret: "my-blocked-secret",
          },
          {
            headers: {
              "not-allowed": "nope",
            },
          }
        );
      } catch (e) {
        expect(e.stack).toContain("Error: Network Error");
      }
    });

    it("Does not allow more than 10 token GETs per request", async () => {
      expect.assertions(1);
      try {
        await axios.get(url("tokens"), {
          params: {
            t: new Array(100 + 1).fill(Math.random()).join(","),
          },
        });
      } catch (e) {
        expect(e.response.data).toBe("Max of 100 tokens per request");
      }
    });

    it("Does not bulbble up token retrieval errors to user", async () => {
      const response = await axios.get(url("tokens"), {
        params: {
          t: "bogus,tokens,that,don't,exist",
        },
      });

      expect(response).toBeTruthy();
      expect(response.status).toBe(200);
      expect(response.data).toStrictEqual({});
    });
  });
});

// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import dotenv from "dotenv";
import cors from "cors";
import shopify from "./shopify.js";
import retrieveLoggedUser from "./retrieve-logged-user.js";
import retrieveUserId from "./retrieveUserId.js"
import addToWishlist from "./add-to-wishlist.js"
import GDPRWebhookHandlers from "./gdpr.js";
import { storeSessionData, connectToDB } from "./mongodb.js"

dotenv.config();

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || 57516);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();
connectToDB()
// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in technical test web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());
app.use(cors())

/*app.get("/test", (e) => {
  try {
    e.preventDefault()
    console.log("PRUEBA PRUEBA PRUEBA")
  }catch (error) {
    console.error("ERIK", error.message)
  }
})*/
app.get("/api/wishlist-test", async (_req, res) => {
  let status = 200
  let error = null
  try {
    console.log("API and fly.io working")
  } catch(e) {
    status = 500
    error= e.message
    console.log("error on /wishlist-test")
    console.error(error)
  }
  res.status(status).send({ success: status === 200, error });
});
// send localStorage to api
app.post("/api/getUser", async (_req, res) => {

  console.log("/getUser")
  let status = 200;
  let error = null;
  try {
    // retrieve user email and check if has wishlisted products.
    const userId = retrieveUserId( _req, res)
    return userId
  } catch (e) {
    console.log(`Error on /wishlist`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
})

// check if user is logged, if it is logged retrieve users and its saved wishlists. Finally renders it into the wishlist section
app.get("/api/wishlist", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    // retrieve user email and check if has wishlisted products.
    await retrieveLoggedUser()
  } catch (e) {
    console.log(`Error on /wishlist`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.post("/api/wishlist/add", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    const userId = retrieveUserId()
    // retrieve user email, add the current product to wishlist, retrieve wishlisted products and render it.
    retrieveLoggedUser(userId)
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.post("/wishlist/remove", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    // retrieve user email, remove the current product from wishlist, retrieve wishlisted products and render it.
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

// just checks if the app is installed in the store
app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {

  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(3000, '0.0.0.0', () => {
  console.log(`listening on 0.0.0.0:3000`);
});

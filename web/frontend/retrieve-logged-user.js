import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "./shopify.js";
import {DEFAULT_PRODUCTS_COUNT} from "../product-creator";

export default async function retrieveLoggedUser(session, user) {
  const client = new shopify.api.clients.Graphql({ session });

  try {
    console.log(client)
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }
}

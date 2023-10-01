import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "./shopify.js";
import { storeSessionData } from "./mongodb.js"

export default async function retrieveLoggedUser(_req, res) {
// use sessionId to retrieve session from app's session storage
// getSessionFromStorage() must be provided by application
    const sessionId = await shopify.session.getCurrentId({
        isOnline: true,
        rawRequest: _req,
        rawResponse: res,
    });

    const session = await getSessionFromStorage(sessionId);

    const client = new shopify.clients.Rest({session});

    try {
        console.log(session)
        return res.body
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
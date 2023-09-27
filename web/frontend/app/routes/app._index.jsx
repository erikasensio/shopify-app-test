import {useEffect} from "react";
import {json} from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  VerticalStack,
  Card,
  Button,
  HorizontalStack,
  Box,
  Divider,
  List,
  Link,
} from "@shopify/polaris";

import {authenticate} from "../shopify.server";

export const loader = async ({request}) => {
  const {session} = await authenticate.admin(request);

  return json({shop: session.shop.replace(".myshopify.com", "")});
};

export async function action({request}) {
  const {admin} = await authenticate.admin(request);

  const color = ["Red", "Orange", "Yellow", "Green"][
      Math.floor(Math.random() * 4)
      ];
  const response = await admin.graphql(
      `#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
      {
        variables: {
          input: {
            title: `${color} Snowboard`,
            variants: [{price: Math.random() * 100}],
          },
        },
      }
  );

  const responseJson = await response.json();

  return json({
    product: responseJson.data.productCreate.product,
  });
}

export default function Index() {
  const nav = useNavigation();
  const {shop} = useLoaderData();
  const actionData = useActionData();
  const submit = useSubmit();

  const isLoading =
      ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";

  const productId = actionData?.product?.id.replace(
      "gid://shopify/Product/",
      ""
  );

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId]);

  const generateProduct = () => submit({}, {replace: true, method: "POST"});

  return (
      <Page>
        <ui-title-bar title="Nextt Wishlist"/>
        <VerticalStack gap="5">
          <Layout>
            <Layout.Section>
              <Card>
                <VerticalStack gap="5">
                  <VerticalStack gap="2">
                    <Text as="h2" variant="headingMd">
                      Erik Asensio Test App
                    </Text>
                    <Text variant="bodyMd" as="p">
                      This app tries to be a Wishlist app, which can add or remove products, saving the customer's info
                      and the saved products on mongoDB for future sessions.
                      It would be nice to have an additional page where we will be able to see some stats like the most
                      wished products or how many users are using the wishlist app.{" "}
                      <Link url="/app/additional">
                        Stats page
                      </Link>
                    </Text>
                  </VerticalStack>
                  <VerticalStack gap="2">
                    <Text as="h3" variant="headingMd">
                      How will it work?
                    </Text>
                    <Text as="p" variant="bodyMd">
                      The wishlist app could be only used by logged users, for being able to reach customers info and save
                      it on mongoDB.
                    </Text>
                  </VerticalStack>
                </VerticalStack>
              </Card>
            </Layout.Section>
            <Layout.Section secondary>
              <VerticalStack gap="5">
                <Card>
                  <VerticalStack gap="2">
                    <Text as="h2" variant="headingMd">
                      App template specs
                    </Text>
                    <VerticalStack gap="2">
                      <Divider/>
                      <HorizontalStack align="space-between">
                        <Text as="span" variant="bodyMd">
                          Framework
                        </Text>
                        <Link url="https://remix.run" target="_blank">
                          Remix
                        </Link>
                      </HorizontalStack>
                      <Divider/>
                      <HorizontalStack align="space-between">
                        <Text as="span" variant="bodyMd">
                          Database
                        </Text>
                        <Link url="https://www.mongodb.com/es" target="_blank">
                          MongoDB
                        </Link>
                      </HorizontalStack>
                      <Divider/>
                      <HorizontalStack align="space-between">
                        <Text as="span" variant="bodyMd">
                          Interface
                        </Text>
                        <span>
                        <Link url="https://polaris.shopify.com" target="_blank">
                          Polaris
                        </Link>
                          {", "}
                          <Link
                              url="https://shopify.dev/docs/apps/tools/app-bridge"
                              target="_blank"
                          >
                          App Bridge
                        </Link>
                      </span>
                      </HorizontalStack>
                      <Divider/>
                      <HorizontalStack align="space-between">
                        <Text as="span" variant="bodyMd">
                          API
                        </Text>
                        <VerticalStack>
                          <Link
                              url="https://shopify.dev/docs/api/admin-graphql"
                              target="_blank"
                          >
                            GraphQL API (to retrieve products)
                          </Link>
                          <Link
                              url="https://nodejs.org/en"
                              target="_blank"
                          >
                            NodeJS (to iterate products with DB)
                          </Link>
                        </VerticalStack>
                      </HorizontalStack>
                    </VerticalStack>
                  </VerticalStack>
                </Card>
              </VerticalStack>
            </Layout.Section>
          </Layout>
        </VerticalStack>
      </Page>
  );
}

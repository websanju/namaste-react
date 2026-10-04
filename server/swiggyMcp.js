const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const {
  StreamableHTTPClientTransport,
} = require("@modelcontextprotocol/sdk/client/streamableHttp.js");

const { getAccessToken } = require("./swiggyAuth");

const SWIGGY_MCP_URL = "https://mcp.swiggy.com/food";

async function createSwiggyClient() {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("Swiggy authentication required");
  }

  const client = new Client({
    name: "namaste-react",
    version: "1.0.0",
  });

  const transport = new StreamableHTTPClientTransport(new URL(SWIGGY_MCP_URL), {
    requestInit: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

  await client.connect(transport);

  return client;
}

// async function getRestaurants() {
//   const client = await createSwiggyClient();

//   // Get addresses
//   const addressResult = await client.callTool({
//     name: "get_addresses",
//     arguments: {},
//   });

//   console.log(
//     "ADDRESS RESULT:",
//     JSON.stringify(addressResult, null, 2)
//   );

//   // Temporary: inspect the MCP response
//   const textContent = addressResult?.content?.find(
//     (item) => item.type === "text"
//   );

//   if (!textContent?.text) {
//     throw new Error("No address data returned from Swiggy");
//   }

//   const addresses = JSON.parse(textContent.text);

//   console.log(
//     "PARSED ADDRESSES:",
//     JSON.stringify(addresses, null, 2)
//   );

//   const address =
//     Array.isArray(addresses)
//       ? addresses[0]
//       : addresses.addresses?.[0];

//   if (!address) {
//     throw new Error("No Swiggy address found");
//   }

//   const addressId =
//     address.addressId ||
//     address.id;

//   if (!addressId) {
//     throw new Error("addressId not found");
//   }

//   console.log("USING ADDRESS ID:", addressId);

//   // Search restaurants
//   const restaurantResult = await client.callTool({
//     name: "search_restaurants",
//     arguments: {
//       addressId,
//       query: "restaurants",
//     },
//   });

//   console.log(
//     "RESTAURANT RESULT:",
//     JSON.stringify(restaurantResult, null, 2)
//   );

//   return restaurantResult;
// }

async function getRestaurants() {
  const client = await createSwiggyClient();

  // 1. Get address
  const addressResult = await client.callTool({
    name: "get_addresses",
    arguments: {},
  });

  console.log("ADDRESS RESULT:");
  console.dir(addressResult, { depth: null });

  const addresses = addressResult?.structuredContent?.addresses;

  if (!addresses?.length) {
    throw new Error("No Swiggy address found");
  }

  const addressId = addresses[0].id;

  console.log("ADDRESS ID:", addressId);

  // 2. Search restaurants
  const restaurantResult = await client.callTool({
    name: "search_restaurants",
    arguments: {
      addressId: addressId,
      query: "restaurants",
    },
  });

  console.log("RESTAURANT RESULT:");
  console.dir(restaurantResult, { depth: null });

  return restaurantResult;
}

async function getMcpTools() {
  const client = await createSwiggyClient();

  const result = await client.listTools();

  console.log("AVAILABLE MCP TOOLS:");
  console.dir(result, { depth: null });

  return result;
}

// async function getRestaurantMenu(resId) {
//   const client = await createSwiggyClient();

//   const toolsResult = await client.listTools();

//   const tools = toolsResult?.tools || [];

//   console.log(
//     "AVAILABLE MCP TOOLS:",
//     tools.map((tool) => tool.name),
//   );
//   console.log("========== MCP TOOLS ==========");

//   for (const tool of tools) {
//     console.log("--------------------------------");
//     console.log("NAME:", tool.name);
//     console.log("DESCRIPTION:", tool.description);
//     console.log("INPUT SCHEMA:", JSON.stringify(tool.inputSchema, null, 2));
//   }

//   console.log("===============================");
//   const menuTool = tools.find((tool) => {
//     const name = tool.name.toLowerCase();

//     return (
//       name.includes("menu") ||
//       name.includes("restaurant_details") ||
//       name.includes("restaurant_detail")
//     );
//   });

//   if (!menuTool) {
//     throw new Error(
//       "No restaurant menu MCP tool found. Available tools: " +
//         tools.map((tool) => tool.name).join(", "),
//     );
//   }

//   console.log("USING MENU TOOL:", menuTool.name);

//   const menuResult = await client.callTool({
//     name: menuTool.name,
//     arguments: {
//       restaurantId: resId,
//       query: "restaurant menu",
//     },
//   });

//   console.log("RESTAURANT MENU RESULT:");
//   console.dir(menuResult, { depth: null });

//   return menuResult;
// }

async function getRestaurantMenu(resId) {
  const client = await createSwiggyClient();

  // Get saved Swiggy address
  const addressResult = await client.callTool({
    name: "get_addresses",
    arguments: {},
  });

  console.log("ADDRESS RESULT:");
  console.dir(addressResult, { depth: null });

  const addresses =
    addressResult?.structuredContent?.addresses;

  if (!addresses?.length) {
    throw new Error("No Swiggy address found");
  }

  const addressId = addresses[0].id;

  console.log("ADDRESS ID:", addressId);
  console.log("RESTAURANT ID:", resId);

  // Get complete restaurant menu
  const menuResult = await client.callTool({
    name: "get_restaurant_menu",
    arguments: {
      restaurantId: resId,
      addressId: addressId,
      page: 1,
      pageSize: 8,
    },
  });

  console.log("RESTAURANT MENU RESULT:");
  console.dir(menuResult, { depth: null });

  return menuResult;
}

module.exports = {
  createSwiggyClient,
  getRestaurants,
  getMcpTools,
  getRestaurantMenu,
};

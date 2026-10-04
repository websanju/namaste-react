const crypto = require("crypto");

const AUTHORIZATION_ENDPOINT =
  "https://mcp.swiggy.com/auth/authorize";

const TOKEN_ENDPOINT =
  "https://mcp.swiggy.com/auth/token";

const REGISTRATION_ENDPOINT =
  "https://mcp.swiggy.com/auth/register";

const REDIRECT_URI =
  "http://localhost:5000/auth/callback";

const SCOPE =
  "mcp:tools mcp:resources mcp:prompts";

let oauthState = null;
let codeVerifier = null;
let clientId = null;

let accessToken = null;
let refreshToken = null;


// Generate random string
function randomString(length = 64) {
  return crypto
    .randomBytes(length)
    .toString("base64url");
}


// Create PKCE challenge
function createCodeChallenge(verifier) {
  return crypto
    .createHash("sha256")
    .update(verifier)
    .digest("base64url");
}


// Register this local app with Swiggy
async function registerClient() {

  const response = await fetch(
    REGISTRATION_ENDPOINT,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        client_name: "Namaste React Learning App",

        redirect_uris: [
          REDIRECT_URI,
        ],

        grant_types: [
          "authorization_code",
          "refresh_token",
        ],

        response_types: [
          "code",
        ],

        token_endpoint_auth_method:
          "none",

      }),
    }
  );


  if (!response.ok) {

    const text =
      await response.text();

    throw new Error(
      `Client registration failed: ${text}`
    );
  }


  return response.json();
}


// Start Swiggy login
async function startLogin() {
  const client = await registerClient();

  clientId = client.client_id;

  oauthState = randomString(32);
  codeVerifier = randomString(64);

  const codeChallenge = createCodeChallenge(codeVerifier);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: client.client_id,
    redirect_uri: REDIRECT_URI,
    scope: SCOPE,
    state: oauthState,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  const loginUrl =
    `${AUTHORIZATION_ENDPOINT}?${params.toString()}`;

  console.log("Swiggy Login URL:");
  console.log(loginUrl);

  return loginUrl;
}


// Handle OAuth callback
async function handleCallback(
  code,
  state
) {

  if (!state || state !== oauthState) {

    throw new Error(
      "Invalid OAuth state"
    );
  }


  const body =
    new URLSearchParams({

      grant_type:
        "authorization_code",

      code,

      redirect_uri:
        REDIRECT_URI,

      code_verifier:
        codeVerifier,

    });


  // IMPORTANT:
  // client_id is needed here.
  // We'll store it after registration.

  const response =
    await fetch(
      TOKEN_ENDPOINT,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },

        body,
      }
    );


  const result =
    await response.json();


  if (!response.ok) {

    throw new Error(
      JSON.stringify(result)
    );
  }


  accessToken =
    result.access_token;

  refreshToken =
    result.refresh_token;


  return result;
}


function getAccessToken() {
  return accessToken;
}


module.exports = {
  startLogin,
  handleCallback,
  getAccessToken,
};
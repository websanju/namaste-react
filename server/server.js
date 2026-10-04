const express = require("express");
const cors = require("cors");
const {
  getRestaurants,
  getMcpTools,
  getRestaurantMenu,
} = require("./swiggyMcp");
const {
  startLogin,
  handleCallback,
  getAccessToken,
} = require("./swiggyAuth");

const app = express();

app.use(cors());
app.use(express.json());


// Home
app.get("/", (req, res) => {
  res.send(
    "Restaurant API Server is running 🚀"
  );
});


// Start Swiggy login
app.get("/auth/login", async (req, res) => {

  try {

    const loginUrl =
      await startLogin();

    res.redirect(loginUrl);

  } catch (error) {

    console.error(
      "Login error:",
      error
    );

    res.status(500).send(
      error.message
    );
  }
});


// OAuth callback
app.get(
  "/auth/callback",
  async (req, res) => {

    try {

      const {
        code,
        state,
        error,
      } = req.query;


      if (error) {

        return res
          .status(400)
          .send(
            `Swiggy OAuth Error: ${error}`
          );
      }


      if (!code) {

        return res
          .status(400)
          .send(
            "Authorization code missing"
          );
      }


      const token =
        await handleCallback(
          code,
          state
        );


      console.log(
        "Swiggy authentication successful"
      );


      res.send(`
        <html>
          <body>
            <h1>✅ Swiggy Login Successful</h1>
            <p>You can close this window.</p>
            <p>Access token received.</p>
          </body>
        </html>
      `);

    } catch (error) {

      console.error(
        "OAuth callback error:",
        error
      );

      res
        .status(500)
        .send(
          error.message
        );
    }
  }
);


// Check authentication
app.get(
  "/auth/status",
  (req, res) => {

    const token =
      getAccessToken();

    res.json({
      authenticated:
        Boolean(token),
    });
  }
);


// Temporary restaurant endpoint
app.get("/api/restaurants", async (req, res) => {
  try {
    const result = await getRestaurants();

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Restaurant MCP error:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Restaurant Menu
|--------------------------------------------------------------------------
*/

app.get("/api/restaurants/:resId", async (req, res) => {
  try {
    const { resId } = req.params;

    console.log("REQUESTED RESTAURANT ID:", resId);

    if (!resId) {
      return res.status(400).json({
        success: false,
        error: "Restaurant ID is required",
      });
    }

    const result = await getRestaurantMenu(resId);

    res.json(result);
  } catch (error) {
    console.error("Restaurant Menu API error:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/api/mcp/tools", async (req, res) => {
  try {
    const result = await getMcpTools();

    res.json(result);
  } catch (error) {
    console.error("MCP tools error:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});


app.listen(5000, () => {

  console.log(
    "🚀 Server running:"
  );

  console.log(
    "http://localhost:5000"
  );

  console.log(
    "Login:"
  );

  console.log(
    "http://localhost:5000/auth/login"
  );
});
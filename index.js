const express = require("express");
const path = require("path");
const rateLimit = require("express-rate-limit");
const { body } = require("express-validator");
const morgan = require("morgan"); // <--- NEW: Logger
require("dotenv").config();

const app = express();

// IMPORT CONTROLLERS
const pageController = require("./controllers/pageController");
const orderController = require("./controllers/orderController");
const contactController = require("./controllers/contactController");

// MIDDLEWARE
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 1. LOGGING (Fixes Performance Leak)
app.use(morgan("dev")); // Replaces manual hitCounts

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// RATE LIMITER
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Relaxed slightly for testing
  message: "Too many requests, please try again later.",
});
app.use("/place-order", limiter);
app.use("/contact-submit", limiter);

// GLOBAL VARIABLES
app.use((req, res, next) => {
  res.locals.company = {
    name: "Blue Berry Impex",
    email: "blueberryimpex2024@gmail.com",
    phone: "+91 9834431616",
    address:
      "Shop no 2 b38/5 mannat tower near vit college upper Indra nagar bibewadi pune 411037",
    social: { facebook: "#", instagram: "#", twitter: "#" },
  };
  res.locals.activeSearch = "";
  res.locals.activeCategory = "";
  next();
});

// --- ROUTES ---
app.get("/", pageController.getHome);
app.get("/shop", pageController.getShop);
app.get("/product/:id", pageController.getProductDetails);
app.get("/about", pageController.getAbout);
app.get("/contact", pageController.getContact);
app.get("/cart", pageController.getCart);
app.get("/checkout", pageController.getCheckout);
app.get("/packaging-delivery", pageController.getDelivery);
app.get("/order-confirmation", pageController.getOrderConfirmation);
app.get("/privacy-policy", pageController.getPrivacy);
app.get("/terms-conditions", pageController.getTerms);
app.get("/delivery-shipping-policy", pageController.getShippingPolicy);

app.post("/contact-submit", contactController.submitContact);

app.post(
  "/place-order",
  [
    body("billing.email").isEmail().normalizeEmail(),
    body("billing.phone").isMobilePhone(),
    body("billing.name").trim().notEmpty().escape(),
    body("items").isArray({ min: 1 }),
  ],
  orderController.placeOrder,
);

// --- 2. 404 HANDLER (Fixes Routing Issue) ---
// This must be the LAST route before error handling
app.use((req, res, next) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

// --- 3. GLOBAL ERROR HANDLER (Fixes Error Handling) ---
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.stack);
  res.status(500).render("500", {
    title: "Something Went Wrong",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal Server Error",
  });
});

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

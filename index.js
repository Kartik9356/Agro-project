const express = require("express");
const path = require("path");
const app = express();

// for email
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GLOBAL DATA (Enhanced with Description & Category)
const products = [
  {
    id: 1,
    name: "Watermelon – Small",
    image: "/images/products/watermelon-small.jpg",
    price: 60.0,
    originalPrice: 0,
    unit: "1 pc (1.7 - 2.5 kg)",
    sku: "SATWATERMELON",
    category: "Organic Fruits",
    description:
      "Small watermelons are a cherished summer treat, known for their compact size and sweet juiciness. Grown abundantly in states like Maharashtra and Karnataka, these miniatures offer a refreshing respite from the scorching heat. Their crisp, red flesh is a favourite at picnics and festivals.",
  },
  {
    id: 2,
    name: "Nagpur's Famous Orange",
    image: "/images/products/orange.jpg",
    price: 120.0,
    originalPrice: 150.0,
    unit: "1 kg",
    sku: "NAGORANGE",
    category: "Organic Fruits",
    description:
      "Famous for their piquant flavor and juicy pulp, Nagpur Oranges are a staple of Indian winters. Rich in Vitamin C and antioxidants.",
  },
  {
    id: 3,
    name: "Premium Quality Apple",
    image: "/images/products/apple.jpg",
    price: 220.0,
    originalPrice: 260.0,
    unit: "1 kg",
    sku: "KASHAPPLE",
    category: "Imported Fruits",
    description:
      "Crisp, sweet, and delicious. Our premium apples are hand-picked from the finest orchards to ensure the perfect crunch in every bite.",
  },
  {
    id: 4,
    name: "G9 Cavendish Banana",
    image: "/images/products/banana.jpg",
    price: 60.0,
    originalPrice: 80.0,
    unit: "1 dozen",
    sku: "BANANAG9",
    category: "Organic Fruits",
    description:
      "High energy, rich in potassium, and perfect for a quick snack. These G9 varieties are known for their golden yellow color and spotless skin.",
  },
  {
    id: 5,
    name: "Kiwi - Green",
    image: "/images/products/kiwi-green.jpg",
    price: 120.0,
    originalPrice: 150.0,
    unit: "3 pcs",
    sku: "KIWIGREEN",
    category: "Exotic Fruits",
    description:
      "Tangy and sweet, these green kiwis are packed with fiber and essential nutrients.",
  },
  {
    id: 6,
    name: "Papaya - Small",
    image: "/images/products/papaya-small.jpg",
    price: 70.0,
    originalPrice: 90.0,
    unit: "1 pc",
    sku: "PAPAYASMALL",
    category: "Organic Fruits",
    description:
      "Rich in antioxidants and great for digestion. Our papayas are naturally ripened without carbide.",
  },
];

// EMAIL CONFIGURATION (Using Nodemailer with Gmail SMTP)
const OWNER_EMAIL = "kartikbiradar54@gmail.com"; // Owner's real email
const OWNER_PASSWORD = "zvtj uasb aorq qkkf"; // Owner's App Password
// ----------------------------------------------

// EMAIL TRANSPORTER (Uses the variables above)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: OWNER_EMAIL,
    pass: OWNER_PASSWORD,
  },
});

// MIDDLEWARE to print hit count for each route after every request
const hitCounts = {};
app.use((req, res, next) => {
  const route = req.path;
  hitCounts[route] = (hitCounts[route] || 0) + 1;
  console.log(`Route ${route} has been hit ${hitCounts[route]} times.`);
  next();
});

app.use((req, res, next) => {
  res.locals.company = {
    name: "Blue Berry Impex",
    email: "blueberryimpex2024@gmail.com", // Replace with real email
    phone: "+91 9834431616", // Replace with real phone
    address:
      "Shop no 2 b38/5 mannat tower near vit college upper Indra nagar bibewadi pune 411037", // Replace with real address
    mapLink: "https://maps.google.com/...", // Optional: Link to Google Maps
    social: {
      facebook: "#",
      instagram: "#",
      twitter: "#",
    },
  };
  next();
});

app.use((req, res, next) => {
  res.locals.activeSearch = "";
  res.locals.activeCategory = "";
  next();
});

// ROUTES
app.get("/", (req, res) => {
  res.render("home", { title: "Home - Blue Berry Impex", products: products });
});

app.get("/shop", (req, res) => {
  // 1. Get Query Parameters
  const categoryFilter = req.query.category;
  const searchQuery = req.query.search;

  let displayedProducts = products;

  // 2. Filter by Category (if selected)
  if (categoryFilter && categoryFilter !== "") {
    displayedProducts = displayedProducts.filter(
      (p) => p.category === categoryFilter,
    );
  }

  // 3. Filter by Search Query (if typed)
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    displayedProducts = displayedProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query),
    );
  }

  // 4. Render the page
  res.render("shop", {
    title: "Shop - Blue Berry Impex",
    products: displayedProducts,
    activeCategory: categoryFilter || "",
    activeSearch: searchQuery || "", // Send this back so the input stays filled
  });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About Us - Blue Berry Impex" });
});

app.get("/delivery", (req, res) => {
  res.render("delivery", {
    title: "Packaging & Delivery - Blue Berry Impex",
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact Us - Blue Berry Impex" });
});

// NEW: PRODUCT DETAILS ROUTE
app.get("/product/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find((p) => p.id === productId);

  if (product) {
    // Pass the single product AND the full list (for "Related Products")
    res.render("productDetails", {
      title: `${product.name} - Blue Berry Impex`,
      product: product,
      relatedProducts: products.filter((p) => p.id !== productId).slice(0, 4),
    });
  } else {
    res.status(404).send("Product not found");
  }
});

app.get("/cart", (req, res) => {
  // Mock Cart Data (Simulating what would be in the session/database)
  const cartItems = [
    {
      id: 1,
      name: "Watermelon - Small, 1 pc 1.7 - 2.5 kg",
      image:
        "https://www.jiomart.com/images/product/original/590000090/watermelon-kiran-1-pc-approx-2300-g-3000-g-product-images-o590000090-p590000090-0-202408070949.jpg?im=Resize=(1000,1000)",
      price: 60.0,
      quantity: 1,
    },
  ];

  res.render("cart", {
    title: "Cart - Blue Berry Impex",
    cartItems: cartItems,
  });
});

app.get("/checkout", (req, res) => {
  res.render("checkout", { title: "Checkout - Blue Berry Impex" });
});

app.get("/order-confirmation", (req, res) => {
  res.render("orderConfirmation", {
    title: "Order Received - Blue Berry Impex",
  });
});

app.get("/privacy-policy", (req, res) => {
  res.render("privacy-policy", {
    title: "Privacy Policy - Blue Berry Impex",
  });
});

app.get("/terms-conditions", (req, res) => {
  res.render("terms-conditions", {
    title: "Terms & Conditions - Blue Berry Impex",
  });
});

app.get("/delivery-shipping-policy", (req, res) => {
  res.render("delivery-shipping-policy", {
    title: "Delivery & Shipping Policy - Blue Berry Impex",
  });
});

// POST ROUTE: Handle Order Placement & Send Emails
app.post("/place-order", (req, res) => {
  const order = req.body;

  // --- HELPER: Generate Item List HTML ---
  const itemsHtml = order.items
    .map(
      (item) => `
        <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name} ${item.unit ? `(${item.unit})` : ""}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;"><strong>₹${item.price * item.quantity}</strong></td>
        </tr>
    `,
    )
    .join("");

  // --- 1. EMAIL TO CUSTOMER (The Official Receipt) ---
  const customerMailOptions = {
    from: `"Blue Berry Impex" <${OWNER_EMAIL}>`,
    to: order.billing.email,
    subject: `Order Confirmation - Order #${order.id}`,
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h2 style="color: #4CAF50; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">Thank You for Your Order!</h2>
                <p>Hi <strong>${order.billing.name}</strong>,</p>
                <p>We have successfully received your order. We will contact you shortly to confirm the delivery timing.</p>
                
                <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 5px;"><strong>Order ID:</strong> #${order.id}</td>
                        <td style="padding: 5px; text-align: right;"><strong>Date:</strong> ${order.date}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px;"><strong>Payment:</strong> ${order.paymentMethod}</td>
                        <td style="padding: 5px; text-align: right;"><strong>Status:</strong> Processing</td>
                    </tr>
                </table>

                <h3 style="background-color: #f4f4f4; padding: 10px; margin-top: 20px;">Order Summary</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <thead>
                        <tr style="background-color: #eee;">
                            <th style="padding: 8px; text-align: left;">Product</th>
                            <th style="padding: 8px; text-align: center;">Qty</th>
                            <th style="padding: 8px; text-align: right;">Price</th>
                            <th style="padding: 8px; text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
                            <td style="padding: 10px; text-align: right;">₹${order.total}</td>
                        </tr>
                        <tr>
                            <td colspan="3" style="padding: 5px; text-align: right;"><strong>Shipping:</strong></td>
                            <td style="padding: 5px; text-align: right;">Free</td>
                        </tr>
                        <tr style="font-size: 18px; color: #D32F2F;">
                            <td colspan="3" style="padding: 10px; text-align: right;"><strong>Grand Total:</strong></td>
                            <td style="padding: 10px; text-align: right;"><strong>₹${order.total}</strong></td>
                        </tr>
                    </tfoot>
                </table>

                <h3 style="background-color: #f4f4f4; padding: 10px; margin-top: 20px;">Billing Address</h3>
                <p style="line-height: 1.6;">
                    ${order.billing.address}<br>
                    ${order.billing.city}, ${order.billing.state} - ${order.billing.zip}<br>
                    <strong>Phone:</strong> ${order.billing.phone}
                </p>

                <hr style="margin: 30px 0; border: 0; border-top: 1px solid #eee;">
                <p style="text-align: center; font-size: 12px; color: #999;">
                    Blue Berry Impex | +91 98765 43210 | contact@bluebimpex.com
                </p>
            </div>
        `,
  };

  // --- 2. EMAIL TO OWNER (The Full Report) ---
  const adminMailOptions = {
    from: `"Website Order System" <${OWNER_EMAIL}>`,
    to: OWNER_EMAIL,
    subject: `🔔 NEW ORDER: #${order.id} - ₹${order.total} (from ${order.billing.name})`,
    html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #D32F2F;">🔔 New Order Received!</h2>
                
                <div style="background-color: #ffebee; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                    <p style="margin: 5px 0;"><strong>Customer:</strong> ${order.billing.name}</p>
                    <p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:${order.billing.phone}">${order.billing.phone}</a></p>
                    <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${order.billing.email}">${order.billing.email}</a></p>
                    <p style="margin: 5px 0;"><strong>Total Value:</strong> ₹${order.total}</p>
                </div>

                <h3>📦 Items to Pack:</h3>
                <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
                    <thead>
                        <tr style="background-color: #f9f9f9;">
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Product Name</th>
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Qty</th>
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items
                          .map(
                            (item) => `
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;">${item.name} <span style="color:#666; font-size:12px;">(${item.unit})</span></td>
                                <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight:bold;">${item.quantity}</td>
                                <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">₹${item.price * item.quantity}</td>
                            </tr>
                        `,
                          )
                          .join("")}
                    </tbody>
                </table>

                <h3>📍 Delivery Address:</h3>
                <p style="border: 1px dashed #ccc; padding: 10px; background: #fff;">
                    ${order.billing.name}<br>
                    ${order.billing.address}<br>
                    ${order.billing.city}, ${order.billing.state}<br>
                    PIN: <strong>${order.billing.zip}</strong>
                </p>

                <p style="margin-top: 20px; font-size: 12px; color: #666;">
                    Order Date: ${order.date}<br>
                    Payment Method: ${order.paymentMethod}
                </p>
            </div>
        `,
  };

  // --- SEND BOTH EMAILS ---
  Promise.all([
    transporter.sendMail(customerMailOptions),
    transporter.sendMail(adminMailOptions),
  ])
    .then(() => {
      console.log(`✅ Order #${order.id} emails sent successfully.`);
      res.json({ success: true, message: "Order placed and emails sent!" });
    })
    .catch((err) => {
      console.error("❌ EMAIL ERROR:", err);
      // We still show success to the user so they see the Thank You page
      res.json({ success: true, warning: "Order placed but email failed." });
    });
});

// POST ROUTE: Handle Contact Form Submission
app.post("/contact-submit", (req, res) => {
  const { name, email, phone, message } = req.body;

  // 1. Email Content for the OWNER
  const adminMailOptions = {
    from: `"Website Inquiry" <${OWNER_EMAIL}>`,
    to: OWNER_EMAIL,
    replyTo: email, // If owner replies, it goes to the customer
    subject: `📩 New Contact Inquiry from ${name}`,
    html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #4CAF50;">New Message from Website</h2>
                <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50;">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Message:</strong></p>
                    <p style="background-color: #fff; padding: 10px; border: 1px solid #ddd;">${message}</p>
                </div>
            </div>
        `,
  };

  // 2. Send the Email
  transporter
    .sendMail(adminMailOptions)
    .then(() => {
      res.json({ success: true, message: "Message sent successfully!" });
    })
    .catch((err) => {
      console.error("CONTACT FORM ERROR:", err);
      res
        .status(500)
        .json({ success: false, message: "Failed to send message." });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

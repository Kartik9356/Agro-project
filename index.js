const express = require("express");
const path = require("path");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

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
    originalPrice: 0,
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
    originalPrice: 0,
    unit: "1 pc",
    sku: "PAPAYASMALL",
    category: "Organic Fruits",
    description:
      "Rich in antioxidants and great for digestion. Our papayas are naturally ripened without carbide.",
  },
];

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
    res.locals.activeSearch = '';
    res.locals.activeCategory = '';
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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

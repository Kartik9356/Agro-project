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
    image:
      "https://www.jiomart.com/images/product/original/590000090/watermelon-kiran-1-pc-approx-2300-g-3000-g-product-images-o590000090-p590000090-0-202408070949.jpg?im=Resize=(1000,1000)",
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
    image:
      "https://media.istockphoto.com/id/185284489/photo/orange.jpg?s=612x612&w=0&k=20&c=m4EXknC74i2aYWCbjxbzZ6EtRaJkdSJNtekh4m1PspE=",
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
    image:
      "https://media.istockphoto.com/id/184276818/photo/red-apple.jpg?s=612x612&w=0&k=20&c=MkZSlyZkdYsI602IL9lUvY15Zj8OecB92kGC70eL4q8=",
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
    image:
      "https://t4.ftcdn.net/jpg/02/63/64/67/360_F_263646700_M5CF7ba2F6F7c7c3c3c3c3c3c3c3c3c3.jpg",
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
    image:
      "https://media.istockphoto.com/id/834845016/photo/kiwi-fruit-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=2d30vN3t5zM9yW7r6t8o9q0p1s2u3v4w5x6y7z8",
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
    image:
      "https://media.istockphoto.com/id/1152601633/photo/papaya-fruit-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=1a2b3c4d5e6f7g8h9i0j",
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

// ROUTES
app.get("/", (req, res) => {
  res.render("home", {
    title: "Janta Agro Traders - Home",
    products: products,
  });
});

app.get("/shop", (req, res) => {
  res.render("shop", {
    title: "Shop - Janta Agro Traders",
    products: products,
  });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About Us - Janta Agro Traders" });
});

app.get("/delivery", (req, res) => {
  res.render("delivery", {
    title: "Packaging & Delivery - Janta Agro Traders",
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact Us - Janta Agro Traders" });
});

// NEW: PRODUCT DETAILS ROUTE
app.get("/product/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find((p) => p.id === productId);

  if (product) {
    // Pass the single product AND the full list (for "Related Products")
    res.render("productDetails", {
      title: `${product.name} - Janta Agro`,
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
    title: "Cart - Janta Agro Traders",
    cartItems: cartItems,
  });
});

app.get("/checkout", (req, res) => {
  // Reuse the mock cart data for the summary
  const cartItems = [
    {
      name: "Watermelon - Small, 1 pc 1.7 - 2.5 kg",
      price: 60.0,
      quantity: 1,
    },
  ];

  res.render("checkout", {
    title: "Checkout - Janta Agro Traders",
    cartItems: cartItems,
  });
});

app.get("/order-confirmation", (req, res) => {
  // Mock Order Data to match your screenshot
  const order = {
    id: 901,
    date: "February 11, 2026",
    total: 60.0,
    paymentMethod: "Cash on delivery",
    shippingCost: 0,
    items: [
      {
        name: "Watermelon - Small, 1 pc 1.7 - 2.5 kg",
        price: 60.0,
        quantity: 1,
      },
    ],
    billing: {
      name: "Kartik Biradar", // Using your profile name
      address: "pakiza colony opp dargah",
      city: "Amravati",
      zip: "444601",
      state: "Maharashtra",
      phone: "7448124205",
      email: "sales@jantaagrotraders.com",
    },
    shipping: {
      name: "Kartik Biradar",
      address: "pakiza colony opp dargah",
      city: "Amravati",
      zip: "444601",
      state: "Maharashtra",
    },
  };

  res.render("orderConfirmation", {
    title: "Order Received - Janta Agro Traders",
    order: order,
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

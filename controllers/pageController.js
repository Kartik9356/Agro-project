const products = require("../data/products"); // Import products

exports.getHome = (req, res) => {
  res.render("home", { title: "Home - Blue Berry Impex", products: products });
};

exports.getShop = (req, res) => {
  const categoryFilter = req.query.category;
  const searchQuery = req.query.search;
  let displayedProducts = products;

  if (categoryFilter && categoryFilter !== "") {
    displayedProducts = displayedProducts.filter(
      (p) => p.category === categoryFilter,
    );
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    displayedProducts = displayedProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query),
    );
  }

  res.render("shop", {
    title: "Shop - Blue Berry Impex",
    products: displayedProducts,
    activeCategory: categoryFilter || "",
    activeSearch: searchQuery || "",
  });
};

exports.getProductDetails = (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find((p) => p.id === productId);

  if (product) {
    res.render("productDetails", {
      title: `${product.name} - Blue Berry Impex`,
      product: product,
      relatedProducts: products.filter((p) => p.id !== productId).slice(0, 4),
    });
  } else {
    res.status(404).send("Product not found");
  }
};

exports.getCart = (req, res) => {
  // Mock Cart Data
  const cartItems = [
    {
      id: 1,
      name: "Watermelon - Small",
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
};

// Simple Static Pages
exports.getAbout = (req, res) => res.render("about", { title: "About Us" });
exports.getContact = (req, res) =>
  res.render("contact", { title: "Contact Us" });
exports.getDelivery = (req, res) =>
  res.render("delivery", { title: "Packaging & Delivery" });
exports.getCheckout = (req, res) =>
  res.render("checkout", { title: "Checkout" });
exports.getOrderConfirmation = (req, res) =>
  res.render("orderConfirmation", { title: "Order Received" });

// Legal Pages
exports.getPrivacy = (req, res) =>
  res.render("privacy-policy", { title: "Privacy Policy" });
exports.getTerms = (req, res) =>
  res.render("terms-conditions", { title: "Terms & Conditions" });
exports.getShippingPolicy = (req, res) =>
  res.render("delivery-shipping-policy", { title: "Shipping Policy" });

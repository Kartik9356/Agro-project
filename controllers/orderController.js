const { validationResult } = require("express-validator");
const products = require("../data/products");
const transporter = require("../config/transporter");
const ejs = require("ejs");
const path = require("path");
require("dotenv").config();

exports.placeOrder = async (req, res, next) => {
  // Added 'next' for error handling
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const clientOrder = req.body;
  let calculatedTotal = 0;
  let secureItems = [];

  try {
    // 1. Logic & Security Recalculation
    clientOrder.items.forEach((clientItem) => {
      const productFromDb = products.find((p) => p.id == clientItem.id);
      if (!productFromDb)
        throw new Error(`Invalid Product ID: ${clientItem.id}`);

      const realPrice = productFromDb.price;
      const quantity = parseInt(clientItem.quantity) || 1;
      const itemTotal = realPrice * quantity;

      calculatedTotal += itemTotal;

      secureItems.push({
        name: productFromDb.name,
        price: realPrice,
        quantity: quantity,
        total: itemTotal,
      });
    });

    const serverOrderId = Math.floor(100000 + Math.random() * 900000);

    // 2. RENDER EMAILS FROM TEMPLATES (Fixes Code Quality)
    // We use ejs.renderFile to create the HTML string
    const customerHtml = await ejs.renderFile(
      path.join(__dirname, "../views/emails/orderReceipt.ejs"),
      {
        orderId: serverOrderId,
        name: clientOrder.billing.name,
        items: secureItems,
        total: calculatedTotal,
      },
    );

    const adminHtml = await ejs.renderFile(
      path.join(__dirname, "../views/emails/adminAlert.ejs"),
      {
        orderId: serverOrderId,
        name: clientOrder.billing.name,
        phone: clientOrder.billing.phone,
        email: clientOrder.billing.email,
        total: calculatedTotal,
      },
    );

    // 3. Send Emails
    await Promise.all([
      transporter.sendMail({
        from: `"Blue Berry Impex" <${process.env.OWNER_EMAIL}>`,
        to: clientOrder.billing.email,
        subject: `Order Confirmation - #${serverOrderId}`,
        html: customerHtml, // <--- Using the rendered HTML
      }),
      transporter.sendMail({
        from: `"System" <${process.env.OWNER_EMAIL}>`,
        to: process.env.OWNER_EMAIL,
        subject: `💰 NEW ORDER: ₹${calculatedTotal}`,
        html: adminHtml, // <--- Using the rendered HTML
      }),
    ]);

    res.json({ success: true, message: "Order verified and processed" });
  } catch (err) {
    next(err); // Pass error to Global Error Handler (Fixes Error Handling)
  }
};

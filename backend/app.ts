const path = require("path");
const express = require("express");
const cors = require("cors");
const productsRouter = require("./routes/products");
const checkoutRouter = require("./routes/checkout");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use("/api/products", productsRouter);
app.use("/api/checkout", checkoutRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

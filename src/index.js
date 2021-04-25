const express = require("express");
const env = require("dotenv");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

//routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin/auth");
// const categoryRoutes = require("./routes/category");
const projectRoutes = require("./routes/project");
const propertiesRoutes = require("./routes/properties");
const unitRoutes = require("./routes/unit");
const masterRoutes = require("./routes/masters");
const allmasterRoutes = require("./routes/getallmasters");
// const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const initialDataRoutes = require("./routes/admin/initialData");
const pageRoutes = require("./routes/admin/page");
const addressRoutes = require("./routes/address");
const orderRoutes = require("./routes/order");
const adminOrderRoute = require("./routes/admin/order.routes");

//environment variable or you can say constants
env.config();

// mongodb connection
//mongodb+srv://ijmadmin:ijmadmin@cluster0.bf8pf.mongodb.net/ijm?retryWrites=true&w=majority

// const DB_URL = process.env.MONGODB_URL;

mongoose
  .connect(
    "mongodb+srv://ijmadmin:ijmadmin@cluster0.bf8pf.mongodb.net/ijm?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => {
    console.log("Database connected");
  });

app.use(cors());
app.use(express.json());

app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use("/api", authRoutes);
app.use("/api", adminRoutes);
// app.use("/api", categoryRoutes);
app.use("/api", projectRoutes);
app.use("/api", propertiesRoutes);
app.use("/api", masterRoutes);
app.use("/api", allmasterRoutes);
// app.use("/api", productRoutes);
app.use("/api", unitRoutes);
app.use("/api", cartRoutes);
app.use("/api", initialDataRoutes);
app.use("/api", pageRoutes);
app.use("/api", addressRoutes);
app.use("/api", orderRoutes);
app.use("/api", adminOrderRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");

const app = express();
connectDB();

app.use(express.json());

app.use("/users", require("./src/routes/userRoutes"));
app.use("/groups", require("./src/routes/groupRoutes"));
app.use("/expenses", require("./src/routes/expenseRoutes"));
app.use("/balances", require("./src/routes/balanceRoutes"));


app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);

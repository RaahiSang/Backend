const express = require("express");
const app = express();
const AuthRouter = require("./Routes/AuthRouter");
const FormDataRouter = require("./Routes/FormDataRouter");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();
require("./Models/db");

app.get("/", (req, res) => {
  res.send("Welcome to home page");
});

app.use(bodyParser.json());
app.use(cors());
app.use("/auth", AuthRouter.router);
app.use("/user", FormDataRouter.router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

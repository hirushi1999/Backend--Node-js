const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const PORT = process.env.PORT || 8090;
// MONGODB connection
console.log(process.env.MONGODB_URL);
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connect to Database"))
  .catch((err) => console.log(err));

// schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
  image: String,
});

const userModel = mongoose.model("users", userSchema);

//API
app.get("/", (req, res) => {
  res.send("server is running");
});

//Sign Up API
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  try {
    const existingUser = await userModel.findOne({ email: email }).exec();
    console.log(existingUser);

    if (existingUser) {
      res.send({ message: "Email id is already registered", alert: false });
    } else {
      const newUser = new userModel(req.body);
      await newUser.save();
      res.send({ message: "Successfully registered", alert: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

//Login API
app.post("/login", async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await userModel.findOne({ email: email }).exec();

    if (existingUser) {
      const dataSend = {
        _id: existingUser._id,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
        image: existingUser.image,
      };
      console.log(dataSend);
      res.send({
        message: "Login is successful.",
        alert: true,
        data: dataSend,
      });
    } else {
      res.send({ message: "Email is not registered", alert: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

//server is running
app.listen(PORT, () => console.log("server is running at port : " + PORT));


//Product section
const schemaProduct = mongoose.Schema({
    name : String,
    category : String,
    image : String,
    price : String,
    description : String,
});

const productModel = mongoose.model("products", schemaProduct);

// save product API
app.post("/saveProduct", async(req, res) => {
  console.log(req.body);

  const data = await productModel(req.body)
  const datasave = await data.save()
  res.send({message: "New Product added successfully"});
});

//
app.get("/product",async(req,res)=>{
  const data = await productModel.find({});
  res.send(JSON.stringify(data));
})

//Review section
const schemaReview = mongoose.Schema({
  name : String,
  designation : String,
  comment : String,
  rating: Number,
});

const reviewModel = mongoose.model("reviews", schemaReview);

// save review API
app.post("/saveReview", async(req, res) => {
console.log(req.body);

const data = await reviewModel(req.body)
const datasave = await data.save()
res.send({message: "Your comment added successfully"});
});

//
app.get("/review",async(req,res)=>{
  const data = await reviewModel.find({});
  res.send(JSON.stringify(data));
})

//subscribe email
//subscribe email section
const schemaSubscribe = mongoose.Schema({
  email : String,
});

const subscribeModel = mongoose.model("cusEmails", schemaSubscribe);

// save product API
app.post("/subscribeEmail", async(req, res) => {
console.log(req.body);

const data = await subscribeModel(req.body)
const datasave = await data.save()
res.send({message: "Email added successfully"});
});

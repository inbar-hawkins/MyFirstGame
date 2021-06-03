const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); //for layouts

const campgrounds = require("./routes/campgrounds"); //for campgrounds routes
const reviews = require("./routes/reviews"); //for reviews routes

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use("/campgrounds", campgrounds);//update campgrounds routes
app.use("/campgrounds/:id/reviews", reviews);//update reviews routes

app.get("/", (req, res) => {
    res.render("home");
})

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong!";
    res.status(statusCode).render("error", { err });
})


app.listen(3000, () => {
    console.log("serving on port 3000");
})

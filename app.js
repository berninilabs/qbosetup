var path = require("path");
var config = require("./config.json");
var express = require("express");
var session = require("express-session");
const bodyParser = require("body-parser");

var app = express();
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({ secret: "secret", resave: "false", saveUninitialized: "false" })
);

// Initial view - loads Connect To QuickBooks Button
app.get("/", function (req, res) {
  res.render("home", config);
});

app.use("/connect_to_quickbooks", require("./routes/connect_to_quickbooks.js"));

// Callback - called via redirect_uri after authorization
app.use("/callback", require("./routes/callback.js"));

// Connected - call OpenID and render connected view
app.use("/connected", require("./routes/connected.js"));

// Call an example API over OAuth2
app.use("/api_call", require("./routes/api_call.js"));

app.use("/user_api_call", require("./routes/user_api_call.js"));

app.use("/upload_files", require("./routes/upload_files.js"));

// Start server on HTTP (will use ngrok for HTTPS forwarding)
app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});

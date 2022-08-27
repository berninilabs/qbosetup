const multer = require("multer");
const upload = multer({ dest: "uploads/" });

var tools = require("../tools/tools.js");
var config = require("../config.json");
var request = require("request");
var express = require("express");
var router = express.Router();

const xlsxFile = require("read-excel-file/node");

router.post("/", upload.array("files"), (req, res) => {
  //console.log(req.body);
  console.log(req.files);
  xlsxFile(req.files[0].path, { sheet: "Vendor List" }).then((rows) => {
    rows.forEach((col) => {
      col.forEach((data) => {
        console.log(data);
      });
    });
  });
  return res.json({ message: "Successfully uploaded files" });
}); //upload.array("files"),

module.exports = router;

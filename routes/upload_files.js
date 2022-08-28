const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");

var no = require("../tools/tools.js");
var config = require("../config.json");
var request = require("request");
var express = require("express");
var router = express.Router();

const xlsxFile = require("read-excel-file/node");
const { json } = require("express");

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

  /*await fs.unlink(req.files[0].path, (err) => {
    if (err) {
      console.error(err);
    }
  });*/

  const jsonResponse = { message: "Successfully uploaded files" };
  console.log(jsonResponse);
  return res.json(jsonResponse);
});

module.exports = router;

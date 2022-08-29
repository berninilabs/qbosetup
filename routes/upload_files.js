//var qbo_api = require("../service/qbo_api.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");

var tools = require("../tools/tools.js");
var config = require("../config.json");
var request = require("request");
var express = require("express");
var router = express.Router();

const xlsxFile = require("read-excel-file/node");
const { json } = require("express");

router.post("/", upload.array("files"), (req, res) => {
  //console.log(req.body);
  console.log(req.files);
  var successCount = xlsxFile(req.files[0].path, { sheet: "Vendor List" }).then(
    (rows) => {
      update_vendors_new(req, res, rows);
    }
  );

  const jsonResponse = {
    message: `Successfully uploaded ${successCount} vendors`,
  };
  console.log(jsonResponse);
  return res.json(jsonResponse);
});

/*await fs.unlink(req.files[0].path, (err) => {
    if (err) {
      console.error(err);
    }
  });*/
function update_vendors_new(req, res, rows) {
  console.log(`Inside update_vendors_new with ${rows.length} rows`);
  var token = tools.getToken(req.session);
  if (!token) return res.json({ error: "Not authorized" });
  if (!req.session.realmId)
    return res.json({
      error:
        "No realm ID.  QBO calls only work if the accounting scope was passed!",
    });

  var url = config.api_uri + req.session.realmId + "/vendor";
  var vendors = [];

  rows.forEach((col) => {
    col.forEach((data) => {
      vendors.push(data);
    });
  });

  const successCount = make_api_call(req, res, url, token, vendors.shift()); //remove the first
  return successCount;
}

function make_api_call(req, res, url, token, vendors) {
  console.log(
    `Inside make_api_call with vendors ${
      vendors.length
    } to url ${url} with first vendor ${vendors[0]} and last vendor ${
      vendors[vendors.length - 1]
    }`
  );
  var successCount = 0;
  for (vidx in vendors) {
    var requestObj = {
      url: url,
      method: "POST",
      headers: {
        Authorization: "Bearer " + token.accessToken,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        DisplayName: vendors[vidx],
      }),
    };
    console.log(
      "Making API call to: " + url + " with body: " + requestObj.body
    );
    // Make API call
    request(requestObj, function (err, response) {
      // Check if 401 response was returned - refresh tokens if so!
      tools.checkForUnauthorized(req, requestObj, err, response).then(
        function ({ err, response }) {
          if (err || response.statusCode != 200) {
            //console.log(response.body);
            console.log(
              `Error in adding vendor: ${vendors[vidx]}. Got response: ${response.body} with error ${err}`
            );
            /*return res.json({
              error: err,
              statusCode: response.statusCode,
            });*/
          } else {
            // API Call was a success!
            //const responseBody = JSON.parse(response.body);
            console.log(`Successfully added vendor: ${vendors[vidx]}`);
            successCount += 1;
            //res.json(responseBody);
          }
        },
        function (err) {
          console.log(`Unable to add vendor: ${vendors[vidx]}`, err);
        }
      );
    });
  }
  return successCount;
}
module.exports = router;

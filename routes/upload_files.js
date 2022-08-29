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
  var successCount = update_vendors_new(
    req,
    res,
    xlsxFile(req.files[0].path, { sheet: "Vendor List" })
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
function update_vendors_new(req, res, xlsxFile) {
  var token = tools.getToken(req.session);
  if (!token) return res.json({ error: "Not authorized" });
  if (!req.session.realmId)
    return res.json({
      error:
        "No realm ID.  QBO calls only work if the accounting scope was passed!",
    });

  // Set up API call (with OAuth2 accessToken)
  var successCount = 0;
  var url = config.api_uri + req.session.realmId + "/vendor";
  xlsxFile.then((rows) => {
    rows.forEach((col) => {
      col.forEach((data) => {
        var requestObj = {
          url: url,
          method: "POST",
          headers: {
            Authorization: "Bearer " + token.accessToken,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            DisplayName: data,
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
                console.log(response.body);
                return res.json({
                  error: err,
                  statusCode: response.statusCode,
                });
              }

              // API Call was a success!
              const responseBody = JSON.parse(response.body);
              console.log(responseBody);
              successCount += 1;
              //res.json(responseBody);
            },
            function (err) {
              console.log(err);
            }
          );
        });
      });
    });
  });
  return successCount;
}

module.exports = router;

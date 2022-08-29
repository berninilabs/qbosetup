var request = require("request");
var tools = require("../tools/tools.js");

module.exports = function update_vendors(req, res, rows) {
  const jsonResponse = {
    message: `Successfully uploaded vendors`,
  };
  console.log(jsonResponse);
  return res.json(jsonResponse);
};

function update_vendors_new(req, res, rows) {
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
  for (r in rows) {
    var requestObj = {
      url: url,
      method: "POST",
      headers: {
        Authorization: "Bearer " + token.accessToken,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        DisplayName: r[0],
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
            return res.json({ error: err, statusCode: response.statusCode });
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
  }
  return successCount;
}

var tools = require("../tools/tools.js");
var config = require("../config.json");
var request = require("request");
var express = require("express");
var router = express.Router();

var users_in_db = [
  {
    id: 0,
    name: "Sang",
    email: "Sang@test.com",
  },
  {
    id: 1,
    name: "Venkatraman",
    email: "Venkatraman@test.com",
  },
];

/** /api_call **/
router.get("/users", function (req, res) {
  console.log(`Inside list users`);
  for (i in users_in_db) {
    const updateButton = `<button class='btn btn-sm btn-info updateUser' data-id='${users_in_db[i].id}' data-toggle='modal' data-target='#updateModal' >Update</button>`;
    // Delete Button
    const deleteButton = `<button class='btn btn-sm btn-danger deleteUser' data-id='${users_in_db[i].id}'>Delete</button>`;
    users_in_db[i].action = `${updateButton} ${deleteButton}`;
  }
  return res.json(users_in_db);
});

router.put("/user/:id", function (req, res) {
  const { id } = req.params;
  console.log(
    `Inside put user with id ${id} with update as ${JSON.stringify(req.body)}`
  );
  users_in_db = users_in_db.filter((e) => e.id != id);
  var updatedItem = req.body;
  updatedItem.id = id;
  users_in_db.push(updatedItem);
  users_in_db = users_in_db.sort((a, b) => a.id - b.id);
  return res.sendStatus(200);
});

router.delete("/user/:id", function (req, res) {
  const { id } = req.params;
  console.log(`Inside delete user with id ${id}`);
  users_in_db = users_in_db.filter((e) => e.id != id);
  console.log(
    `About to send response. Number of users in db are ${users_in_db.length}`
  );
  return res.sendStatus(200);
});

router.post("/user", function (req, res) {
  console.log(`Inside create user with req.body ${JSON.stringify(req.body)}`);
  var newItem = req.body;
  newItem.id = users_in_db.length; //length before adding is correct index
  users_in_db.push(newItem);
  return res.sendStatus(200);
});

module.exports = router;

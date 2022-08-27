const xlsxFile = require("read-excel-file/node");

const fileName =
  "/Users/sangvenkatraman/Downloads/CleverProfits - Templates - COA Upload (1).xlsx";

xlsxFile(fileName, { sheet: "COA Cheat Sheet" }).then((rows) => {
  rows.forEach((col) => {
    col.forEach((data) => {
      console.log(data);
    });
  });
});

xlsxFile(fileName, { sheet: "Vendor List" }).then((rows) => {
  rows.forEach((col) => {
    col.forEach((data) => {
      console.log(data);
    });
  });
});

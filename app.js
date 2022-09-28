const downloadFiles = require("./downloadInvoiceFiles");

const extractData = require("./extractDataFromInvoiceFiles");

async function main() {
  await downloadFiles();
  await extractData();
}

main();

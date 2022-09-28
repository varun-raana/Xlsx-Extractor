const { PdfReader } = require("pdfreader");

const fs = require("fs");
let buyerNameFlag = false;
let orderNumberFlag = false;
let invoiceNumberFlag = false;
let invoiceDateFlag = false;
let orderDateFlag = false;
let productTitleStartFlag = false;
let hsnFlag = false;
let snFlag = false;
let discountCounter = 0;
let discountFlag = false;
let taxableValue = false;
let taxRateFlag = false;
const Invoice = require("./InvoiceDataClass");

function resetFlags() {
	buyerNameFlag = false;
	orderNumberFlag = false;
	invoiceNumberFlag = false;
	invoiceDateFlag = false;
	orderDateFlag = false;
	productTitleStartFlag = false;
	hsnFlag = false;
	snFlag = false;
	discountCounter = 0;
	discountFlag = false;
	taxableValue = false;
	taxRateFlag = false;
	return new Invoice();
}

let addressFlag = false;
async function getInvoiceData(fileName) {
	//reset all flags before process new file
	const invoice = resetFlags();

	// set the new file name in invoice object
	invoice.fileName = fileName.split("/").pop();

	return new Promise((resolve, reject) => {
		new PdfReader().parseFileItems(fileName, (err, item) => {
			if (err) {
				console.error("error:", err);
				reject();
			}
			if (!item) {
				resolve(invoice);
			} else if (item.text) {
				checkData(item.text, invoice);
				if (item.text === "SHIP TO:") {
					// next value in loop will be buyer name
					buyerNameFlag = true;
				} else if (item.text === "Purchase Order Number") {
					// next value in loop will be order number
					orderNumberFlag = true;
				} else if (item.text === "Invoice Number") {
					// next value in loop will be invoice number
					invoiceNumberFlag = true;
				} else if (item.text === "Invoice Date") {
					// address data over
					addressFlag = false;
					// next value will be invoie date flag
					invoiceDateFlag = true;
				} else if (item.text === "Order Date") {
					// next value will be order date
					orderDateFlag = true;
				} else if (item.text === "Total") {
					// product lines started
					snFlag = true;
				}
			}
		});
	});
}

async function extractData() {
	const files = fs.readdirSync("./invoiceFiles");
	console.log(`-----------------------------------------------------------`);
	for (const file of files) {
		// console.log(`Invoice file : ${file}`);

		const invoice = await getInvoiceData(`./invoiceFiles/${file}`);
		console.log(invoice);
		console.log(`-----------------------------------------------------------`);
		console.log("\n \n");
	}
}
function checkData(text, invoice) {
	if (buyerNameFlag) {
		buyerNameFlag = false;

		// after buyer name all values are address
		// until the next string is invoice date
		addressFlag = true;

		invoice.buyerName = text;
	} else if (orderNumberFlag) {
		orderNumberFlag = false;
		invoice.orderNumber = text;
	} else if (invoiceNumberFlag) {
		invoiceNumberFlag = false;
		invoice.invoiceNumber = text;
	} else if (addressFlag && text != "Invoice Date") {
		invoice.buyerAddress += text;
	} else if (invoiceDateFlag) {
		invoiceDateFlag = false;
		invoice.invoiceDate = text;
	} else if (orderDateFlag) {
		orderDateFlag = false;
		invoice.orderDate = text;
	} else if (snFlag && !isNaN(text)) {
		productTitleStartFlag = true;
		snFlag = false;
	} else if (productTitleStartFlag && isNaN(text)) {
		invoice.productTitle += text;
	} else if (productTitleStartFlag && !isNaN(text)) {
		productTitleStartFlag = false;
		hsnFlag = true;

		invoice.hsn = text;
	} else if (hsnFlag && discountCounter !== 2) {
		discountCounter += 1;
	} else if (hsnFlag && discountCounter === 2) {
		hsnFlag = false;
		discountFlag = true;

		invoice.discount = text;
	} else if (discountFlag) {
		discountFlag = false;
		taxableValue = true;

		invoice.taxableValue = text;
	} else if (taxableValue) {
		taxableValue = false;
		const taxCategory = text.split(" ")[0];
		const taxRate = text.split(" ")[1];

		taxRateFlag = true;
		invoice.taxRate = taxRate;
		invoice.taxCategory = taxCategory;
	}
}

module.exports = extractData;

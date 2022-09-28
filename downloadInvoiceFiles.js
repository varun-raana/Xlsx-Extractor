const axios = require("axios");
const fs = require("fs");
const getInvoiceFileUrls = require("./extractInvoiceFileLinksFromExcel");

async function downloadAndSaveInvoice() {
	try {
		const fileLinks = await getInvoiceFileUrls();

		for (const link of fileLinks) {
			const response = await axios.get(link, { responseType: "arraybuffer" });
			if (response && response.data) {
				const fileName = link.split("/").pop();

				{
					responseType: "arraybuffer";
				}
				fs.writeFileSync(`./invoiceFiles/${fileName}`, response.data);
				console.log(`Downloaded ${fileName}`);
			}
		}
	} catch (error) {
		console.error(error);
	}
}

module.exports = downloadAndSaveInvoice;

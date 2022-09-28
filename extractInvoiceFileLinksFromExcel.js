const readXlsxFile = require("read-excel-file/node");

async function readExcelData() {
	let excelData = [];
	excelData = await readXlsxFile("./Varun_assigment.xlsx");

	let invoiceURLS = [];
	if (excelData) {
		invoiceURLS = excelData.map((excelRow) => {
			return excelRow.filter((excelCol) => {
				excelCol && String(excelCol).endsWith(".pdf");
				// excelCol && String(excelCol).includes("http");
			});
		});

		//removing blank url fields
		invoiceURLS = invoiceURLS.filter((url) => url.length > 0);
		// flatten url arrays to get all urls in one array
		invoiceURLS = invoiceURLS.flat();
	}
	console.log(invoiceURLS);

	return invoiceURLS;
}

readExcelData();

module.exports = readExcelData;

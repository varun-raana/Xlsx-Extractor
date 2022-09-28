const { PdfReader } = require("pdfreader");

new PdfReader().parseFileItems(
	"./invoiceFiles/02a6927e5375d83063d5c23ed4c14474c12ad209.pdf",
	(err, item) => {
		if (err) {
			console.error("error:", err);
		}

		if (!item) {
			console.log("End of file");
		} else if (item && item.text) {
			console.log(item.text);
		}
	},
);

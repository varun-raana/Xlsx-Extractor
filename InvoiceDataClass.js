class InvoiceData {
  orderNumber = null;
  invoiceNumber = null;
  buyerName = null;
  buyerAddress = "";
  invoiceDate = null;
  orderDate = null;
  productTitle = "";
  hsn = null;
  taxableValue = null;
  discount = null;
  taxRate = null;
  taxCategory = null;
  fileName = null;
  constructor() {
    this.invoiceID = Date.now();
  }
}

module.exports = InvoiceData;

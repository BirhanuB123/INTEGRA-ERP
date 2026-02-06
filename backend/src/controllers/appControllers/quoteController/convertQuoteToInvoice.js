const mongoose = require('mongoose');

const QuoteModel = mongoose.model('Quote');
const InvoiceModel = mongoose.model('Invoice');
const ApprovalModel = mongoose.model('Approval');

const { readBySettingKey, increaseBySettingKey } = require('@/middlewares/settings');

const convertQuoteToInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Fetch the Quote
    const quote = await QuoteModel.findOne({ _id: id, removed: false });

    if (!quote) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Quote not found',
      });
    }

    if (quote.converted) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Quote is already converted to an invoice',
      });
    }

    // 2. Get next invoice number
    const lastInvoiceNumberSetting = await readBySettingKey({ settingKey: 'last_invoice_number' });
    const lastInvoiceYearSetting = await readBySettingKey({ settingKey: 'last_invoice_year' });

    const nextInvoiceNumber = (lastInvoiceNumberSetting?.settingValue || 0) + 1;
    const currentYear = new Date().getFullYear();

    // 3. Create Invoice Data
    const invoiceData = {
      number: nextInvoiceNumber,
      year: currentYear,
      date: new Date(),
      expiredDate: quote.expiredDate,
      client: quote.client,
      items: quote.items,
      taxRate: quote.taxRate,
      subTotal: quote.subTotal,
      taxTotal: quote.taxTotal,
      total: quote.total,
      currency: quote.currency,
      createdBy: req.admin._id,
      converted: {
        from: 'quote',
        quote: quote._id,
      },
      status: 'draft',
      paymentStatus: 'unpaid',
      approvalStatus: 'pending',
      pdf: `invoice-${nextInvoiceNumber}.pdf`, // Placeholder, will be updated by PDF generator if exists
    };

    // 4. Save the Invoice
    const invoice = await new InvoiceModel(invoiceData).save();

    // 5. Create Approval Request for the Invoice
    await new ApprovalModel({
      entityType: 'Invoice',
      entityId: invoice._id,
      requestedBy: req.admin._id,
      approvalType: 'finance_approval',
      priority: invoice.total > 20000 ? 'high' : 'medium',
      metadata: {
        total: invoice.total,
        client: quote.client.name || quote.client,
        number: invoice.number,
        year: invoice.year,
      },
    }).save();

    // 6. Update Inventory (Soft-deduction)
    const StockMovementModel = mongoose.model('StockMovement');
    const ProductModel = mongoose.model('Product');

    for (const item of quote.items) {
      if (item.product) {
        const product = await ProductModel.findById(item.product);
        if (product) {
          const previousQuantity = product.quantity;
          const newQuantity = previousQuantity - item.quantity;

          // Record Stock Movement
          await new StockMovementModel({
            product: product._id,
            warehouse: req.body.warehouse || product.warehouse || null, // Fallback if warehouse not specified
            type: 'out',
            quantity: item.quantity,
            previousQuantity,
            newQuantity,
            reference: `INV-${nextInvoiceNumber}`,
            description: `Stock reserved from Quote conversion (Quote #${quote.number})`,
            user: req.admin._id,
          }).save();

          // Update Product Quantity
          await ProductModel.findByIdAndUpdate(product._id, {
            quantity: newQuantity,
            $inc: { reservedQuantity: item.quantity },
          });
        }
      }
    }

    // 7. Update Quote
    await QuoteModel.findByIdAndUpdate(quote._id, {
      converted: true,
      status: 'accepted',
    });

    // 8. Increment Invoice Number in Settings
    await increaseBySettingKey({ settingKey: 'last_invoice_number' });

    return res.status(200).json({
      success: true,
      result: invoice,
      message: 'Quote converted to Invoice successfully. Pending Finance approval.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
    });
  }
};

module.exports = convertQuoteToInvoice;

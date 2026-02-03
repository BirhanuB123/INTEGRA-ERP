const mongoose = require('mongoose');

const Model = mongoose.model('Payment');
const Invoice = mongoose.model('Invoice');
const custom = require('@/controllers/pdfController');

const { calculate } = require('@/helpers');

const create = async (req, res) => {
  // Creating a new document in the collection
  if (req.body.amount === 0) {
    return res.status(202).json({
      success: false,
      result: null,
      message: `The Minimum Amount couldn't be 0`,
    });
  }

  const currentInvoice = await Invoice.findOne({
    _id: req.body.invoice,
    removed: false,
  });

  const {
    total: previousTotal,
    discount: previousDiscount,
    credit: previousCredit,
  } = currentInvoice;

  const { amount } = req.body;
  const maxAmount = calculate.sub(calculate.sub(previousTotal, previousDiscount), previousCredit);

  if (amount > maxAmount) {
    return res.status(202).json({
      success: false,
      result: null,
      message: `The Max Amount you can add is ${maxAmount}`,
    });
  }
  req.body['createdBy'] = req.admin._id;
  req.body['approvalStatus'] = 'pending';

  const result = await Model.create(req.body);

  // Create approval request for payment
  const Approval = mongoose.model('Approval');
  await new Approval({
    entityType: 'Payment',
    entityId: result._id,
    requestedBy: req.admin._id,
    approvalType: 'finance_approval',
    priority: amount > 10000 ? 'high' : 'medium',
    metadata: {
      amount: amount,
      invoiceId: req.body.invoice,
      paymentMode: req.body.paymentMode,
    },
    removed: false,
  }).save();

  const fileId = 'payment-' + result._id + '.pdf';
  const updatePath = await Model.findOneAndUpdate(
    {
      _id: result._id.toString(),
      removed: false,
    },
    { pdf: fileId },
    {
      new: true,
    }
  ).exec();

  return res.status(200).json({
    success: true,
    result: updatePath,
    message: 'Payment created successfully. Pending Finance approval.',
  });
};

module.exports = create;

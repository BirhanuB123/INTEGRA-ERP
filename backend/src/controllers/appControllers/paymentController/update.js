const mongoose = require('mongoose');

const Model = mongoose.model('Payment');
const Invoice = mongoose.model('Invoice');
const custom = require('@/controllers/pdfController');

const { calculate } = require('@/helpers');

const update = async (req, res) => {
  if (req.body.amount === 0) {
    return res.status(202).json({
      success: false,
      result: null,
      message: `The Minimum Amount couldn't be 0`,
    });
  }
  // Find document by id and updates with the required fields
  const previousPayment = await Model.findOne({
    _id: req.params.id,
    removed: false,
  });

  const { amount: previousAmount } = previousPayment;
  const { id: invoiceId, total, discount, credit: previousCredit } = previousPayment.invoice;

  const { amount: currentAmount } = req.body;

  const changedAmount = calculate.sub(currentAmount, previousAmount);
  const maxAmount = calculate.sub(total, calculate.add(discount, previousCredit));

  if (changedAmount > maxAmount) {
    return res.status(202).json({
      success: false,
      result: null,
      message: `The Max Amount you can add is ${maxAmount + previousAmount}`,
      error: `The Max Amount you can add is ${maxAmount + previousAmount}`,
    });
  }

  let paymentStatus =
    calculate.sub(total, discount) === calculate.add(previousCredit, changedAmount)
      ? 'paid'
      : calculate.add(previousCredit, changedAmount) > 0
        ? 'partially'
        : 'unpaid';

  const updates = {
    number: req.body.number,
    date: req.body.date,
    amount: req.body.amount,
    paymentMode: req.body.paymentMode,
    ref: req.body.ref,
    description: req.body.description,
    approvalStatus: 'pending',
    updated: updatedDate,
  };

  const result = await Model.findOneAndUpdate(
    { _id: req.params.id, removed: false },
    { $set: updates },
    {
      new: true, // return the new result instead of the old one
    }
  ).exec();

  // Create approval request for the update
  const Approval = mongoose.model('Approval');
  await new Approval({
    entityType: 'Payment',
    entityId: result._id,
    requestedBy: req.admin._id,
    approvalType: 'finance_approval',
    priority: result.amount > 10000 ? 'high' : 'medium',
    metadata: {
      amount: result.amount,
      previousAmount: previousAmount,
      invoiceId: result.invoice._id,
      note: 'Payment update requires re-approval',
    },
    removed: false,
  }).save();

  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully updated the Payment. Pending Finance re-approval. Invoice will be updated after approval.',
  });
};

module.exports = update;

const mongoose = require('mongoose');

const Model = mongoose.model('PurchaseOrder');

const summary = async (req, res) => {
  const result = await Model.aggregate([
    {
      $match: {
        removed: false,
      },
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        total: { $sum: '$total' },
      },
    },
    {
      $project: {
        _id: 0,
        count: 1,
        total: 1,
      },
    },
  ]);

  return res.status(200).json({
    success: true,
    result: result.length > 0 ? result[0] : { count: 0, total: 0 },
    message: 'Successfully fetched purchase order summary (outcome).',
  });
};

module.exports = summary;

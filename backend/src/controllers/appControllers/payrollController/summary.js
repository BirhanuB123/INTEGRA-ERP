const mongoose = require('mongoose');

const Model = mongoose.model('Payroll');

const summary = async (req, res) => {
  const result = await Model.aggregate([
    { $match: { removed: false } },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        total: { $sum: '$totalNetPay' },
        totalGross: { $sum: '$totalGrossSalary' },
        totalPensionCompany: { $sum: '$totalPensionCompany' },
      },
    },
    { $project: { _id: 0, count: 1, total: 1, totalGross: 1, totalPensionCompany: 1 } },
  ]);

  const data = result.length > 0 ? result[0] : { count: 0, total: 0, totalGross: 0, totalPensionCompany: 0 };
  return res.status(200).json({
    success: true,
    result: data,
    message: 'Successfully fetched payroll summary.',
  });
};

module.exports = summary;

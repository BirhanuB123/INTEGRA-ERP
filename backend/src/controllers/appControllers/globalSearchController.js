const mongoose = require('mongoose');

const searchEntityString = async (Model, query, fields, entityName, labelFields) => {
  const filter = {
    $or: fields.map((field) => ({ [field]: { $regex: new RegExp(escapeRegex(query), 'i') } })),
    removed: false,
  };

  const results = await Model.find(filter).limit(5).lean().exec();

  return results.map((item) => ({
    _id: item._id,
    entity: entityName,
    label: labelFields.map((f) => (item[f] != null ? String(item[f]) : '')).join(' ').trim(),
    sublabel: entityName.charAt(0).toUpperCase() + entityName.slice(1),
  }));
};

const searchEntityNumber = async (Model, query, numberField, entityName, labelFields) => {
  const safeQuery = escapeRegex(query);
  const filter = {
    removed: false,
    $expr: { $regexMatch: { input: { $toString: `$${numberField}` }, regex: safeQuery, options: 'i' } },
  };

  const results = await Model.find(filter).limit(5).lean().exec();

  return results.map((item) => ({
    _id: item._id,
    entity: entityName,
    label: labelFields.map((f) => (item[f] != null ? String(item[f]) : '')).join(' ').trim(),
    sublabel: entityName.charAt(0).toUpperCase() + entityName.slice(1),
  }));
};

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

exports.search = async (req, res) => {
  const query = req.query.q;
  if (!query || typeof query !== 'string' || query.trim() === '') {
    return res.status(200).json({ success: true, result: [] });
  }

  const q = query.trim();
  const Client = mongoose.model('Client');
  const Invoice = mongoose.model('Invoice');
  const Quote = mongoose.model('Quote');
  const Product = mongoose.model('Product');
  const Employee = mongoose.model('Employee');
  const Payment = mongoose.model('Payment');

  try {
    const [clients, invoices, quotes, products, employees, payments] = await Promise.all([
      searchEntityString(Client, q, ['name', 'phone', 'email', 'address'], 'client', ['name']),
      searchEntityNumber(Invoice, q, 'number', 'invoice', ['number']),
      searchEntityNumber(Quote, q, 'number', 'quote', ['number']),
      searchEntityString(Product, q, ['name', 'description'], 'product', ['name']),
      searchEntityString(Employee, q, ['name', 'surname', 'email'], 'employee', ['name', 'surname']),
      searchEntityNumber(Payment, q, 'number', 'payment', ['number']),
    ]);

    const allResults = [
      ...clients,
      ...invoices,
      ...quotes,
      ...products,
      ...employees,
      ...payments,
    ];

    return res.status(200).json({
      success: true,
      result: allResults,
      message: 'Successfully found matches',
    });
  } catch (error) {
    console.error('Global search error:', error.message);
    return res.status(500).json({
      success: false,
      result: [],
      message: 'Error during global search',
      error: error.message,
    });
  }
};

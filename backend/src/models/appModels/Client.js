const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },

  name: {
    type: String,
    required: true,
  },
  phone: String,
  country: String,
  address: String,
  email: String,
  type: {
    type: String,
    enum: ['lead', 'customer'],
    default: 'customer',
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on hold'],
    default: 'active',
  },
  leadStage: {
    type: String,
    enum: ['new', 'contacted', 'proposal', 'won', 'lost'],
    default: 'new',
  },
  creditLimit: {
    type: Number,
    default: 0,
  },
  creditHold: {
    type: Boolean,
    default: false,
  },
  notes: [
    {
      title: String,
      content: String,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  assigned: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Client', schema);

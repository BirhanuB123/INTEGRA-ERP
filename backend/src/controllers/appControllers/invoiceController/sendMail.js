const mongoose = require('mongoose');
const { Resend } = require('resend');
const { SendInvoice } = require('@/emailTemplate/SendEmailTemplate');

const mail = async (req, res) => {
  try {
    const { id } = req.body;
    const Invoice = mongoose.model('Invoice');
    const result = await Invoice.findById(id).populate('client');

    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No invoice found',
      });
    }

    const { client } = result;
    const resend = new Resend(process.env.RESEND_API);

    // Using the requested email address
    const targetEmail = 'info@gebetatech.com';

    await resend.emails.send({
      from: process.env.IDURAR_APP_EMAIL || 'onboarding@resend.dev',
      to: targetEmail,
      subject: `Invoice from Integra ERP`,
      html: SendInvoice({
        title: 'Invoice Overview',
        name: client.name,
      }),
    });

    return res.status(200).json({
      success: true,
      result: null,
      message: `Invoice sent successfully to ${targetEmail}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
    });
  }
};

module.exports = mail;

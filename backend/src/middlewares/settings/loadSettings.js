const listAllSettings = require('./listAllSettings');

const INTEGRA_BRANDING = {
  company_name: 'INTEGRA ERP',
  company_logo: 'public/uploads/setting/integra-erp-logo.svg',
  company_icon: 'public/uploads/setting/integra-erp-logo.svg',
  company_address: 'Addis Ababa, Ethiopia',
  company_reg_number: '',
  default_currency_code: 'ETB',
  currency_name: 'Ethiopian Birr',
  currency_symbol: 'ETB',
};

const loadSettings = async () => {
  const allSettings = {};
  const datas = await listAllSettings();
  datas.forEach(({ settingKey, settingValue }) => {
    allSettings[settingKey] = settingValue;
  });

  const needsUpdate =
    allSettings.company_name === 'COMPANY Name' ||
    allSettings.currency_symbol === '$' ||
    (allSettings.default_currency_code && allSettings.default_currency_code.toUpperCase() === 'USD');

  if (needsUpdate) {
    Object.assign(allSettings, INTEGRA_BRANDING);
    try {
      const Setting = require('mongoose').model('Setting');
      if (Setting) {
        for (const [key, value] of Object.entries(INTEGRA_BRANDING)) {
          await Setting.findOneAndUpdate(
            { settingKey: key, removed: false },
            { settingValue: value },
            { new: true }
          );
        }
      }
    } catch (err) {
      // ignore migration errors; allSettings already has correct values
    }
  }

  return allSettings;
};

module.exports = loadSettings;

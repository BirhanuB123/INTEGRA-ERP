require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const Setting = require('./models/coreModels/Setting');

mongoose.connect(process.env.DATABASE);

async function updateBranding() {
  try {
    const updates = [
      { key: 'company_name', value: 'Integra-ERP' },
      { key: 'company_logo', value: 'public/uploads/setting/integra-erp-logo.svg' },
      { key: 'company_icon', value: 'public/uploads/setting/integra-erp-logo.svg' },
      { key: 'default_currency_code', value: 'ETB' },
      { key: 'currency_name', value: 'Ethiopian Birr' },
      { key: 'currency_symbol', value: 'ETB' }
    ];

    for (const update of updates) {
      const result = await Setting.findOneAndUpdate(
        { settingKey: update.key },
        { settingValue: update.value },
        { new: true }
      );
      if (result) {
        console.log(`✅ Updated ${update.key} to ${update.value}`);
      } else {
        console.log(`⚠️ Setting ${update.key} not found`);
      }
    }

    console.log('🥳 Branding and Currency update completed!');
    process.exit();
  } catch (e) {
    console.log('\n🚫 Error during branding update');
    console.log(e);
    process.exit(1);
  }
}

updateBranding();

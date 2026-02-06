export const fields = {
  name: {
    type: 'string',
    required: true,
  },
  type: {
    type: 'selectWithTranslation',
    renderAsTag: true,
    options: [
      { value: 'customer', label: 'Customer', color: 'blue' },
      { value: 'lead', label: 'Lead', color: 'purple' },
    ],
    defaultValue: 'customer',
  },
  status: {
    type: 'selectWithTranslation',
    renderAsTag: true,
    options: [
      { value: 'active', label: 'active', color: 'green' },
      { value: 'inactive', label: 'inactive', color: 'red' },
      { value: 'on hold', label: 'on hold', color: 'orange' },
    ],
    defaultValue: 'active',
  },
  leadStage: {
    type: 'selectWithTranslation',
    renderAsTag: true,
    options: [
      { value: 'new', label: 'new', color: 'cyan' },
      { value: 'contacted', label: 'contacted', color: 'blue' },
      { value: 'proposal', label: 'proposal', color: 'gold' },
      { value: 'won', label: 'won', color: 'green' },
      { value: 'lost', label: 'lost', color: 'magenta' },
    ],
    defaultValue: 'new',
  },
  country: {
    type: 'country',
  },
  address: {
    type: 'string',
    disableForTable: true,
  },
  phone: {
    type: 'phone',
  },
  email: {
    type: 'email',
  },
  creditLimit: {
    type: 'currency',
    disableForTable: true,
  },
  creditHold: {
    type: 'boolean',
    disableForTable: true,
  },
};

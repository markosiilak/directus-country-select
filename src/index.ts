import { defineInterface } from '@directus/extensions-sdk';

import InterfaceComponent from './interface.vue';

export default defineInterface({
  id: 'country-selector',
  name: 'Country Selector',
  icon: 'flag',
  description: 'Select a country from a dropdown list',
  component: InterfaceComponent,
  types: ['json', 'string'],
  group: 'standard',
  options: null,
  recommendedDisplays: ['raw']
});

import harmony from '@beskar-labs/harmony';

harmony.forEach((config) => {
  config.rules['no-console'] = 'off';
});

export default harmony;

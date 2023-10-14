import harmony from 'eslint-config-harmony';

harmony.forEach((config) => {
  config.rules['no-console'] = 'off';
});

export default harmony;

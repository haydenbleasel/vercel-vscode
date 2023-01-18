import harmony from '@beskar-labs/harmony';

harmony[0].rules['no-console'] = 'off';
harmony[0].rules['import/no-nodejs-modules'] = 'off';
harmony[0].rules['jest/require-hook'] = 'off';

export default harmony;

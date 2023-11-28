/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from 'fs';
import yaml from 'js-yaml';

const YAML_CONFIG_PROD = 'production.yaml';
const YAML_CONFIG_DEV = 'config.yaml';

export const serverConfig = (): Record<string, any> => {
  const configs = [`./config/common.yaml`];

  const mergedConfig = configs.reduce((acc, currPath) => {
    try {
      const fileContent = fs.readFileSync(currPath, 'utf8');
      const yamlContent = yaml.load(fileContent) as Record<string, any>;
      return { ...acc, ...yamlContent };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }, {});

  return mergedConfig as Record<string, any>;
};

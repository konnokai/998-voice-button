// vuetify.config.ts
import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration';

import theme from './theme.json';

const generateThemeFromJson = (json: any) => {
  const output: any = {};
  Object.keys(json).forEach((key) => {
    output[key] = json[key].DEFAULT;
    Object.keys(json[key]).forEach((subKey) => {
      output[`${key}-${subKey}`] = json[key][subKey];
    });
  });
  return output;
};

export default defineVuetifyConfiguration({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: generateThemeFromJson(theme)
      }
    }
  }
});

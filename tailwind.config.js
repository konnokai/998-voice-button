import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */

import theme from './theme.json';

export default {
  theme: {
    extend: {
      colors: {
        ...colors,
        neutral: theme.neutral,
        secondary: theme.secondary,
        primary: theme.primary
      }
    }
  }
};

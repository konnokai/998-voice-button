export const state = () => ({
  locales: ['zh'],
  locale: 'zh',
  dark: false
});

export const mutations = {
  SET_DARK(state, dark) {
    state.dark = dark;
    localStorage.setItem('dark', state.dark);
  }
};

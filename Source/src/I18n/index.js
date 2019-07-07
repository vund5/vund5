import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';
import { AsyncStorage, Alert } from 'react-native';

import vi from './vi.json';
import en from './en.json';

const STORAGE_KEY = '@APP:languageCode';
AsyncStorage.getItem(STORAGE_KEY, (err, key) => {
  if (key != null) {
    i18n.changeLanguage(key);
  }
}).done();

i18n
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'vi',
    resources: { vi, en},

    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it does escape per default to prevent xss!
    }
});

export default i18n;

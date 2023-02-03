import { createI18n } from 'vue-i18n';
import ptBR from '@/locales/pt-BR';

const messages = {
  'pt-BR': ptBR,
};

const i18n = createI18n({
  legacy: false,
  locale: 'pt-BR',
  fallbackLocale: 'pt-BR',
  messages,
  missing: (lang: any, key: string) => key,
});

export const { t } = i18n.global;

export default i18n;

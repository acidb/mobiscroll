// Русский (UA)

import { extend } from '../core/util/misc';
import { MbscLocale } from './locale';
import ru from './ru';

const ruUA: MbscLocale = {
  // Core
  cancelText: 'Отменить',
  clearText: 'Очиститьr',
  selectedText: '{count} Вібрать',
  // Datetime component
  monthNamesShort: ['Янв.', 'Февр.', 'Март', 'Апр.', 'Май', 'Июнь', 'Июль', 'Авг.', 'Сент.', 'Окт.', 'Нояб.', 'Дек.'],
  // Select component
  filterEmptyText: 'Ніякага выніку',
  filterPlaceholderText: 'Пошук',
};

export default /*#__PURE__*/ extend(ru, ruUA);

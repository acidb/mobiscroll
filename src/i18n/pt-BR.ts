// Português Brasileiro

import { extend } from '../core/util/misc';
import { MbscLocale } from './locale';
import ptPT from './pt-PT';

const ptBR: MbscLocale = {
  // Core
  setText: 'Selecionar',
  // Datetime component
  dateFormat: 'DD/MM/YYYY',
  nowText: 'Agora',
  // Calendar component
  allDayText: 'Dia inteiro',
  // Select component
  filterPlaceholderText: 'Buscar',
};

export default /*#__PURE__*/ extend(ptPT, ptBR);

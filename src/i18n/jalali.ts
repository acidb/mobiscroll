// فارسی

import { MbscCalendarSystem } from '../core/commons';
import { floor } from '../core/util/misc';

const gDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const jDaysInMonth = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

function jalaliToGregorian(jY: number, jM: number, jD: number) {
  let i: number;
  const jy = jY - 979;
  const jm = jM - 1;
  const jd = jD - 1;
  let jDayNo = 365 * jy + floor(jy / 33) * 8 + floor(((jy % 33) + 3) / 4);

  for (i = 0; i < jm; ++i) {
    jDayNo += jDaysInMonth[i];
  }

  jDayNo += jd;

  let gDayNo = jDayNo + 79;

  let gy = 1600 + 400 * floor(gDayNo / 146097);
  gDayNo = gDayNo % 146097;

  let leap = true;
  if (gDayNo >= 36525) {
    gDayNo--;
    gy += 100 * floor(gDayNo / 36524);
    gDayNo = gDayNo % 36524;

    if (gDayNo >= 365) {
      gDayNo++;
    } else {
      leap = false;
    }
  }

  gy += 4 * floor(gDayNo / 1461);
  gDayNo %= 1461;

  if (gDayNo >= 366) {
    leap = false;
    gDayNo--;
    gy += floor(gDayNo / 365);
    gDayNo = gDayNo % 365;
  }

  for (i = 0; gDayNo >= gDaysInMonth[i] + (i === 1 && leap ? 1 : 0); i++) {
    gDayNo -= gDaysInMonth[i] + (i === 1 && leap ? 1 : 0);
  }

  const gm = i + 1;
  const gd = gDayNo + 1;

  return [gy, gm, gd];
}

function checkDate(jY: number, jM: number, jD: number) {
  return !(
    jY < 0 ||
    jY > 32767 ||
    jM < 1 ||
    jM > 12 ||
    jD < 1 ||
    jD > jDaysInMonth[jM - 1] + (jM === 12 && ((jY - 979) % 33) % 4 === 0 ? 1 : 0)
  );
}

function gregorianToJalali(gY: number, gM: number, gD: number) {
  let i: number;
  const gy = gY - 1600;
  const gm = gM - 1;
  const gd = gD - 1;

  let gDayNo = 365 * gy + floor((gy + 3) / 4) - floor((gy + 99) / 100) + floor((gy + 399) / 400);

  for (i = 0; i < gm; ++i) {
    gDayNo += gDaysInMonth[i];
  }

  if (gm > 1 && ((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0)) {
    ++gDayNo;
  }

  gDayNo += gd;

  let jDayNo = gDayNo - 79;

  const jNp = floor(jDayNo / 12053);
  jDayNo %= 12053;

  let jy = 979 + 33 * jNp + 4 * floor(jDayNo / 1461);

  jDayNo %= 1461;

  if (jDayNo >= 366) {
    jy += floor((jDayNo - 1) / 365);
    jDayNo = (jDayNo - 1) % 365;
  }

  for (i = 0; i < 11 && jDayNo >= jDaysInMonth[i]; ++i) {
    jDayNo -= jDaysInMonth[i];
  }

  const jm = i + 1;
  const jd = jDayNo + 1;

  return [jy, jm, jd];
}

/** @hidden */
export const jalaliCalendar: MbscCalendarSystem = {
  getYear(date) {
    return gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate())[0];
  },
  getMonth(date) {
    return --gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate())[1];
  },
  getDay(date) {
    return gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate())[2];
  },
  getDate(y, m, d, h, i, s, u) {
    if (m < 0) {
      y += floor(m / 12);
      m = m % 12 ? 12 + (m % 12) : 0;
    }
    if (m > 11) {
      y += floor(m / 12);
      m = m % 12;
    }

    const gregorianDate = jalaliToGregorian(y, +m + 1, d);

    return new Date(gregorianDate[0], gregorianDate[1] - 1, gregorianDate[2], h || 0, i || 0, s || 0, u || 0);
  },
  getMaxDayOfMonth(y, m) {
    let maxdays = 31;
    if (m < 0) {
      y += floor(m / 12);
      m = m % 12 ? 12 + (m % 12) : 0;
    }
    if (m > 11) {
      y += floor(m / 12);
      m = m % 12;
    }
    while (!checkDate(y, m + 1, maxdays) && maxdays > 29) {
      maxdays--;
    }
    return maxdays;
  },
};

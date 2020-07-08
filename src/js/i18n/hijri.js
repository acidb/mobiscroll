// Arabic

import { calendars } from "../core/mobiscroll";

function intPart(floatNum) {
    if (floatNum < -0.0000001) {
        return Math.ceil(floatNum - 0.0000001);
    }
    return Math.floor(floatNum + 0.0000001);
}

function hijriToGregorian(hY, hM, hD) {
    hY = parseInt(hY);
    hM = parseInt(hM);
    hD = parseInt(hD);

    var jd, l, j, n, i, k,
        gregDate = new Array(3);

    jd = intPart((11 * hY + 3) / 30) + 354 * hY + 30 * hM - intPart((hM - 1) / 2) + hD + 1948440 - 385;

    if (jd > 2299160) {
        l = jd + 68569;
        n = intPart((4 * l) / 146097);
        l = l - intPart((146097 * n + 3) / 4);
        i = intPart((4000 * (l + 1)) / 1461001);
        l = l - intPart((1461 * i) / 4) + 31;
        j = intPart((80 * l) / 2447);
        hD = l - intPart((2447 * j) / 80);
        l = intPart(j / 11);
        hM = j + 2 - 12 * l;
        hY = 100 * (n - 49) + i + l;
    } else {
        j = jd + 1402;
        k = intPart((j - 1) / 1461);
        l = j - 1461 * k;
        n = intPart((l - 1) / 365) - intPart(l / 1461);
        i = l - 365 * n + 30;
        j = intPart((80 * i) / 2447);
        hD = i - intPart((2447 * j) / 80);
        i = intPart(j / 11);
        hM = j + 2 - 12 * i;
        hY = 4 * k + n + i - 4716;
    }

    gregDate[2] = hD;
    gregDate[1] = hM;
    gregDate[0] = hY;

    return gregDate;
}

function gregorianToHijri(gY, gM, gD) {
    gY = parseInt(gY);
    gM = parseInt(gM);
    gD = parseInt(gD);

    var jd, l, j, n,
        hijriDate = new Array(0, 0, 0);

    if ((gY > 1582) || ((gY == 1582) && (gM > 10)) || ((gY == 1582) && (gM == 10) && (gD > 14))) {
        jd = intPart((1461 * (gY + 4800 + intPart((gM - 14) / 12))) / 4) + intPart((367 * (gM - 2 - 12 * (intPart((gM - 14) / 12)))) / 12) -
            intPart((3 * (intPart((gY + 4900 + intPart((gM - 14) / 12)) / 100))) / 4) + gD - 32075;
    } else {
        jd = 367 * gY - intPart((7 * (gY + 5001 + intPart((gM - 9) / 7))) / 4) + intPart((275 * gM) / 9) + gD + 1729777;
    }

    l = jd - 1948440 + 10632;
    n = intPart((l - 1) / 10631);
    l = l - 10631 * n + 354;
    j = (intPart((10985 - l) / 5316)) * (intPart((50 * l) / 17719)) + (intPart(l / 5670)) * (intPart((43 * l) / 15238));
    l = l - (intPart((30 - j) / 15)) * (intPart((17719 * j) / 50)) - (intPart(j / 16)) * (intPart((15238 * j) / 43)) + 29;
    gM = intPart((24 * l) / 709);
    gD = l - intPart((709 * gM) / 24);
    gY = 30 * n + j - 30;

    hijriDate[2] = gD;
    hijriDate[1] = gM;
    hijriDate[0] = gY;

    return hijriDate;
}

calendars.hijri = {
    getYear: function (date) {
        return gregorianToHijri(date.getFullYear(), (date.getMonth() + 1), date.getDate())[0];
    },
    getMonth: function (date) {
        return --gregorianToHijri(date.getFullYear(), (date.getMonth() + 1), date.getDate())[1];
    },
    getDay: function (date) {
        return gregorianToHijri(date.getFullYear(), (date.getMonth() + 1), date.getDate())[2];
    },
    getDate: function (y, m, d, h, i, s, u) {
        if (m < 0) {
            y += Math.floor(m / 12);
            m = m % 12 ? 12 + m % 12 : 0;
        }
        if (m > 11) {
            y += Math.floor(m / 12);
            m = m % 12;
        }

        var gregorianDate = hijriToGregorian(y, +m + 1, d);

        return new Date(gregorianDate[0], gregorianDate[1] - 1, gregorianDate[2], h || 0, i || 0, s || 0, u || 0);
    },
    getMaxDayOfMonth: function (hY, hM) {
        if (hM < 0) {
            hY += Math.floor(hM / 12);
            hM = hM % 12 ? 12 + hM % 12 : 0;
        }
        if (hM > 11) {
            hY += Math.floor(hM / 12);
            hM = hM % 12;
        }

        var daysPerMonth = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29],
            leapYear = (hY * 11 + 14) % 30 < 11;

        return daysPerMonth[hM] + (hM === 11 && leapYear ? 1 : 0);
    }
};

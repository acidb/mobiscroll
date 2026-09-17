// Thai

import { MbscLocale } from './locale';

const th: MbscLocale = {
  // Core
  setText: 'ตั้งค่า',
  cancelText: 'ยกเลิก',
  clearText: 'ล้าง',
  closeText: 'ปิด',
  selectedText: '{count} เลือก',
  // Datetime component
  dateFormat: 'DD/MM/YYYY',
  dateFormatFull: 'วันDDDDที่ D MMMM YYYY',
  dateFormatLong: 'วันDDDที่ D MMM YYYY',
  dateWheelFormat: '|DDD D MMM|',
  dayNames: ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'],
  dayNamesShort: ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
  dayNamesMin: ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
  dayText: 'วัน',
  hourText: 'ชั่วโมง',
  minuteText: 'นาที',
  fromText: 'จาก',
  monthNames: [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม',
  ],
  monthNamesShort: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
  monthText: 'เดือน',
  secondText: 'วินาที',
  timeFormat: 'HH:mm',
  yearText: 'ปี',
  toText: 'ถึง',
  nowText: 'ตอนนี้',
  pmText: 'pm',
  amText: 'am',
  // Calendar component
  firstDay: 0,
  dateText: 'วัน',
  timeText: 'เวลา',
  todayText: 'วันนี้',
  eventText: 'เหตุการณ์',
  eventsText: 'เหตุการณ์',
  allDayText: 'ตลอดวัน',
  noEventsText: 'ไม่มีกิจกรรม',
  moreEventsText: 'อีก {count} กิจกรรม',
  weekText: 'สัปดาห์ที่ {count}',
  // Daterange component
  rangeStartLabel: 'จาก',
  rangeEndLabel: 'ถึง',
  rangeStartHelp: 'เลือก',
  rangeEndHelp: 'เลือก',
  // Select component
  filterEmptyText: 'ไม่มีผลลัพธ์',
  filterPlaceholderText: 'ค้นหา',
};

export default th;

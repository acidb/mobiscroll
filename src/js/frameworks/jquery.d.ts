import { Card, MbscCardOptions } from '../classes/cards';
export { Card, MbscCardOptions };
import { Calendar, MbscCalendarOptions } from '../presets/calendar';
export { Calendar, MbscCalendarOptions };
import { Color, MbscColorOptions } from '../classes/color';
export { Color, MbscColorOptions };
import { MbscDatetimeOptions } from '../presets/datetimebase';
import { DateTime } from '../presets/datetime';
export { DateTime, MbscDatetimeOptions };
import { Eventcalendar, MbscEventcalendarOptions } from '../presets/eventcalendar';
export { Eventcalendar, MbscEventcalendarOptions };
import { Form, MbscFormOptions } from '../classes/forms';
export { Form, MbscFormOptions };
import { Page, MbscPageOptions } from '../classes/page';
export { Page, MbscPageOptions };
import { ImageScroller, MbscImageOptions } from '../presets/image';
export { ImageScroller, MbscImageOptions };
import { ListView, MbscListviewOptions } from '../classes/listview';
export { ListView, MbscListviewOptions };
import { Optionlist, MbscOptionlistOptions } from '../classes/optionlist';
export { Optionlist, MbscOptionlistOptions };
import { Measurement, MbscMeasurementOptions } from '../presets/measurement';
import { Mass, MbscMassOptions } from '../presets/mass';
import { Distance, MbscDistanceOptions } from '../presets/distance';
import { Force, MbscForceOptions } from '../presets/force';
import { Speed, MbscSpeedOptions } from '../presets/speed';
import { Temperature, MbscTemperatureOptions } from '../presets/temperature';
export { Measurement, Mass, Distance, Force, Speed, Temperature, MbscMeasurementOptions, MbscMassOptions, MbscForceOptions, MbscSpeedOptions, MbscTemperatureOptions, MbscDistanceOptions };
import { Navigation, MbscNavOptions } from '../classes/navigation';
export { Navigation, MbscNavOptions };
import { NumberScroller, MbscNumberOptions } from '../presets/number';
export { NumberScroller, MbscNumberOptions };
import { Numpad, MbscNumpadOptions } from '../classes/numpad';
export { Numpad, MbscNumpadOptions };
import { RangePicker, MbscRangeOptions } from '../presets/range';
export { RangePicker, MbscRangeOptions };
import { Scroller, MbscScrollerOptions } from '../classes/scroller';
export { Scroller, MbscScrollerOptions };
import { ScrollView, MbscScrollViewOptions } from '../classes/scrollview';
export { ScrollView, MbscScrollViewOptions };
import { Select, MbscSelectOptions } from '../presets/select';
export { Select, MbscSelectOptions };
import { Timer, MbscTimerOptions } from '../presets/timer';
export { Timer, MbscTimerOptions };
import { Timespan, MbscTimespanOptions } from '../presets/timespan';
export { Timespan, MbscTimespanOptions };
import { Treelist, MbscTreelistOptions } from '../presets/treelist';
export { Treelist, MbscTreelistOptions };
import { Popup, MbscPopupOptions } from '../classes/popup';
export { Popup, MbscPopupOptions };
import { Widget, MbscWidgetOptions } from '../classes/popup';
export { Widget, MbscWidgetOptions };

export { IMobiscroll } from '../core/core';
export { mobiscroll as default } from '../core/core';

declare global {
    interface MobiscrollBundle {
        [index: number]: JQuery;
        card(options?: MbscCardOptions): JQuery;
        calendar(options?: MbscCalendarOptions): JQuery;
        color(options?: MbscColorOptions): JQuery;
        datetime(options?: MbscDatetimeOptions): JQuery;
        date(options?: MbscDatetimeOptions): JQuery;
        time(options?: MbscDatetimeOptions): JQuery;
        eventcalendar(options?: MbscEventcalendarOptions): JQuery;
        form(options?: MbscFormOptions): JQuery;
        page(options?: MbscPageOptions): JQuery;
        image(options?: MbscImageOptions): JQuery;
        listview(options?: MbscListviewOptions): JQuery;
        optionlist(options?: MbscOptionlistOptions): JQuery;
        measurement(options?: MbscMeasurementOptions): JQuery;
        mass(options?: MbscMassOptions): JQuery;
        distance(options?: MbscDistanceOptions): JQuery;
        force(options?: MbscForceOptions): JQuery;
        speed(options?: MbscSpeedOptions): JQuery;
        temperature(options?: MbscTemperatureOptions): JQuery;
        nav(options?: MbscNavOptions): JQuery;
        number(options?: MbscNumberOptions): JQuery;
        numpad(options?: MbscNumpadOptions): JQuery;
        range(options?: MbscRangeOptions): JQuery;
        scroller(options?: MbscScrollerOptions): JQuery;
        scrollview(options?: MbscScrollViewOptions): JQuery;
        select(options?: MbscSelectOptions): JQuery;
        timer(options?: MbscTimerOptions): JQuery;
        timespan(options?: MbscTimespanOptions): JQuery;
        treelist(options?: MbscTreelistOptions): JQuery;
        popup(options?: MbscPopupOptions): JQuery;
        widget(options?: MbscWidgetOptions): JQuery;
    }

    interface JQuery {
        mobiscroll(): MobiscrollBundle;
        mobiscroll(option: string): any;
    }
}





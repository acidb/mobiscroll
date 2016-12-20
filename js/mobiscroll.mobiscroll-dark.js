(function () {

    var $ = mobiscroll.$;

    mobiscroll.themes.frame['mobiscroll-dark'] = {
        baseTheme: 'mobiscroll',
        headerText: false,
        btnWidth: false
    };

    mobiscroll.themes.scroller['mobiscroll-dark'] = $.extend({}, mobiscroll.themes.frame['mobiscroll-dark'], {
        rows: 5,
        showLabel: false,
        selectedLineBorder: 1,
        weekDays: 'min',
        checkIcon: 'ion-ios7-checkmark-empty',
        btnPlusClass: 'mbsc-ic mbsc-ic-arrow-down5',
        btnMinusClass: 'mbsc-ic mbsc-ic-arrow-up5',
        btnCalPrevClass: 'mbsc-ic mbsc-ic-arrow-left5',
        btnCalNextClass: 'mbsc-ic mbsc-ic-arrow-right5'
    });
    
    mobiscroll.themes.listview['mobiscroll-dark'] = {
        baseTheme: 'mobiscroll'
    };

    mobiscroll.themes.menustrip['mobiscroll-dark'] = {
        baseTheme: 'mobiscroll'
    };

    mobiscroll.themes.form['mobiscroll-dark'] = {
        baseTheme: 'mobiscroll'
    };

    mobiscroll.themes.progress['mobiscroll-dark'] = {
        baseTheme: 'mobiscroll'
    };

})();

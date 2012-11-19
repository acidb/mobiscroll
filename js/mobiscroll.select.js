(function ($) {

    var defaults = {
        inputClass: '',
        invalid: [],
        rtl: false,
        group: false,
        groupLabel: 'Groups'
    };

    $.scroller.presets.select = function (inst) {
        var s = $.extend({}, defaults, inst.settings),
            elm = $(this),
            option = elm.val(),
            group = elm.find('option[value="' + elm.val() + '"]').parent(),
            prev = group.index() + '',
            prevent,
            id = this.id + '_dummy',
            l1 = $('label[for="' + this.id + '"]').attr('for', id),
            l2 = $('label[for="' + id + '"]'),
            label = s.label !== undefined ? s.label : (l2.length ? l2.text() : elm.attr('name')),
            invalid = [],
            main = {},
            wIndex = {}, // wheel index container
            shTime,
            roPre = inst.settings.readonly,
            w;

        // if groups is true and there are no groups fall back to no grouping
        if (s.group && !$('optgroup', elm).length)
            s.group = false;

        if (!s.invalid.length)
            s.invalid = invalid;

        if (s.group){
            if(s.rtl) {
                wIndex.groups = 1;
                wIndex.options = 0;
            } else {
                wIndex.groups = 0;
                wIndex.options = 1;
            }
        }
        else {
            wIndex.groups = -1;
            wIndex.options = 0;
        }

        $('#' + id).remove();

        $('option', elm).each(function () {
            main[$(this).attr('value')] = $(this).text();
        });

        var input = $('<input type="text" id="' + id + '" value="' + main[elm.val()] + '" class="' + s.inputClass + '" readonly />').insertBefore(elm);
        inst.settings.anchor = input; // give the core the input element for the bubble positioning

        if (s.showOnFocus)
            input.focus(function () {inst.show()});

        elm.bind('change', function () {
            if (!prevent && option != elm.val()) {
                inst.setSelectVal([elm.val()], true);
            }
            prevent = false;
        }).hide().closest('.ui-field-contain').trigger('create');

        inst.setSelectVal = function (d, fill, time) {
            option = d[0];

            if (s.group){
                group = elm.find('option[value="' + option + '"]').parent();
                inst.temp = (s.rtl) ? ['_' + option, '_' + group.index()] : ['_' + group.index(), '_' + option];
            }
            else
                inst.temp = ['_' + option];

            inst.setValue(true, fill, time);

            // Set input/select values
            if (fill) {
                input.val(main[option]);
                var changed = option !== elm.val();
                elm.val(option);
                // Trigger change on element
                if (changed)
                    elm.trigger('change');
            }
        };

        inst.getSelectVal = function (temp) {
            var val = temp ? inst.temp : inst.values;
            return replace(val[wIndex.options]);
        };

        return {
            width: 200,
            wheels: w,
            headerText: false,
            formatResult: function (d) {
                return main[option];
            },
            parseValue: function () {
                option = elm.val();
                group = elm.find('option[value="' + option + '"]').parent();
                return (s.group&&s.rtl)? ['_' + option, '_' + group.index()] :s.group ? ['_' + group.index(), '_' + option] : ['_' + option];
            },
            validate: function (dw, index, time) {
                if (index === wIndex.groups) {
                    var gr = replace(inst.temp[wIndex.groups]);

                    if (gr !== prev) {
                        inst.settings.readonly = [s.rtl, !s.rtl];
                        group = elm.find('optgroup').eq(gr);
                        option = group.find('option').eq(0).val();
                        option = option ? option : elm.val();

                        clearTimeout(shTime);
                        shTime = setTimeout(function () {
                            inst.settings.wheels = genWheels();
                            if (s.group){
                                if (s.rtl)
                                    inst.temp = ['_' + option, '_' + group.index()];
                                else
                                    inst.temp = ['_' + group.index(), '_' + option];
                                inst.changeWheel(wIndex.options);
                                prev = group.index() + '';
                            }
                            inst.settings.readonly = roPre;
                        }, time * 1000);
                    }
                    else
                        inst.settings.readonly = roPre;
                }
                else {
                    option = replace(inst.temp[wIndex.options]);
                }

                $.each(s.invalid, function (i, v) {
                    $('li[data-val="_' + v + '"]', dw).removeClass('dw-v');
                });
            },
            onShow:function(dw){
                $('.dwwl'+wIndex.groups, dw).bind('mousedown touchstart', function (e) {
                    clearTimeout(shTime);
                });
            },
            onBeforeShow: function () {
                inst.settings.wheels = genWheels();
                if (s.group)
                    inst.temp = (s.rtl) ? ['_' + option, '_' + group.index()] : ['_' + group.index(), '_' + option];
            },
            onSelect: function (v, inst) {
                input.val(v);
                prevent = true;
                elm.val(option).trigger('change');
                if (s.group)
                    inst.values = null;
            },
            onCancel: function () {
                if (s.group)
                    inst.values = null;
            },
            onChange: function (v, inst) {
                if (s.display == 'inline') {
                    input.val(v);
                    prevent = true;
                    elm.val(replace(inst.temp[wIndex.options])).trigger('change');
                }
            },
            onClose: function () {
                input.blur();
            },
            methods: {
                setValue: function (d, fill, time) {
                    return this.each(function () {
                        var inst = $(this).scroller('getInst');
                        if (inst) {
                            if (inst.setSelectVal) {
                                inst.setSelectVal(d, fill, time);
                            }
                            else {
                                inst.temp = d;
                                inst.setValue(true, fill, time);
                            }
                        }
                    });
                },
                getValue: function (temp) {
                    var inst = $(this).scroller('getInst');
                    if (inst) {
                        if (inst.getSelectVal) {
                            return inst.getSelectVal(temp);
                        }
                        else {
                            return inst.values;
                        }
                    }
                }
            }
        };

        function replace(str) {
            if (str) {
                return str.replace(/_/, '');
            }
            return '';
        }

        function genWheels() {
            var cont,
                wg = 0,
                w = [{}];

            if (s.group) {
                if (s.rtl)
                    wg = 1;
                var wheel = {};
                $('optgroup', elm).each(function (index) {
                    wheel['_' + index] = $(this).attr('label');
                });
                w[wg]={};
                w[wg][s.groupLabel] = wheel;
                cont = group;
                if (s.rtl)
                    wg--;
                else
                    wg++;
            }
            else {
                cont = elm;
            }
            w[wg] = {};
            w[wg][label] = {};

            $('option', cont).each(function () {
                var v = $(this).attr('value');
                w[wg][label]['_' + v] = $(this).text();
                if ($(this).prop('disabled')) invalid.push(v);
            });

            return w;
        }

    }

})(jQuery);

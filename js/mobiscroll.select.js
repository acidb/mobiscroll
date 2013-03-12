/*jslint eqeq: true, plusplus: true, undef: true, sloppy: true, vars: true, forin: true */
(function ($) {

    var defaults = {
        inputClass: '',
        invalid: [],
        rtl: false,
        group: false,
        groupLabel: 'Groups'
    };

    $.mobiscroll.presetShort('select');

    $.mobiscroll.presets.select = function (inst) {
        var stg = inst.settings,
            s = $.extend({}, defaults, stg),
            elm = $(this),
            option = elm.val(),
            group = elm.find('option[value="' + elm.val() + '"]').parent(),
            prev = group.index() + '',
            gr = prev,
            prevent,
            id = this.id + '_dummy',
            l1 = $('label[for="' + this.id + '"]').attr('for', id),
            l2 = $('label[for="' + id + '"]'),
            label = s.label !== undefined ? s.label : (l2.length ? l2.text() : elm.attr('name')),
            invalid = [],
            main = {},
            grIdx,
            optIdx,
            timer,
            roPre = stg.readonly,
            w;

        function replace(str) {
            return str ? str.replace(/_/, '') : '';
        }

        function genWheels() {
            var cont,
                wg = 0,
                wheel = {},
                w = [{}];

            if (s.group) {
                if (s.rtl) {
                    wg = 1;
                }

                $('optgroup', elm).each(function (index) {
                    wheel['_' + index] = $(this).attr('label');
                });

                w[wg] = {};
                w[wg][s.groupLabel] = wheel;
                cont = group;
                wg += (s.rtl ? -1 : 1);

            } else {
                cont = elm;
            }
            w[wg] = {};
            w[wg][label] = {};

            $('option', cont).each(function () {
                var v = $(this).attr('value');
                w[wg][label]['_' + v] = $(this).text();
                if ($(this).prop('disabled')) {
                    invalid.push(v);
                }
            });

            return w;
        }

        // if groups is true and there are no groups fall back to no grouping
        if (s.group && !$('optgroup', elm).length) {
            s.group = false;
        }

        if (!s.invalid.length) {
            s.invalid = invalid;
        }

        if (s.group) {
            if (s.rtl) {
                grIdx = 1;
                optIdx = 0;
            } else {
                grIdx = 0;
                optIdx = 1;
            }
        } else {
            grIdx = -1;
            optIdx = 0;
        }

        $('#' + id).remove();

        $('option', elm).each(function () {
            main[$(this).attr('value')] = $(this).text();
        });

        var input = $('<input type="text" id="' + id + '" value="' + main[elm.val()] + '" class="' + s.inputClass + '" readonly />').insertBefore(elm);

        if (s.showOnFocus) {
            input.focus(function () {
                inst.show();
            });
        }

        elm.bind('change', function () {
            if (!prevent && option != elm.val()) {
                inst.setSelectVal([elm.val()], true);
            }
            prevent = false;
        }).hide().closest('.ui-field-contain').trigger('create');

        inst.setSelectVal = function (d, fill, time) {
            option = d[0];

            if (s.group) {
                group = elm.find('option[value="' + option + '"]').parent();
                gr = group.index();
                inst.temp = s.rtl ? ['_' + option, '_' + group.index()] : ['_' + group.index(), '_' + option];
                if (gr !== prev) { // Need to regenerate wheels, if group changed
                    stg.wheels = genWheels();
                    inst.changeWheel([optIdx]);
                    prev = gr + '';
                }
            } else {
                inst.temp = ['_' + option];
            }

            inst.setValue(true, fill, time);

            // Set input/select values
            if (fill) {
                input.val(main[option]);
                var changed = option !== elm.val();
                elm.val(option);
                // Trigger change on element
                if (changed) {
                    elm.trigger('change');
                }
            }
        };

        inst.getSelectVal = function (temp) {
            var val = temp ? inst.temp : inst.values;
            return replace(val[optIdx]);
        };

        return {
            width: 50,
            wheels: w,
            headerText: false,
            anchor: input,
            formatResult: function (d) {
                return main[replace(d[optIdx])];
            },
            parseValue: function () {
                option = elm.val();
                group = elm.find('option[value="' + option + '"]').parent();
                gr = group.index();
                return s.group && s.rtl ? ['_' + option, '_' + gr] : s.group ? ['_' + gr, '_' + option] : ['_' + option];
            },
            validate: function (dw, i, time) {
                if (i === grIdx) {
                    gr = replace(inst.temp[grIdx]);

                    if (gr !== prev) {
                        group = elm.find('optgroup').eq(gr);
                        gr = group.index();
                        option = group.find('option').eq(0).val();
                        option = option || elm.val();
                        stg.wheels = genWheels();
                        if (s.group) {
                            inst.temp = s.rtl ? ['_' + option, '_' + gr] : ['_' + gr, '_' + option];
                            stg.readonly = [s.rtl, !s.rtl];
                            clearTimeout(timer);
                            timer = setTimeout(function () {
                                inst.changeWheel([optIdx]);
                                stg.readonly = roPre;
                            }, time * 1000);
                            prev = gr + '';
                            return false;
                        }
                    } else {
                        stg.readonly = roPre;
                    }
                } else {
                    option = replace(inst.temp[optIdx]);
                }

                var t = $('.dw-ul', dw).eq(optIdx);
                $.each(s.invalid, function (i, v) {
                    $('.dw-li[data-val="_' + v + '"]', t).removeClass('dw-v');
                });
            },
            onBeforeShow: function () {
                stg.wheels = genWheels();
                if (s.group) {
                    inst.temp = s.rtl ? ['_' + option, '_' + group.index()] : ['_' + group.index(), '_' + option];
                }
            },
            onShow: function (dw) {
                $('.dwwl' + grIdx, dw).bind('mousedown touchstart', function () {
                    clearTimeout(timer);
                });
            },
            onSelect: function (v) {
                input.val(v);
                prevent = true;
                elm.val(replace(inst.values[optIdx])).trigger('change');
                if (s.group) {
                    inst.values = null;
                }
            },
            onCancel: function () {
                if (s.group) {
                    inst.values = null;
                }
            },
            onChange: function (v) {
                if (s.display == 'inline') {
                    input.val(v);
                    prevent = true;
                    elm.val(replace(inst.temp[optIdx])).trigger('change');
                }
            },
            onClose: function () {
                input.blur();
            },
            methods: {
                setValue: function (d, fill, time) {
                    return this.each(function () {
                        var inst = $(this).mobiscroll('getInst');
                        if (inst) {
                            if (inst.setSelectVal) {
                                inst.setSelectVal(d, fill, time);
                            } else {
                                inst.temp = d;
                                inst.setValue(true, fill, time);
                            }
                        }
                    });
                },
                getValue: function (temp) {
                    var inst = $(this).mobiscroll('getInst');
                    if (inst) {
                        return inst.getSelectVal ? inst.getSelectVal(temp) : inst.values;
                    }
                }
            }
        };
    };

})(jQuery);

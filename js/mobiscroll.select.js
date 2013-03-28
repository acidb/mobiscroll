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
            multiple = elm.prop('multiple'),
            id = this.id + '_dummy',
            option = multiple ? (elm.val() ? elm.val()[0] : $('option', elm).attr('value')) : elm.val(),
            group = elm.find('option[value="' + option + '"]').parent(),
            prev = group.index() + '',
            gr = prev,
            prevent,
            l1 = $('label[for="' + this.id + '"]').attr('for', id),
            l2 = $('label[for="' + id + '"]'),
            label = s.label !== undefined ? s.label : (l2.length ? l2.text() : elm.attr('name')),
            invalid = [],
            origValues = [],
            main = {},
            grIdx,
            optIdx,
            timer,
            input,
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
        
        function setVal(v, fill) {
            var value = [];
            
            if (multiple) {
                var sel = [],
                    i = 0;

                for (i in inst._selectedValues) {
                    sel.push(main[i]);
                    value.push(i);
                }
                input.val(sel.join(', '));
            } else {
                input.val(v);
                value = fill ? replace(inst.values[optIdx]) : null;
            }
            
            if (fill) {
                prevent = true;
                elm.val(value).trigger('change');
            }
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
        
        input = $('<input type="text" id="' + id + '" class="' + s.inputClass + '" readonly />').insertBefore(elm),

        $('option', elm).each(function () {
            main[$(this).attr('value')] = $(this).text();
        });

        if (s.showOnFocus) {
            input.focus(function () {
                inst.show();
            });
        }
        
        var v = elm.val() || [],
            i = 0;
        
        for (i; i < v.length; i++) {
            inst._selectedValues[v[i]] = v[i];
        }
        
        setVal(main[option]);

        elm.unbind('.dwsel').bind('change.dwsel', function () {
            if (!prevent) {
                inst.setSelectVal(multiple ? elm.val() || [] : [elm.val()], true);
            }
            prevent = false;
        }).hide().closest('.ui-field-contain').trigger('create');

        inst.setSelectVal = function (d, fill, time) {
            option = d[0] || $('option', elm).attr('value');
            
            if (multiple) {
                inst._selectedValues = {};
                var i = 0;
                for (i; i < d.length; i++) {
                    inst._selectedValues[d[i]] = d[i];
                }
            }

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
                var changed = multiple ? true : option !== elm.val();
                setVal(main[option], changed);
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
            multiple: multiple,
            anchor: input,
            formatResult: function (d) {
                return main[replace(d[optIdx])];
            },
            parseValue: function () {
                var v = elm.val() || [],
                    i = 0;

                if (multiple) {
                    inst._selectedValues = {};
                    for (i; i < v.length; i++) {
                        inst._selectedValues[v[i]] = v[i];
                    }
                }
                
                option = multiple ? (elm.val() ? elm.val()[0] : $('option', elm).attr('value')) : elm.val();
                
                group = elm.find('option[value="' + option + '"]').parent();
                gr = group.index();
                prev = gr + '';
                return s.group && s.rtl ? ['_' + option, '_' + gr] : s.group ? ['_' + gr, '_' + option] : ['_' + option];
            },
            validate: function (dw, i, time) {
                if (i === undefined && multiple) {
                    var v = inst._selectedValues,
                        j = 0;

                    for (j in v) {
                        $('.dwwl' + optIdx + ' .dw-li[data-val="_' + v[j] + '"]', dw).addClass('dw-msel');
                    }
                }
                
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
                                prev = gr + '';
                            }, time * 1000);
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
            onBeforeShow: function (dw) {
                stg.wheels = genWheels();
                if (s.group) {
                    inst.temp = s.rtl ? ['_' + option, '_' + group.index()] : ['_' + group.index(), '_' + option];
                }
            },
            onMarkupReady: function (dw) {
                $('.dwwl' + grIdx, dw).bind('mousedown touchstart', function () {
                    clearTimeout(timer);
                });
                if (multiple) {
                    dw.addClass('dwms');
                    $('.dwwl', dw).eq(optIdx).addClass('dwwms');
                    origValues = {};
                    var i;
                    for (i in inst._selectedValues) {
                        origValues[i] = inst._selectedValues[i];
                    }
                }
            },
            onValueTap: function (li) {
                if (multiple && li.hasClass('dw-v') && li.closest('.dw').find('.dw-ul').index(li.closest('.dw-ul')) == optIdx) {
                    var val = replace(li.attr('data-val'));
                    if (li.hasClass('dw-msel')) {
                        delete inst._selectedValues[val];
                    } else {
                        inst._selectedValues[val] = val;
                    }
                    li.toggleClass('dw-msel');
                    
                    if (s.display == 'inline') {
                        setVal(val, true);
                    }
                    return false;
                }
            },
            onSelect: function (v) {
                setVal(v, true);
                if (s.group) {
                    inst.values = null;
                }
            },
            onCancel: function () {
                if (s.group) {
                    inst.values = null;
                }
                if (multiple) {
                    inst._selectedValues = {};
                    var i;
                    for (i in origValues) {
                        inst._selectedValues[i] = origValues[i];
                    }
                }
            },
            onChange: function (v) {
                if (s.display == 'inline' && !multiple) {
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

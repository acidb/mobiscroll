(function (undefined) {
    var ms = mobiscroll,
        $ = ms.$,
        defaults = {
            invalid: [],
            showInput: true,
            inputClass: ''
        };

    ms.presets.scroller.list = function (inst) {
        var orig = $.extend({}, inst.settings),
            s = $.extend(inst.settings, defaults, orig),
            layout = s.layout || (/top|bottom/.test(s.display) ? 'liquid' : ''),
            isLiquid = layout == 'liquid',
            origReadOnly = s.readonly,
            elm = $(this),
            input,
            prevent,
            id = this.id + '_dummy',
            lvl = 0,
            ilvl = 0,
            currLevel,
            currWheelVector = [],
            wa = s.wheelArray || createWheelArray(elm),
            labels = generateLabels(lvl),
            fwv = firstWheelVector(wa),
            w = generateWheelsFromVector(fwv, lvl);

        /**
         * Disables the invalid items on the wheels
         * @param {Object} dw - the jQuery mobiscroll object
         * @param {Number} nrWheels - the number of the current wheels
         * @param {Array} whArray - The wheel array objects containing the wheel tree
         * @param {Array} whVector - the wheel vector containing the current keys
         */
        function getDisabled(nrWheels, whArray, whVector) {
            var i = 0,
                disabled = [];

            while (i < nrWheels) {
                disabled[i] = getInvalidKeys(whVector, i, whArray);
                i++;
            }

            return disabled;
        }

        /**
         * Returns the invalid keys of one wheel as an array
         * @param {Array} whVector - the wheel vector used to search for the wheel in the wheel array
         * @param {Number} index - index of the wheel in the wheel vector, that we are interested in
         * @param {Array} whArray - the wheel array we are searching in
         * @return {Array} - list of invalid keys
         */
        function getInvalidKeys(whVector, index, whArray) {
            var i = 0,
                n,
                whObjA = whArray,
                invalids = [];

            while (i < index) {
                var ii = whVector[i];
                for (n in whObjA) {
                    if (whObjA[n].key == ii) {
                        whObjA = whObjA[n].children;
                        break;
                    }
                }
                i++;
            }
            i = 0;
            while (i < whObjA.length) {
                if (whObjA[i].invalid) {
                    invalids.push(whObjA[i].key);
                }
                i++;
            }
            return invalids;
        }

        /**
         * Creates a Boolean vector with true values (except one) that can be used as the readonly vector
         * n - the length of the vector
         * i - the index of the value that's going to be false
         */
        function createROVector(n, i) {
            var a = [];
            while (n) {
                a[--n] = true;
            }
            a[i] = false;
            return a;
        }

        /**
         * Creates a labels vector, from values if they are defined, otherwise from numbers
         * l - the length of the vector
         */
        function generateLabels(l) {
            var a = [],
                i;
            for (i = 0; i < l; i++) {
                a[i] = s.labels && s.labels[i] ? s.labels[i] : i;
            }
            return a;
        }

        /**
         * Creates the wheel array from the vector provided
         * wv - wheel vector containing the values that should be selected on the wheels
         * l - the length of the wheel array
         */
        function generateWheelsFromVector(wv, l, index) {
            var i = 0,
                j, obj, chInd,
                w = [
                    []
                ],
                wtObjA = wa;

            if (l) { // if length is defined we need to generate that many wheels (even if they are empty)
                for (j = 0; j < l; j++) {
                    if (isLiquid) {
                        w[0][j] = {};
                    } else {
                        w[j] = [{}];
                    }
                }
            }
            while (i < wv.length) { // we generate the wheels until the length of the wheel vector
                if (isLiquid) {
                    w[0][i] = getWheelFromObjA(wtObjA, labels[i]);
                } else {
                    w[i] = [getWheelFromObjA(wtObjA, labels[i])];
                }

                j = 0;
                chInd = undefined;

                while (j < wtObjA.length && chInd === undefined) {
                    if (wtObjA[j].key == wv[i] && ((index !== undefined && i <= index) || index === undefined)) {
                        chInd = j;
                    }
                    j++;
                }

                if (chInd !== undefined && wtObjA[chInd].children) {
                    i++;
                    wtObjA = wtObjA[chInd].children;
                } else if ((obj = getFirstValidItemObjOrInd(wtObjA)) && obj.children) {
                    i++;
                    wtObjA = obj.children;
                } else {
                    return w;
                }
            }
            return w;
        }

        /**
         * Returns the first valid Wheel Node Object or its index from a Wheel Node Object Array
         * getInd - if it is true then the return value is going to be the index, otherwise the object itself
         */
        function getFirstValidItemObjOrInd(wtObjA, getInd) {
            if (!wtObjA) {
                return false;
            }

            var i = 0,
                obj;

            while (i < wtObjA.length) {
                if (!(obj = wtObjA[i++]).invalid) {
                    return getInd ? i - 1 : obj;
                }
            }
            return false;
        }

        function getWheelFromObjA(objA, lbl) {
            var wheel = {
                    data: [],
                    label: lbl
                },
                j = 0;

            while (j < objA.length) {
                wheel.data.push({
                    value: objA[j].key,
                    display: objA[j].value
                });
                j++;
            }
            return wheel;
        }

        /**
         * Hides the last i number of wheels
         * i - the last number of wheels that has to be hidden
         */
        function hideWheels(i) {
            if (inst._isVisible) {
                $('.mbsc-sc-whl-w', inst._markup).css('display', '').slice(i).hide();
            }
        }

        /**
         * Generates the first wheel vector from the wheeltree
         * wt - the wheel tree object
         * uses the lvl global variable to determine the length of the vector
         */
        function firstWheelVector(wa) {
            var t = [],
                ndObjA = wa,
                obj,
                ok = true,
                i = 0;

            while (ok) {
                obj = getFirstValidItemObjOrInd(ndObjA);
                t[i++] = obj.key;
                ok = obj.children;
                if (ok) {
                    ndObjA = ok;
                }
            }
            return t;
        }

        /**
         * Calculates the level of a wheel vector and the new wheel vector, depending on current wheel vector and the index of the changed wheel
         * wv - current wheel vector
         * index - index of the changed wheel
         */
        function calcLevelOfVector2(wv, index) {
            var t = [],
                ndObjA = wa,
                lvl = 0,
                next = false,
                i,
                childName,
                chInd;

            if (wv[lvl] !== undefined && lvl <= index) {
                i = 0;

                childName = wv[lvl];
                chInd = undefined;

                while (i < ndObjA.length && chInd === undefined) {
                    if (ndObjA[i].key == wv[lvl] && !ndObjA[i].invalid) {
                        chInd = i;
                    }
                    i++;
                }
            } else {
                chInd = getFirstValidItemObjOrInd(ndObjA, true);
                childName = ndObjA[chInd].key;
            }

            next = chInd !== undefined ? ndObjA[chInd].children : false;

            t[lvl] = childName;

            while (next) {
                ndObjA = ndObjA[chInd].children;
                lvl++;
                next = false;
                chInd = undefined;

                if (wv[lvl] !== undefined && lvl <= index) {
                    i = 0;

                    childName = wv[lvl];
                    chInd = undefined;

                    while (i < ndObjA.length && chInd === undefined) {
                        if (ndObjA[i].key == wv[lvl] && !ndObjA[i].invalid) {
                            chInd = i;
                        }
                        i++;
                    }
                } else {
                    chInd = getFirstValidItemObjOrInd(ndObjA, true);
                    chInd = chInd === false ? undefined : chInd;
                    childName = ndObjA[chInd].key;
                }
                next = chInd !== undefined && getFirstValidItemObjOrInd(ndObjA[chInd].children) ? ndObjA[chInd].children : false;
                t[lvl] = childName;
            }
            return {
                lvl: lvl + 1,
                nVector: t
            }; // return the calculated level and the wheel vector as an object
        }

        function createWheelArray(ul) {
            var wheelArray = [];

            lvl = lvl > ilvl++ ? lvl : ilvl;

            ul.children('li').each(function (index) {
                var that = $(this),
                    c = that.clone();

                c.children('ul,ol').remove();

                var v = inst._processMarkup ? inst._processMarkup(c) : c.html().replace(/^\s\s*/, '').replace(/\s\s*$/, ''),
                    inv = that.attr('data-invalid') ? true : false,
                    wheelObj = {
                        key: that.attr('data-val') === undefined || that.attr('data-val') === null ? index : that.attr('data-val'),
                        value: v,
                        invalid: inv,
                        children: null
                    },
                    nest = that.children('ul,ol');

                if (nest.length) {
                    wheelObj.children = createWheelArray(nest);
                }

                wheelArray.push(wheelObj);
            });

            ilvl--;
            return wheelArray;
        }

        function changeWheels(values, index, o) {
            var j,
                i = (index || 0) + 1,
                args = [],
                w = {},
                wheels = {};

            w = generateWheelsFromVector(values, null, index);

            for (j = 0; j < values.length; j++) {
                inst._tempWheelArray[j] = values[j] = o.nVector[j] || 0;
            }

            while (i < o.lvl) {
                wheels[i] = isLiquid ? w[0][i] : w[i][0];
                args.push(i++);
            }

            hideWheels(o.lvl);
            currWheelVector = values.slice(0);

            if (args.length) {
                prevent = true;
                inst.changeWheel(wheels);
            }
        }

        // Remove input if exists
        $('#' + id).remove();

        if (s.showInput) {
            input = $('<input type="text" id="' + id + '" value="" class="' + s.inputClass + '" placeholder="' + (s.placeholder || '') + '" readonly />').insertBefore(elm);
            // give the core the input element for the bubble positioning
            s.anchor = input;
            inst.attachShow(input);
        }

        if (!s.wheelArray) {
            elm.hide();
        }

        return {
            wheels: w,
            layout: layout,
            headerText: false,
            formatValue: function (d) {
                if (currLevel === undefined) {
                    currLevel = calcLevelOfVector2(d, d.length).lvl;
                }
                return d.slice(0, currLevel).join(' ');
            },
            parseValue: function (value) {
                return value ? (value + '').split(' ') : (s.defaultValue || fwv).slice(0);
            },
            onBeforeShow: function () {
                var t = inst.getArrayVal(true);
                currWheelVector = t.slice(0);
                s.wheels = generateWheelsFromVector(t, lvl, lvl);
                prevent = true;
            },
            onWheelGestureStart: function (ev) {
                s.readonly = createROVector(lvl, ev.index);
            },
            onWheelAnimationEnd: function (ev) {
                var index = ev.index,
                    values = inst.getArrayVal(true),
                    o = calcLevelOfVector2(values, index);

                currLevel = o.lvl;

                s.readonly = origReadOnly;

                if (values[index] != currWheelVector[index]) {
                    changeWheels(values, index, o);
                }
            },
            onValueFill: function (ev) {
                currLevel = undefined;
                if (input) {
                    input.val(ev.valueText);
                }
            },
            validate: function (data) {
                var values = data.values,
                    index = data.index,
                    o = calcLevelOfVector2(values, values.length);

                currLevel = o.lvl;

                if (index === undefined) {
                    hideWheels(o.lvl);
                    if (!prevent) {
                        changeWheels(values, index, o);
                    }
                }

                prevent = false;

                return {
                    disabled: getDisabled(currLevel, wa, values)
                };
            },
            onDestroy: function () {
                if (input) {
                    input.remove();
                }
                elm.show();
            }
        };
    };
})();

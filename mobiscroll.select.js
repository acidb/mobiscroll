(function ($) {

    var defaults = {
        inputClass: ''
    }

    $.scroller.presets.select = function(inst) {
        var s = $.extend({}, defaults, inst.settings),
            elm = $(this),
            id = this.id + '_dummy',
            l1 = $('label[for="' + this.id + '"]').attr('for', id),
            l2 = $('label[for="' + id + '"]'),
            label = l2.length ? l2.text() : elm.attr('name'),
            w = [{}];

        w[0][label] = {};

        var main = w[0][label];

        $('option', elm).each(function() {
            main[$(this).attr('value')] = $(this).text();
        });

        $('#' + id).remove();

        var input = $('<input type="text" id="' + id + '" value="' + main[elm.val()] + '" class="' + s.inputClass + '" readonly />').insertAfter(elm).focus(function() { inst.show() });

        elm.hide().closest('.ui-field-contain').trigger('create');

        return {
            width: 200,
            wheels: w,
            headerText: false,
            formatResult: function(d) {
                return main[d[0]];
            },
            parseValue: function() {
                return [elm.val()];
            },
            onSelect: function(v, inst) {
                input.val(v);
                elm.val(inst.values[0]).change();
            },
            onClose: function() {
                input.blur();
            }
        }
    }

})(jQuery);

import mobiscroll, {
    $,
    extend,
    isBrowser
} from '../core/core';

import Widget from '../classes/widget';

const hasPromise = isBrowser && !!window.Promise;
const popupQueue = [];
const notificationQueue = [];

function showPopup(popup) {
    if (!popupQueue.length) {
        popup.show();
    }
    popupQueue.push(popup);
}

function showNotification(notification) {
    const isAny = notificationQueue.length;
    notificationQueue.push(notification);
    // Only show notification if no popup is visible
    // otherwise postpone it until popup is closed
    if (!popupQueue.length) {
        // If there's a visible notification, hide it.
        // The notification will be shown after hide animation is complete
        if (isAny) {
            notificationQueue[0].hide();
        } else {
            // Prevent focus on show for notifications
            notification.show(false, true);
        }
    }
}

function getSettings(queue, settings, resolve, more) {
    //const active = mobiscroll.activeInstance;
    return extend({
        display: settings.display || 'center',
        cssClass: 'mbsc-alert',
        okText: settings.okText,
        cancelText: settings.cancelText,
        context: settings.context,
        theme: settings.theme,
        closeOnOverlayTap: false,
        onBeforeClose: function () {
            queue.shift();
        },
        onBeforeShow: function () {
            // If there's an active mobiscroll picker on screen,
            // prevent from being hidden when 
            // popup is shown
            mobiscroll.activeInstance = null;
        },
        onHide: function (ev, inst) {
            //mobiscroll.activeInstance = active;
            if (resolve) {
                resolve(inst._resolve);
            }
            if (settings.callback) {
                settings.callback(inst._resolve);
            }
            if (inst) {
                inst.destroy();
            }
            // Show next
            if (popupQueue.length) {
                popupQueue[0].show();
            } else if (notificationQueue.length) {
                // Prevent focus on show for notifications
                notificationQueue[0].show(false, true);
            }
        }
    }, more);
}

function getMessage(settings) {
    return (settings.title ? ('<h2>' + settings.title + '</h2>') : '') + '<p>' + (settings.message || '') + '</p>';
}

function showAlert(widget, settings, resolve) {
    const inst = new Widget(widget, getSettings(popupQueue, settings, resolve));
    showPopup(inst);
}

function showConfirm(widget, settings, resolve) {
    const inst = new Widget(widget, getSettings(popupQueue, settings, resolve, {
        buttons: ['ok', 'cancel'],
        onSet: function () {
            inst._resolve = true;
        }
    }));
    inst._resolve = false;
    showPopup(inst);
}

function showPrompt(widget, settings, resolve) {
    let input;
    const inst = new Widget(widget, getSettings(popupQueue, settings, resolve, {
        buttons: ['ok', 'cancel'],
        onShow: function () {
            input = inst._markup.find('input')[0];
            setTimeout(function () {
                input.focus();
            }, 300);
        },
        onSet: function () {
            inst._resolve = input.value;
        }
    }));
    inst._resolve = null;
    showPopup(inst);
}

function showSnackbar(widget, settings, resolve, cssClass, animation) {
    let notificationTimer;
    const inst = new Widget(widget, getSettings(notificationQueue, settings, resolve, {
        display: 'bottom',
        animate: animation,
        cssClass: cssClass || 'mbsc-snackbar',
        scrollLock: false,
        focusTrap: false,
        buttons: [],
        onShow: function (ev, inst) {
            if (settings.duration !== false) {
                notificationTimer = setTimeout(function () {
                    if (inst) {
                        inst.hide();
                    }
                }, settings.duration || 3000);
            }
            if (settings.button) {
                inst.tap($('.mbsc-snackbar-btn', ev.target), function () {
                    inst.hide();
                    if (settings.button.action) {
                        settings.button.action.call(this);
                    }
                });
            }
        },
        onClose: function () {
            clearTimeout(notificationTimer);
        }
    }));
    showNotification(inst);
}

function showToast(widget, settings, resolve) {
    showSnackbar(widget, settings, resolve, 'mbsc-toast', 'fade');
}

function show(func, widget, settings) {
    let p;
    if (hasPromise) {
        p = new Promise((resolve) => {
            func(widget, settings, resolve);
        });
    } else {
        func(widget, settings);
    }
    return p;
}

mobiscroll.alert = function (settings) {
    const widget = document.createElement('div');
    widget.innerHTML = getMessage(settings);
    return show(showAlert, widget, settings);
};

mobiscroll.confirm = function (settings) {
    const widget = document.createElement('div');
    widget.innerHTML = getMessage(settings);
    return show(showConfirm, widget, settings);
};

mobiscroll.prompt = function (settings) {
    const widget = document.createElement('div');
    widget.innerHTML = getMessage(settings) +
        '<label class="mbsc-input">' +
        (settings.label ? '<span class="mbsc-label">' + settings.label + '</span>' : '') +
        '<input tabindex="0" type="' + (settings.inputType || 'text') + '" placeholder="' + (settings.placeholder || '') + '" value="' + (settings.value || '') + '">' +
        '</label>';
    return show(showPrompt, widget, settings);
};

mobiscroll.snackbar = function (settings) {
    const widget = document.createElement('div');
    widget.innerHTML = '<div class="mbsc-snackbar-cont"><div class="mbsc-snackbar-msg">' + (settings.message || '') + '</div>' +
        (settings.button ? '<button class="mbsc-snackbar-btn mbsc-btn mbsc-btn-flat">' + (settings.button.text || '') + '</button>' : '') +
        '</div>';
    return show(showSnackbar, widget, settings);
};

mobiscroll.toast = function (settings) {
    const widget = document.createElement('div');
    widget.innerHTML = '<div class="mbsc-toast-msg">' + (settings.message || '') + '</div>';
    return show(showToast, widget, settings);
};

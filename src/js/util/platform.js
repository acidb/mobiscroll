var os,
    vers,
    majorVersion,
    minorVersion,
    version = [],
    isBrowser = typeof window !== 'undefined',
    isDark = isBrowser && window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches,
    userAgent = isBrowser ? navigator.userAgent : '',
    platform = isBrowser ? navigator.platform : '',
    maxTouchPoints = isBrowser ? navigator.maxTouchPoints : 0,
    isSafari = /Safari/.test(userAgent),
    device = userAgent.match(/Android|iPhone|iPad|iPod|Windows Phone|Windows|MSIE/i),
    raf = (isBrowser && window.requestAnimationFrame) || function (func) {
        return setTimeout(func, 20);
    },
    rafc = (isBrowser && window.cancelAnimationFrame) || function (id) {
        clearTimeout(id);
    };

if (/Android/i.test(device)) {
    os = 'android';
    vers = userAgent.match(/Android\s+([\d.]+)/i);
    if (vers) {
        version = vers[0].replace('Android ', '').split('.');
    }
} else if (/iPhone|iPad|iPod/i.test(device) || /iPhone|iPad|iPod/i.test(platform) || (platform === 'MacIntel' && maxTouchPoints > 1)) {
    // On iPad with iOS 13 desktop site request is automatically enabled in Safari,
    // so 'iPad' is no longer present in the user agent string.
    // In this case we check `navigator.platform` and `navigator.maxTouchPoints`.
    // maxTouchPoints is needed to exclude desktop Mac OS X.
    os = 'ios';
    vers = userAgent.match(/OS\s+([\d_]+)/i);
    if (vers) {
        version = vers[0].replace(/_/g, '.').replace('OS ', '').split('.');
    }
} else if (/Windows Phone/i.test(device)) {
    os = 'wp';
} else if (/Windows|MSIE/i.test(device)) {
    os = 'windows';
}

majorVersion = version[0];
minorVersion = version[1];

export {
    os,
    majorVersion,
    minorVersion,
    isBrowser,
    isDark,
    isSafari,
    userAgent,
    raf,
    rafc
};

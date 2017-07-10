var os,
    vers,
    majorVersion,
    minorVersion,
    version = [],
    isBrowser = typeof window !== 'undefined',
    userAgent = isBrowser ? navigator.userAgent : '',
    device = userAgent.match(/Android|iPhone|iPad|iPod|Windows Phone|Windows|MSIE/i),
    raf = (isBrowser && window.requestAnimationFrame) || function (func) {
        func();
    },
    rafc = (isBrowser && window.cancelAnimationFrame) || function () {};

if (/Android/i.test(device)) {
    os = 'android';
    vers = userAgent.match(/Android\s+([\d\.]+)/i);
    if (vers) {
        version = vers[0].replace('Android ', '').split('.');
    }
} else if (/iPhone|iPad|iPod/i.test(device)) {
    os = 'ios';
    vers = userAgent.match(/OS\s+([\d\_]+)/i);
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
    userAgent,
    raf,
    rafc
};

var platform,
    vers,
    version = [],
    userAgent = navigator.userAgent,
    device = userAgent.match(/Android|iPhone|iPad|iPod|Windows Phone|Windows|MSIE/i);

if (/Android/i.test(device)) {
    platform = 'android';
    vers = navigator.userAgent.match(/Android\s+([\d\.]+)/i);
    if (vers) {
        version = vers[0].replace('Android ', '').split('.');
    }
} else if (/iPhone|iPad|iPod/i.test(device)) {
    platform = 'ios';
    vers = navigator.userAgent.match(/OS\s+([\d\_]+)/i);
    if (vers) {
        version = vers[0].replace(/_/g, '.').replace('OS ', '').split('.');
    }
} else if (/Windows Phone/i.test(device)) {
    platform = 'wp';
} else if (/Windows|MSIE/i.test(device)) {
    platform = 'windows';
}

export default {
    name: platform,
    majorVersion: version[0],
    minorVersion: version[1]
};

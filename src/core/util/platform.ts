let os: string;
let version: string[] = [];
let touchUi = false;

const isBrowser = typeof window !== 'undefined';
const isDarkQuery = isBrowser && window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)');
const userAgent = isBrowser ? navigator.userAgent : '';
const platform = isBrowser ? navigator.platform : '';
const maxTouchPoints = isBrowser ? navigator.maxTouchPoints : 0;
const isSafari = userAgent && /Safari/.test(userAgent);

if (/Android/i.test(userAgent)) {
  os = 'android';
  touchUi = true;
  const vers = userAgent.match(/Android\s+([\d.]+)/i);
  if (vers) {
    version = vers[0].replace('Android ', '').split('.');
  }
} else if (/iPhone|iPad|iPod/i.test(userAgent) || /iPhone|iPad|iPod/i.test(platform) || (platform === 'MacIntel' && maxTouchPoints > 1)) {
  // On iPad with iOS 13 desktop site request is automatically enabled in Safari,
  // so 'iPad' is no longer present in the user agent string.
  // In this case we check `navigator.platform` and `navigator.maxTouchPoints`.
  // maxTouchPoints is needed to exclude desktop Mac OS X.
  os = 'ios';
  touchUi = true;
  const vers = userAgent.match(/OS\s+([\d_]+)/i);
  if (vers) {
    version = vers[0].replace(/_/g, '.').replace('OS ', '').split('.');
  }
} else if (/Windows Phone/i.test(userAgent)) {
  os = 'wp';
  touchUi = true;
} else if (/Windows|MSIE/i.test(userAgent)) {
  os = 'windows';
}

const majorVersion = +version[0];
const minorVersion = +version[1];

export { os, majorVersion, minorVersion, isBrowser, isDarkQuery, isSafari, touchUi, userAgent };

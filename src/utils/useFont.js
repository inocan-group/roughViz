const familyLoader = ([family]) =>
  `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}&display=swap`;

export let preloadedFonts = [];
export let requestedFonts = [];
export let preConnected = false;

/**
 * Injects a `<link rel="preconnect">` that points to Google's fonts DNS
 * and helps to reduce future requests for fonts from that site.
 */
const preConnect = () => {
  let preConnect = document.createElement("link");
  preConnect.id = `preconnect-for-rough-viz`;
  preConnect.rel = "preconnect";
  preConnect.href = "https://fonts.gstatic.com/";
  preConnect.crossorigin = true;

  document.querySelector("head").appendChild(preConnect);
  preConnected = true;
};

/**
 * Injects a `<link rel="preload">` tag into the DOM to provide a suggestion
 * to the browser about loading the font resource. This increases the chances
 * that the font will have already been taken from the network before the
 * app actually lands in place where this font is needed.
 *
 * @param {string} family the Google Font family being pre-loaded
 */
const preLoad = (family) => {
  if (preloadedFonts.includes(family)) return;

  let preLoad = document.createElement("link");
  preLoad.id = `rough-viz-pre-load-${family}`;
  preLoad.rel = "preload";
  preLoad.as = "style";
  preLoad.href = familyLoader(family);

  document.querySelector("head").appendChild(preLoad);
  preloadedFonts.push(family);
};

/**
 * Injects a `<link>` reference into the DOM to load the requested font family
 *
 * @param {string} name the name of the font-family to inject into the DOM
 */
const loadFont = (family) => {
  let fontLink = document.createElement("link");
  fontLink.id = `rough-viz-font-${family}`;
  fontLink.rel = "stylesheet";
  fontLink.href = familyLoader(family);
  fontLink.crossorigin = true;

  document.querySelector("head").appendChild(fontLink);
  requestedFonts.push(family);
};

/**
 * Injects HTML "preloads" for one or more Google Font families. This
 * will help to ensure these assets are available prior to the charts
 * being displayed.
 *
 * While intended to be used in conjunction with RoughViz (and specifically
 * the "Indie Flower" and "Gaegu" fonts which have a "sketchy" feel
 * to them).
 *
 * @param {string | string[]} family Google Font families
 */
export const prepFonts = (family) => {
  if (family && !Array.isArray(family)) {
    family = [family];
  }
  if (!preConnected) preConnect();
  if (family) {
    family.forEach((f) => preLoad(family));
  }
};

/**
 * Adds `<link>` tag(s) into the DOM to directly request the use of a
 * particular (or group of) font families.
 *
 * @param {string | string[]} family
 */
export const useFont = (family) => {
  if (!Array.isArray(family)) {
    family = family ? [family] : [];
  }

  family.filter((f) => !requestedFonts.includes(f)).forEach((f) => loadFont(family));
};

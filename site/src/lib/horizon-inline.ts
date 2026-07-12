/**
 * Pre-paint head script (rendered inline, runs before first paint) so the
 * reader's chosen theme is applied with no flash. Kept as a raw string because
 * it must NOT be bundled/deferred — it runs synchronously in <head>. Deliberately
 * minimal: only the theme needs to be resolved before paint. Progress is read
 * on demand by horizon.ts (getHorizon/resolveHorizon) straight from
 * localStorage, so there's nothing to preload here. The key mirrors horizon.ts.
 */
export const inlineHeadScript = `(function(){
  try {
    var t = localStorage.getItem('scs:theme');
    document.documentElement.dataset.theme = (t === 'night') ? 'night' : 'day';
  } catch (e) {
    document.documentElement.dataset.theme = 'day';
  }
})();`;

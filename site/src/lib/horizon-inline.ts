/**
 * Pre-paint head script (rendered inline, runs before first paint) so the
 * reader's chosen theme and horizon are applied with no flash. Kept as a raw
 * string because it must NOT be bundled/deferred — it runs synchronously in
 * <head>. The localStorage keys mirror horizon.ts exactly.
 */
export const inlineHeadScript = `(function(){
  try {
    var t = localStorage.getItem('scs:theme');
    document.documentElement.dataset.theme = (t === 'night') ? 'night' : 'day';
  } catch (e) {
    document.documentElement.dataset.theme = 'day';
  }
  try {
    var raw = localStorage.getItem('scs:progress');
    window.__scsProgress = raw ? JSON.parse(raw) : { v: 1 };
  } catch (e) {
    window.__scsProgress = { v: 1 };
  }
})();`;

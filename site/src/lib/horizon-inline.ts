/**
 * Pre-paint head script (rendered inline, runs before first paint). Kept as a
 * raw string because it must NOT be bundled/deferred — it runs synchronously in
 * <head>. Deliberately minimal: only what has to be resolved before paint.
 *
 * Two things qualify. The theme, so the page doesn't flash light before going
 * dark. And whether the reader has checked in, because the front door renders
 * the menu server-side (so a visitor without JS gets the menu rather than a
 * wall) and the host stand has to replace it without the menu showing first.
 *
 * `data-checkin="pending"` is set only for a reader with no stored choice AND
 * no stored progress — someone mid-book who cleared the flag is not a stranger.
 * If the attribute is absent, for any reason including storage throwing, the
 * menu shows. Failing open is the right way round here.
 *
 * The keys mirror horizon.ts.
 */
export const inlineHeadScript = `(function(){
  var d = document.documentElement;
  try {
    var t = localStorage.getItem('scs:theme');
    d.dataset.theme = (t === 'night') ? 'night' : 'day';
    if (!localStorage.getItem('scs:checkin') && !localStorage.getItem('scs:progress')) {
      d.dataset.checkin = 'pending';
    }
  } catch (e) {
    d.dataset.theme = 'day';
  }
})();`;

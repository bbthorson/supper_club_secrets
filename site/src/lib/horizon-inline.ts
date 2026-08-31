/**
 * Pre-paint head script (rendered inline, runs before first paint). Kept as a
 * raw string because it must NOT be bundled/deferred — it runs synchronously in
 * <head>. Deliberately minimal: only what has to be resolved before paint.
 *
 * Two things qualify. The theme, so the page doesn't flash light before going
 * dark. And which front-door panel a reader gets, because `/` ships all three
 * in one document and swapping them after paint would show every visitor the
 * site changing its mind about who they are.
 *
 * `data-door` is set to one of:
 *   returning — stored progress in the current book: pick up where they left off
 *   seated    — checked in, nothing read yet: begin at Chapter One
 *   stranger  — never been here: the greeting, and the way in
 *
 * An explicit `?h=` pin wins over stored progress, mirroring resolveHorizon().
 *
 * If the attribute is absent, for any reason including storage throwing or
 * JavaScript being off, the stranger panel shows. Failing open to the greeting
 * is the right way round: it's true for everyone.
 *
 * The keys mirror horizon.ts.
 */
export function inlineHeadScript(book: string): string {
  return `(function(){
  var d = document.documentElement;
  try {
    var t = localStorage.getItem('scs:theme');
    d.dataset.theme = (t === 'night') ? 'night' : 'day';
  } catch (e) {
    d.dataset.theme = 'day';
  }
  try {
    var h = 0;
    var raw = localStorage.getItem('scs:progress');
    if (raw) {
      var p = JSON.parse(raw);
      var b = p && p.books && p.books[${JSON.stringify(book)}];
      if (b && typeof b.chapter === 'number') h = b.chapter;
    }
    // an explicit ?h= pin wins, the same as resolveHorizon() — a shared link
    // shows the door the sender's link asks for, not this browser's history
    var q = new URLSearchParams(location.search).get('h');
    if (q !== null) {
      var n = parseInt(q, 10);
      if (isFinite(n) && n >= 0) h = n;
    }
    d.dataset.door = h > 0 ? 'returning'
      : (localStorage.getItem('scs:checkin') ? 'seated' : 'stranger');
  } catch (e) {
    d.dataset.door = 'stranger';
  }
})();`;
}

/**
 * Chapter files open with an in-prose meal divider (`# Meal One`) and/or a
 * chapter-title heading (`### Chapter One - The Missing Hot Sauce`) before the
 * first paragraph. The reading room renders its own header from frontmatter, so
 * these would double-print. Strip the run of leading heading nodes at the very
 * start of the document (verified: chapters have no mid-body headings).
 *
 * @returns {(tree: import('mdast').Root) => void}
 */
export default function remarkStripLeadingHeadings() {
  return (tree) => {
    const children = tree.children;
    let i = 0;
    while (i < children.length && children[i].type === 'heading') {
      i++;
    }
    if (i > 0) children.splice(0, i);
  };
}

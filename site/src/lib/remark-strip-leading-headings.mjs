/**
 * Chapter files open with an in-prose meal divider (`# Meal One`) and/or a
 * chapter-title heading (`### Chapter One - The Missing Hot Sauce`) before the
 * first paragraph. The reading room renders its own header from frontmatter, so
 * these would double-print. Strip the run of leading heading nodes (verified:
 * chapters have no mid-body headings).
 *
 * A `yaml` frontmatter node can sit at index 0 depending on the remark
 * frontmatter setup, so skip any leading non-content nodes (yaml/toml) before
 * looking for the heading run.
 *
 * @returns {(tree: import('mdast').Root) => void}
 */
export default function remarkStripLeadingHeadings() {
  return (tree) => {
    const children = tree.children;
    let i = 0;
    while (i < children.length && (children[i].type === 'yaml' || children[i].type === 'toml')) {
      i++;
    }
    const start = i;
    while (i < children.length && children[i].type === 'heading') {
      i++;
    }
    if (i > start) children.splice(start, i - start);
  };
}

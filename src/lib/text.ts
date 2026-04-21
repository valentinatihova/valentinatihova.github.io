import { Children, isValidElement, type ReactNode } from 'react';

/**
 * Convert a React node tree into a plain-text string by walking children.
 * Used to derive heading text for TOC entries and for slug generation when
 * MDX headings contain inline <code> / <em> / <strong> children.
 */
export function getTextContent(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join('');
  if (isValidElement(node)) {
    const children = (node as any).props?.children;
    return Children.toArray(children).map(getTextContent).join('');
  }
  return '';
}

/**
 * Turn a heading string into a URL-safe slug. Deterministic, kebab-case,
 * stripped of non-word characters, safe for `#anchor` navigation.
 *
 *   "Why 30 Seconds Instead of 15 or 60?"  →  "why-30-seconds-instead-of-15-or-60"
 *   "Pattern 1: Suspicious Two-Open Behavior" → "pattern-1-suspicious-two-open-behavior"
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

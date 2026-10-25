// The drift ledger on the home page: shipped fixes, written as a schema diff.
// Status is hand-maintained: update it when a pull request merges or a release ships.

export type FixStatus = 'shipped' | 'review';

export interface Fix {
  product: string;
  /** What was wrong before the change. */
  before: string;
  /** What the change does. */
  after: string;
  proof: { label: string; url: string };
  status: FixStatus;
}

export const LEDGER_UPDATED = '2026-10-25';

export const fixes: Fix[] = [
  {
    product: 'Salesforce Data 360',
    before: 'Org documentation is written by hand; nobody sees when the schema changes.',
    after: 'data360-autodoc generates it and fails CI when a mapping drifts.',
    proof: { label: 'PyPI 0.4.1', url: 'https://pypi.org/project/data360-autodoc/' },
    status: 'shipped',
  },
  {
    product: 'sfdx-hardis',
    before: 'The data dictionary skipped Data Cloud objects.',
    after: 'It documents DMOs, DLOs and their relationships.',
    proof: { label: 'Merged', url: 'https://github.com/hardisgroupcom/sfdx-hardis/pull/2360' },
    status: 'shipped',
  },
  {
    product: 'Marketing Cloud reporting',
    before: 'Open rate counts security scanners as readers.',
    after: 'SQL over Data Views separates people from scanner opens.',
    proof: { label: 'Public SQL', url: 'https://github.com/valentinatihova/sfmc-false-opens' },
    status: 'shipped',
  },
  {
    product: 'OpenMetadata',
    before: 'The Data 360 connector re-read the full metadata listing on every page.',
    after: 'One listing call; each table is processed once.',
    proof: { label: 'In review', url: 'https://github.com/open-metadata/OpenMetadata/pull/36000' },
    status: 'review',
  },
  {
    product: 'Accenture sfmc-devtools',
    before: '`--dependencies` missed tables used in SQL queries.',
    after: 'Query Activities list the tables they select from.',
    proof: { label: 'In review', url: 'https://github.com/Accenture/sfmc-devtools/pull/2692' },
    status: 'review',
  },
  {
    product: 'Journey Builder',
    before: 'Audit logs exist, but nothing reports launches and testing.',
    after: 'An offline report shows what went live, and what went live untested.',
    proof: { label: 'Public repo', url: 'https://github.com/valentinatihova/sfmc-journey-change-log' },
    status: 'shipped',
  },
];

/** Each launchpad tile opens its own focused demo route and relevant modules. */
export type DemoView = 'overview' | 'sod' | 'pam' | 'evidence' | 'landscape' | 'btp' | 'support' | 'delivery' | 'documents';

export const demoTileContexts = {
  landscape: { title: 'ERP Landscape', start: 'landscape', views: ['landscape', 'btp'] },
  support: { title: 'Support Requests', start: 'support', views: ['support'] },
  delivery: { title: 'Project Delivery', start: 'delivery', views: ['delivery', 'documents'] },
  access: { title: 'Access Governance', start: 'sod', views: ['sod', 'evidence'] },
  pam: { title: 'Privileged Access', start: 'pam', views: ['pam', 'evidence'] },
  btp: { title: 'BTP Security & CoE', start: 'btp', views: ['btp'] },
  reports: { title: 'Reports & Insights', start: 'evidence', views: ['evidence'] },
  documents: { title: 'Documents & Actions', start: 'documents', views: ['documents', 'evidence'] }
} as const satisfies Record<string, { title: string; start: DemoView; views: readonly DemoView[] }>;

export type DemoTileId = keyof typeof demoTileContexts;

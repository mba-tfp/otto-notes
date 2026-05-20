export interface DemoCnpDocument {
  id: string;
  owner: 'patient' | 'partner';
  ownerName: string;
  filename: string;
  category: DemoCnpCategory;
  date: string;
}

export type DemoCnpCategory =
  | 'Previous Test Results'
  | 'Health History Form'
  | 'Medical Records'
  | 'Diagnostic Testing';

export const DEMO_CNP_CATEGORIES: DemoCnpCategory[] = [
  'Previous Test Results',
  'Health History Form',
  'Medical Records',
  'Diagnostic Testing',
];

export const DEMO_CNP_DOCS_BY_PATIENT: Record<string, DemoCnpDocument[]> = {
  'CNP-DEMO-GA': [
    { id: 'ga-1', owner: 'patient', ownerName: 'Ghazanfar Ali', filename: 'Ghazanfar Ali Medical Summary.pdf', category: 'Medical Records', date: 'Apr 10, 2026' },
    { id: 'ga-2', owner: 'patient', ownerName: 'Ghazanfar Ali', filename: 'Ghazanfar Ali Blood Work Q1.pdf', category: 'Previous Test Results', date: 'Mar 3, 2026' },
    { id: 'ga-3', owner: 'patient', ownerName: 'Ghazanfar Ali', filename: 'Ghazanfar Ali Health History Form.pdf', category: 'Health History Form', date: 'Jan 15, 2026' },
    { id: 'ga-4', owner: 'patient', ownerName: 'Ghazanfar Ali', filename: 'Ghazanfar Ali Semen Analysis.pdf', category: 'Diagnostic Testing', date: 'Feb 8, 2026' },
    { id: 'nj-1', owner: 'partner', ownerName: 'Nimra Jafar', filename: 'Nimra Jafar Medical Summary.pdf', category: 'Medical Records', date: 'Apr 10, 2026' },
    { id: 'nj-2', owner: 'partner', ownerName: 'Nimra Jafar', filename: 'Nimra Jafar Hormone Panel.pdf', category: 'Previous Test Results', date: 'Feb 20, 2026' },
    { id: 'nj-3', owner: 'partner', ownerName: 'Nimra Jafar', filename: 'Nimra Jafar Health History Form.pdf', category: 'Health History Form', date: 'Jan 18, 2026' },
    { id: 'nj-4', owner: 'partner', ownerName: 'Nimra Jafar', filename: 'Nimra Jafar HSG Imaging.pdf', category: 'Diagnostic Testing', date: 'Mar 22, 2026' },
  ],
};

export const getDemoCnpDocs = (cnpId?: string): DemoCnpDocument[] => {
  if (!cnpId) return [];
  return DEMO_CNP_DOCS_BY_PATIENT[cnpId] || [];
};

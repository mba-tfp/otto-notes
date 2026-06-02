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
    // Patient — Ghazanfar Ali
    { id: 'ga-1',  owner: 'patient', ownerName: 'Ghazanfar Ali', filename: 'Ghazanfar Ali Medical Summary.pdf',           category: 'Medical Records',        date: 'Apr 10, 2026' },
    { id: 'ga-2',  owner: 'patient', ownerName: 'Ghazanfar Ali', filename: 'Ghazanfar Ali Blood Work Q1.pdf',              category: 'Previous Test Results',  date: 'Mar 3, 2026'  },
    { id: 'ga-3',  owner: 'patient', ownerName: 'Ghazanfar Ali', filename: 'Ghazanfar Ali Health History Form.pdf',       category: 'Health History Form',    date: 'Jan 15, 2026' },
    { id: 'ga-4',  owner: 'patient', ownerName: 'Ghazanfar Ali', filename: 'Ghazanfar Ali Semen Analysis.pdf',            category: 'Diagnostic Testing',     date: 'Feb 8, 2026'  },
    { id: 'ga-5',  owner: 'patient', ownerName: 'Ghazanfar Ali', filename: 'Ghazanfar Ali Hormone Panel.pdf',             category: 'Previous Test Results',  date: 'Dec 12, 2025' },
    { id: 'ga-6',  owner: 'patient', ownerName: 'Ghazanfar Ali', filename: 'Ghazanfar Ali Lifestyle Questionnaire.pdf',   category: 'Health History Form',    date: 'Jan 20, 2026' },
    { id: 'ga-7',  owner: 'patient', ownerName: 'Ghazanfar Ali', filename: 'Ghazanfar Ali Scrotal Ultrasound.pdf',        category: 'Diagnostic Testing',     date: 'Mar 18, 2026' },
    { id: 'ga-8',  owner: 'patient', ownerName: 'Ghazanfar Ali', filename: 'Ghazanfar Ali Past Surgical Records.pdf',     category: 'Medical Records',        date: 'Nov 5, 2025'  },
    { id: 'ga-9',  owner: 'patient', ownerName: 'Ghazanfar Ali', filename: 'Ghazanfar Ali Karyotype Report.pdf',          category: 'Diagnostic Testing',     date: 'Apr 2, 2026'  },
    { id: 'ga-10', owner: 'patient', ownerName: 'Ghazanfar Ali', filename: 'Ghazanfar Ali Lipid Profile.pdf',             category: 'Previous Test Results',  date: 'May 1, 2026'  },

    // Partner — Nimra Jafar
    { id: 'nj-1',  owner: 'partner', ownerName: 'Nimra Jafar', filename: 'Nimra Jafar Medical Summary.pdf',               category: 'Medical Records',        date: 'Apr 10, 2026' },
    { id: 'nj-2',  owner: 'partner', ownerName: 'Nimra Jafar', filename: 'Nimra Jafar Hormone Panel.pdf',                 category: 'Previous Test Results',  date: 'Feb 20, 2026' },
    { id: 'nj-3',  owner: 'partner', ownerName: 'Nimra Jafar', filename: 'Nimra Jafar Health History Form.pdf',           category: 'Health History Form',    date: 'Jan 18, 2026' },
    { id: 'nj-4',  owner: 'partner', ownerName: 'Nimra Jafar', filename: 'Nimra Jafar HSG Imaging.pdf',                   category: 'Diagnostic Testing',     date: 'Mar 22, 2026' },
    { id: 'nj-5',  owner: 'partner', ownerName: 'Nimra Jafar', filename: 'Nimra Jafar AMH & FSH Results.pdf',             category: 'Previous Test Results',  date: 'Dec 8, 2025'  },
    { id: 'nj-6',  owner: 'partner', ownerName: 'Nimra Jafar', filename: 'Nimra Jafar Menstrual History Form.pdf',        category: 'Health History Form',    date: 'Jan 22, 2026' },
    { id: 'nj-7',  owner: 'partner', ownerName: 'Nimra Jafar', filename: 'Nimra Jafar Pelvic Ultrasound.pdf',             category: 'Diagnostic Testing',     date: 'Mar 5, 2026'  },
    { id: 'nj-8',  owner: 'partner', ownerName: 'Nimra Jafar', filename: 'Nimra Jafar OB-GYN Visit Notes.pdf',            category: 'Medical Records',        date: 'Nov 14, 2025' },
    { id: 'nj-9',  owner: 'partner', ownerName: 'Nimra Jafar', filename: 'Nimra Jafar Thyroid Panel.pdf',                 category: 'Previous Test Results',  date: 'Apr 28, 2026' },
    { id: 'nj-10', owner: 'partner', ownerName: 'Nimra Jafar', filename: 'Nimra Jafar Antral Follicle Count.pdf',         category: 'Diagnostic Testing',     date: 'May 4, 2026'  },
  ],
};

export const getDemoCnpDocs = (cnpId?: string): DemoCnpDocument[] => {
  if (!cnpId) return [];
  return DEMO_CNP_DOCS_BY_PATIENT[cnpId] || [];
};

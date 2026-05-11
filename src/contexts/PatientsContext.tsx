import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Patient } from '@/types/session';

interface PatientsContextType {
  patients: Patient[];
  addPatient: (patient: Patient) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  getPatient: (id: string) => Patient | undefined;
}

const PatientsContext = createContext<PatientsContextType | undefined>(undefined);

const STORAGE_KEY = 'medical-scribe-patients';
const STORAGE_VERSION_KEY = 'medical-scribe-patients-version';
const CURRENT_VERSION = 3; // Increment when patient data structure changes

const defaultPatients: Patient[] = [
  {
    id: 'p-demo-ga',
    name: 'Ghazanfar Ali',
    firstName: 'Ghazanfar',
    lastName: 'Ali',
    email: 'ghazanfar.ali@mailinator.com',
    emrId: 'GA-1985',
    cnpId: 'CNP-DEMO-GA',
    identifier: 'GA-DEMO',
    dateOfBirth: new Date('1985-03-12'),
    partnerFirstName: 'Nimra',
    partnerLastName: 'Jafar',
    partnerEmrId: 'NJ-1988',
    partnerDateOfBirth: new Date('1988-07-24'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  { id: 'p1', name: 'John Smith', firstName: 'John', lastName: 'Smith', email: 'john.smith@mailinator.com', emrId: '11111', cnpId: 'CNP-001', identifier: 'JS-001', additionalContext: 'Type 2 Diabetes, Hypertension', createdAt: new Date(), updatedAt: new Date() },
  { id: 'p2', name: 'Sarah Johnson', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@mailinator.com', emrId: '12345', cnpId: 'CNP-002', identifier: 'SJ-002', createdAt: new Date(), updatedAt: new Date() },
  { id: 'p3', name: 'Michael Chen', firstName: 'Michael', lastName: 'Chen', email: 'michael.chen@gmail.com', emrId: '123455', cnpId: 'CNP-003', identifier: 'MC-003', additionalContext: 'Asthma, Allergies to penicillin', createdAt: new Date(), updatedAt: new Date() },
  { id: 'p4', name: 'Joseph Johnson', firstName: 'Joseph', lastName: 'Johnson', email: 'joseph.johnson@mailinator.com', emrId: '132', cnpId: 'CNP-004', identifier: 'JJ-004', createdAt: new Date(), updatedAt: new Date() },
  { id: 'p5', name: 'Addison Johnson', firstName: 'Addison', lastName: 'Johnson', email: 'addison.johnson@mailinator.com', emrId: '14', cnpId: 'CNP-005', identifier: 'AJ-005', createdAt: new Date(), updatedAt: new Date() },
  { id: 'p6', name: 'Mary Johnson', firstName: 'Mary', lastName: 'Johnson', email: 'mary.j@mailinator.com', emrId: '222222', cnpId: 'CNP-006', identifier: 'MJ-006', createdAt: new Date(), updatedAt: new Date() },
  { id: 'p7', name: 'Emma Williams', firstName: 'Emma', lastName: 'Williams', email: 'emma.w@gmail.com', emrId: '78901', cnpId: 'CNP-007', identifier: 'EW-007', createdAt: new Date(), updatedAt: new Date() },
  { id: 'p8', name: 'Robert Davis', firstName: 'Robert', lastName: 'Davis', email: 'r.davis@outlook.com', emrId: '45678', cnpId: 'CNP-008', identifier: 'RD-008', createdAt: new Date(), updatedAt: new Date() },
];

export const PatientsProvider = ({ children }: { children: ReactNode }) => {
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const savedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
      const version = savedVersion ? parseInt(savedVersion, 10) : 0;
      
      // Reset to defaults if version mismatch (data structure changed)
      if (version < CURRENT_VERSION) {
        localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION.toString());
        return defaultPatients;
      }
      
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((p: Patient) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt)
        }));
      }
    } catch (e) {
      console.error('Failed to load patients:', e);
    }
    return defaultPatients;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
    } catch (e) {
      console.error('Failed to save patients:', e);
    }
  }, [patients]);

  const addPatient = useCallback((patient: Patient) => {
    setPatients(prev => [patient, ...prev]);
  }, []);

  const updatePatient = useCallback((id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
    ));
  }, []);

  const deletePatient = useCallback((id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  }, []);

  const getPatient = useCallback((id: string) => {
    return patients.find(p => p.id === id);
  }, [patients]);

  return (
    <PatientsContext.Provider value={{ patients, addPatient, updatePatient, deletePatient, getPatient }}>
      {children}
    </PatientsContext.Provider>
  );
};

export const usePatients = () => {
  const context = useContext(PatientsContext);
  if (!context) {
    throw new Error('usePatients must be used within PatientsProvider');
  }
  return context;
};

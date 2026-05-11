import { useState, useCallback, useRef, useEffect } from 'react';
import { AttachedFile } from '@/types/attachedFile';
import { toast } from '@/hooks/use-toast';

const MAX_ATTACHMENTS = 15;

const DEMO_EXTRACTED_TEXTS = [
  "Patient History: 45-year-old male with type 2 diabetes, hypertension. Current medications: Metformin 1000mg BID, Lisinopril 10mg daily.",
  "Lab Results: HbA1c: 7.2%, Fasting glucose: 126 mg/dL, Creatinine: 1.1 mg/dL, eGFR: 78 mL/min/1.73m²",
  "Imaging Report: Chest X-ray shows no acute cardiopulmonary abnormality. Heart size normal. Lungs are clear.",
  "Referral Letter: Patient referred for specialist consultation regarding persistent symptoms despite initial treatment.",
];

export const useDocumentOCR = () => {
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const intervalRefs = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      Object.values(intervalRefs.current).forEach(clearInterval);
    };
  }, []);

  const simulateProcessing = useCallback((fileId: string) => {
    // Phase 1: Upload (0-30%)
    let currentProgress = 0;
    const uploadInterval = setInterval(() => {
      currentProgress += Math.random() * 15 + 5;
      if (currentProgress >= 30) {
        currentProgress = 30;
        clearInterval(uploadInterval);
        
        // Transition to processing phase
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, progress: 30, status: 'processing' } : f
        ));
        
        // Phase 2: OCR Processing (30-100%)
        const processInterval = setInterval(() => {
          setFiles(prev => {
            const file = prev.find(f => f.id === fileId);
            if (!file) {
              clearInterval(processInterval);
              return prev;
            }
            
            const newProgress = Math.min(file.progress + Math.random() * 12 + 3, 100);
            
            if (newProgress >= 100) {
              clearInterval(processInterval);
              delete intervalRefs.current[fileId];
              
              // Complete with extracted text
              const randomText = DEMO_EXTRACTED_TEXTS[Math.floor(Math.random() * DEMO_EXTRACTED_TEXTS.length)];
              return prev.map(f => 
                f.id === fileId 
                  ? { ...f, progress: 100, status: 'complete', extractedText: randomText } 
                  : f
              );
            }
            
            return prev.map(f => 
              f.id === fileId ? { ...f, progress: newProgress } : f
            );
          });
        }, 200);
        
        intervalRefs.current[fileId] = processInterval;
      } else {
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, progress: currentProgress } : f
        ));
      }
    }, 150);
    
    intervalRefs.current[fileId] = uploadInterval;
  }, []);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(prev => {
      const remaining = MAX_ATTACHMENTS - prev.length;
      if (remaining <= 0) {
        toast({ title: "You can add 15 attachments at most." });
        return prev;
      }

      const filesToAdd = newFiles.slice(0, remaining);
      if (filesToAdd.length < newFiles.length) {
        toast({ title: "You can add 15 attachments at most." });
      }

      const fileEntries: AttachedFile[] = filesToAdd.map(file => ({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        status: 'uploading' as const,
        progress: 0,
      }));

      // Start processing simulation for each file
      fileEntries.forEach(file => {
        simulateProcessing(file.id);
      });

      return [...prev, ...fileEntries];
    });
  }, [simulateProcessing]);

  const removeFile = useCallback((fileId: string) => {
    // Clear any running interval
    if (intervalRefs.current[fileId]) {
      clearInterval(intervalRefs.current[fileId]);
      delete intervalRefs.current[fileId];
    }
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const retryProcessing = useCallback((fileId: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, status: 'uploading', progress: 0, errorMessage: undefined } 
        : f
    ));
    simulateProcessing(fileId);
  }, [simulateProcessing]);

  const clearAllFiles = useCallback(() => {
    Object.values(intervalRefs.current).forEach(clearInterval);
    intervalRefs.current = {};
    setFiles([]);
  }, []);

  const addImportedDocuments = useCallback((docs: { name: string; extractedText?: string }[]) => {
    setFiles(prev => {
      const remaining = MAX_ATTACHMENTS - prev.length;
      if (remaining <= 0) {
        toast({ title: "You can add 15 attachments at most." });
        return prev;
      }
      const docsToAdd = docs.slice(0, remaining);
      if (docsToAdd.length < docs.length) {
        toast({ title: "You can add 15 attachments at most." });
      }
      const entries: AttachedFile[] = docsToAdd.map(d => ({
        id: crypto.randomUUID(),
        name: d.name,
        size: 0,
        status: 'complete' as const,
        progress: 100,
        extractedText: d.extractedText,
      }));
      return [...prev, ...entries];
    });
  }, []);

  return {
    files,
    addFiles,
    removeFile,
    retryProcessing,
    clearAllFiles,
    addImportedDocuments,
  };
};

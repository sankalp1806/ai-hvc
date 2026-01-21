import { useEffect, useRef, useState } from 'react';
import { useCalculatorStore } from '@/store/calculatorStore';

const AUTOSAVE_DELAY = 2000; // 2 seconds debounce

interface AutosaveState {
  lastSaved: Date | null;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
}

export const useAutosave = () => {
  const [state, setState] = useState<AutosaveState>({
    lastSaved: null,
    isSaving: false,
    hasUnsavedChanges: false,
  });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<string>('');
  
  const { projectData, currentStep } = useCalculatorStore();
  
  // Serialize current state for comparison
  const currentData = JSON.stringify({ projectData, currentStep });
  
  useEffect(() => {
    // Check if data has changed
    if (currentData === previousDataRef.current) {
      return;
    }
    
    setState(prev => ({ ...prev, hasUnsavedChanges: true }));
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout for autosave
    timeoutRef.current = setTimeout(() => {
      saveToLocalStorage();
    }, AUTOSAVE_DELAY);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentData]);
  
  const saveToLocalStorage = () => {
    setState(prev => ({ ...prev, isSaving: true }));
    
    try {
      // The store already persists to localStorage via zustand-persist
      // This hook just tracks the save state
      previousDataRef.current = currentData;
      
      setState({
        lastSaved: new Date(),
        isSaving: false,
        hasUnsavedChanges: false,
      });
    } catch (error) {
      console.error('Autosave failed:', error);
      setState(prev => ({ ...prev, isSaving: false }));
    }
  };
  
  // Save on window blur/close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.hasUnsavedChanges) {
        saveToLocalStorage();
        e.preventDefault();
        e.returnValue = '';
      }
    };
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && state.hasUnsavedChanges) {
        saveToLocalStorage();
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [state.hasUnsavedChanges]);
  
  const formatLastSaved = () => {
    if (!state.lastSaved) return null;
    
    const now = new Date();
    const diff = Math.floor((now.getTime() - state.lastSaved.getTime()) / 1000);
    
    if (diff < 5) return 'Just now';
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    return state.lastSaved.toLocaleTimeString();
  };
  
  return {
    ...state,
    formatLastSaved,
    saveNow: saveToLocalStorage,
  };
};

export const checkForRecovery = (): boolean => {
  try {
    const stored = localStorage.getItem('ai-roi-calculator-storage');
    if (!stored) return false;
    
    const data = JSON.parse(stored);
    const hasData = data.state?.projectData?.projectName || 
                    data.state?.projectData?.costs?.length > 0 ||
                    data.state?.projectData?.tangibleBenefits?.length > 0;
    
    return hasData;
  } catch {
    return false;
  }
};

export const clearRecoveryData = () => {
  try {
    localStorage.removeItem('ai-roi-calculator-storage');
  } catch (error) {
    console.error('Failed to clear recovery data:', error);
  }
};

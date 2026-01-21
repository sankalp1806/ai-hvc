import { useAutosave } from '@/hooks/useAutosave';
import { Cloud, CloudOff, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AutosaveIndicator = () => {
  const { isSaving, hasUnsavedChanges, formatLastSaved } = useAutosave();
  const lastSaved = formatLastSaved();
  
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <AnimatePresence mode="wait">
        {isSaving ? (
          <motion.div
            key="saving"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5"
          >
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Saving...</span>
          </motion.div>
        ) : hasUnsavedChanges ? (
          <motion.div
            key="unsaved"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5"
          >
            <CloudOff className="h-3 w-3" />
            <span>Unsaved changes</span>
          </motion.div>
        ) : lastSaved ? (
          <motion.div
            key="saved"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 text-success"
          >
            <Check className="h-3 w-3" />
            <span>Saved {lastSaved}</span>
          </motion.div>
        ) : (
          <motion.div
            key="ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5"
          >
            <Cloud className="h-3 w-3" />
            <span>Auto-save enabled</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

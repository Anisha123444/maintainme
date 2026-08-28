import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
  isBottomSheetOnMobile?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
  isBottomSheetOnMobile = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={
              isBottomSheetOnMobile
                ? { y: '100%', opacity: 0 }
                : { scale: 0.95, opacity: 0 }
            }
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={
              isBottomSheetOnMobile
                ? { y: '100%', opacity: 0 }
                : { scale: 0.95, opacity: 0 }
            }
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative w-full ${maxWidth} bg-theme-card border border-theme-border rounded-t-3xl sm:rounded-3xl shadow-stationery p-5 sm:p-6 z-10 max-h-[90vh] overflow-y-auto`}
          >
            {/* Mobile Drag Indicator */}
            {isBottomSheetOnMobile && (
              <div className="w-12 h-1.5 bg-theme-border rounded-full mx-auto mb-4 sm:hidden" />
            )}

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-theme-border mb-4">
              {title && typeof title === 'string' ? (
                <h3 className="text-xl font-bold font-sans text-theme-text">{title}</h3>
              ) : (
                title
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-theme-muted hover:text-theme-text hover:bg-theme-highlight rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

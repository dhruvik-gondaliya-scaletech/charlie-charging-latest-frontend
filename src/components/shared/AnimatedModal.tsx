'use client';

import * as React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const overlayVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    transition: {
      duration: 0.15,
      ease: 'easeIn',
    },
  },
};

export interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  footer?: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full mx-4',
};

export function AnimatedModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
  className,
  overlayClassName,
  contentClassName,
  headerClassName,
  footerClassName,
}: AnimatedModalProps) {
  React.useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          aria-describedby={description ? 'modal-description' : undefined}
        >
          <motion.div
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(
              'fixed inset-0 bg-black/50 backdrop-blur-sm',
              overlayClassName
            )}
            onClick={handleOverlayClick}
            aria-hidden="true"
          />

          <motion.div
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(
              'relative z-50 w-full rounded-lg border bg-background shadow-lg',
              sizeClasses[size],
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={cn(
                'flex max-h-[90vh] flex-col',
                contentClassName
              )}
            >
              {(title || description || showCloseButton) && (
                <div
                  className={cn(
                    'flex items-start justify-between border-b p-6',
                    headerClassName
                  )}
                >
                  <div className="flex-1 space-y-1">
                    {title && (
                      <h2
                        id="modal-title"
                        className="text-lg font-semibold leading-none tracking-tight"
                      >
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p
                        id="modal-description"
                        className="text-sm text-muted-foreground"
                      >
                        {description}
                      </p>
                    )}
                  </div>
                  {showCloseButton && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={onClose}
                      aria-label="Close modal"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-6">
                {children}
              </div>

              {footer && (
                <div
                  className={cn(
                    'flex flex-col-reverse gap-2 border-t p-6 sm:flex-row sm:justify-end',
                    footerClassName
                  )}
                >
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

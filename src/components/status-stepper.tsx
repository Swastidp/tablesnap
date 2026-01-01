"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scan, Columns, Braces, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  { id: 1, label: "Scanning Image...", shortLabel: "SCAN", icon: <Scan className="w-5 h-5" /> },
  { id: 2, label: "Detecting Columns...", shortLabel: "DETECT", icon: <Columns className="w-5 h-5" /> },
  { id: 3, label: "Structuring JSON...", shortLabel: "STRUCT", icon: <Braces className="w-5 h-5" /> },
  { id: 4, label: "Ready!", shortLabel: "DONE", icon: <CheckCircle2 className="w-5 h-5" /> },
];

// Mechanical spring config
const mechanicalSpring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

interface StatusStepperProps {
  isProcessing: boolean;
  onComplete?: () => void;
}

// LED Indicator for each step
function StepLED({ active, completed }: { active: boolean; completed: boolean }) {
  return (
    <div 
      className={cn(
        "w-3 h-3 rounded-full transition-all duration-300",
        completed && "bg-success shadow-led-green",
        active && !completed && "bg-accent shadow-led-red animate-pulse",
        !active && !completed && "bg-muted shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)]"
      )}
    />
  );
}

export function StatusStepper({ isProcessing, onComplete }: StatusStepperProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (!isProcessing) {
      setCurrentStep(0);
      setCompletedSteps([]);
      return;
    }

    const stepDurations = [1200, 1500, 1800, 500];
    let stepIndex = 0;

    const advanceStep = () => {
      if (stepIndex < steps.length - 1) {
        setCompletedSteps((prev) => [...prev, steps[stepIndex].id]);
        stepIndex++;
        setCurrentStep(stepIndex);
        
        if (stepIndex < steps.length) {
          setTimeout(advanceStep, stepDurations[stepIndex]);
        }
      } else {
        setCompletedSteps((prev) => [...prev, steps[stepIndex].id]);
        if (onComplete) {
          setTimeout(onComplete, 500);
        }
      }
    };

    setCurrentStep(0);
    setTimeout(advanceStep, stepDurations[0]);

    return () => {};
  }, [isProcessing, onComplete]);

  if (!isProcessing && completedSteps.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={mechanicalSpring}
      className="w-full max-w-xl mx-auto"
    >
      {/* Industrial Processing Unit */}
      <div className="relative bg-chassis rounded-2xl shadow-neu-card overflow-hidden">
        {/* Corner screws */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-2xl z-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 14px 14px, rgba(0,0,0,0.12) 2px, transparent 3px),
              radial-gradient(circle at calc(100% - 14px) 14px, rgba(0,0,0,0.12) 2px, transparent 3px),
              radial-gradient(circle at 14px calc(100% - 14px), rgba(0,0,0,0.12) 2px, transparent 3px),
              radial-gradient(circle at calc(100% - 14px) calc(100% - 14px), rgba(0,0,0,0.12) 2px, transparent 3px)
            `
          }}
        />

        {/* Header with status */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-shadow/30">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-led-red animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted">
              PROCESSING UNIT
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-accent uppercase tracking-wider">
              {steps[currentStep]?.shortLabel || "IDLE"}
            </span>
            {/* Vent slots */}
            <div className="flex gap-1 ml-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 w-1 rounded-full bg-muted shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15)]" />
              ))}
            </div>
          </div>
        </div>

        {/* Progress bar - Industrial pipe style */}
        <div className="px-5 py-4">
          <div className="relative h-4 bg-muted rounded-full shadow-neu-recessed overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-accent to-accent-hover rounded-full"
              initial={{ width: "0%" }}
              animate={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }}
              style={{
                boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), 0 0 10px rgba(255, 71, 87, 0.4)'
              }}
            />
            {/* Pipe highlights */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-white/20 to-transparent rounded-t-full" />
            </div>
          </div>
        </div>

        {/* Step indicators with connector pipes */}
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = completedSteps.includes(step.id);

              return (
                <div key={step.id} className="flex items-center">
                  {/* Step node */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1, ...mechanicalSpring }}
                    className="flex flex-col items-center"
                  >
                    {/* Icon housing */}
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                        isCompleted
                          ? "bg-success text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                          : isActive
                          ? "bg-accent text-white shadow-[0_0_15px_rgba(255,71,87,0.5)]"
                          : "bg-chassis shadow-neu-button text-ink-muted"
                      )}
                    >
                      <AnimatePresence mode="wait">
                        {isActive && !isCompleted ? (
                          <motion.div
                            key="loading"
                            initial={{ scale: 0, rotate: 0 }}
                            animate={{ scale: 1, rotate: 360 }}
                            exit={{ scale: 0 }}
                            transition={{
                              scale: { duration: 0.2 },
                              rotate: {
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              },
                            }}
                          >
                            <Loader2 className="w-5 h-5" />
                          </motion.div>
                        ) : isCompleted ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={mechanicalSpring}
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="icon"
                            initial={{ scale: 0.8, opacity: 0.5 }}
                            animate={{ scale: 1, opacity: 1 }}
                          >
                            {step.icon}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Step LED and label */}
                    <div className="mt-2 flex flex-col items-center gap-1">
                      <StepLED active={isActive} completed={isCompleted} />
                      <span
                        className={cn(
                          "text-[9px] font-mono font-bold uppercase tracking-wider transition-colors duration-300",
                          isCompleted
                            ? "text-success"
                            : isActive
                            ? "text-accent"
                            : "text-ink-muted/50"
                        )}
                      >
                        {step.shortLabel}
                      </span>
                    </div>
                  </motion.div>

                  {/* Connector pipe */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block flex-1 mx-2 relative">
                      <div className="h-3 rounded-full bg-muted shadow-[inset_0_2px_4px_rgba(0,0,0,0.15),inset_0_-1px_2px_rgba(255,255,255,0.5)]">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-success/80 to-success"
                          initial={{ width: "0%" }}
                          animate={{
                            width: completedSteps.includes(step.id) ? "100%" : "0%",
                          }}
                          transition={{ duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }}
                          style={{
                            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3)'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Current step detail */}
        <div className="px-5 py-3 bg-muted/50 border-t border-shadow/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ink text-embossed">
              {steps[currentStep]?.label}
            </span>
            {/* Animated processing dots */}
            {currentStep < steps.length - 1 && (
              <motion.div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-accent"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

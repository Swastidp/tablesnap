"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scan, Columns, Braces, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  label: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  { id: 1, label: "Scanning Image...", icon: <Scan className="w-5 h-5" /> },
  { id: 2, label: "Detecting Columns...", icon: <Columns className="w-5 h-5" /> },
  { id: 3, label: "Structuring JSON...", icon: <Braces className="w-5 h-5" /> },
  { id: 4, label: "Ready!", icon: <CheckCircle2 className="w-5 h-5" /> },
];

interface StatusStepperProps {
  isProcessing: boolean;
  onComplete?: () => void;
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

    // Simulate step progression
    const stepDurations = [1200, 1500, 1800, 500]; // Different durations for each step
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
        // Final step - mark as complete
        setCompletedSteps((prev) => [...prev, steps[stepIndex].id]);
        if (onComplete) {
          setTimeout(onComplete, 500);
        }
      }
    };

    setCurrentStep(0);
    setTimeout(advanceStep, stepDurations[0]);

    return () => {
      // Cleanup handled by isProcessing change
    };
  }, [isProcessing, onComplete]);

  if (!isProcessing && completedSteps.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary-200 p-6 shadow-lg">
        {/* Progress bar */}
        <div className="relative h-1.5 bg-primary-100 rounded-full mb-6 overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-accent-400 to-accent-600 rounded-full"
            initial={{ width: "0%" }}
            animate={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = completedSteps.includes(step.id);
            const isPending = index > currentStep;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300",
                  isActive && "bg-accent-50 border border-accent-200",
                  isCompleted && !isActive && "opacity-60"
                )}
              >
                {/* Icon container */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300",
                    isCompleted
                      ? "bg-success text-white"
                      : isActive
                      ? "bg-accent-500 text-white"
                      : "bg-primary-100 text-primary-400"
                  )}
                >
                  <AnimatePresence mode="wait">
                    {isActive && !isCompleted ? (
                      <motion.div
                        key="loading"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotate: 360 }}
                        exit={{ scale: 0 }}
                        transition={{
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

                {/* Label */}
                <span
                  className={cn(
                    "font-medium transition-colors duration-300",
                    isCompleted
                      ? "text-success"
                      : isActive
                      ? "text-accent-700"
                      : "text-primary-400"
                  )}
                >
                  {step.label}
                </span>

                {/* Animated dots for active step */}
                {isActive && !isCompleted && (
                  <motion.div className="flex gap-1 ml-auto">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-accent-400"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

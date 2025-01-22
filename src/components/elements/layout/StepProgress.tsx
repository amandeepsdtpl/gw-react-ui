import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  description?: string;
  optional?: boolean;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'dots' | 'numbered';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  currentStep,
  orientation = 'horizontal',
  variant = 'default',
  size = 'medium',
  className = '',
}) => {
  const isStepComplete = (index: number) => index < currentStep;
  const isStepCurrent = (index: number) => index === currentStep;

  return (
    <div className={`step-progress step-${orientation} step-${size} ${className}`}>
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={`step ${isStepComplete(index) ? 'complete' : ''} ${
            isStepCurrent(index) ? 'current' : ''
          }`}
        >
          <div className="step-indicator">
            {variant === 'dots' ? (
              <div className="step-dot" />
            ) : variant === 'numbered' ? (
              <div className="step-number">{index + 1}</div>
            ) : (
              <div className="step-icon">
                {isStepComplete(index) ? (
                  <Check size={size === 'small' ? 14 : size === 'large' ? 20 : 16} />
                ) : (
                  index + 1
                )}
              </div>
            )}
            {index < steps.length - 1 && <div className="step-line" />}
          </div>
          <div className="step-content">
            <div className="step-label">
              {step.label}
              {step.optional && (
                <span className="step-optional">(Optional)</span>
              )}
            </div>
            {step.description && (
              <div className="step-description">{step.description}</div>
            )}
          </div>
        </div>
      ))}

      <style jsx>{`
        .step-progress {
          display: flex;
          gap: 1rem;
        }

        .step-vertical {
          flex-direction: column;
        }

        .step {
          flex: 1;
          display: flex;
          gap: 1rem;
        }

        .step-indicator {
          display: flex;
          align-items: center;
          position: relative;
        }

        .step-horizontal .step-indicator {
          flex-direction: row;
          flex: 1;
        }

        .step-vertical .step-indicator {
          flex-direction: column;
        }

        .step-icon,
        .step-dot,
        .step-number {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--border-color);
          color: var(--text-secondary);
          border-radius: 50%;
          transition: var(--transition);
          z-index: 1;
        }

        .step-small .step-icon,
        .step-small .step-dot,
        .step-small .step-number {
          width: 24px;
          height: 24px;
          font-size: 0.875rem;
        }

        .step-medium .step-icon,
        .step-medium .step-dot,
        .step-medium .step-number {
          width: 32px;
          height: 32px;
          font-size: 1rem;
        }

        .step-large .step-icon,
        .step-large .step-dot,
        .step-large .step-number {
          width: 40px;
          height: 40px;
          font-size: 1.125rem;
        }

        .step-dot {
          width: 12px;
          height: 12px;
        }

        .step-line {
          flex: 1;
          background-color: var(--border-color);
          transition: var(--transition);
        }

        .step-horizontal .step-line {
          height: 2px;
          margin: 0 0.5rem;
        }

        .step-vertical .step-line {
          width: 2px;
          margin: 0.5rem 0;
          position: absolute;
          top: 100%;
          bottom: -1rem;
          left: 50%;
          transform: translateX(-50%);
        }

        .step.complete .step-icon,
        .step.complete .step-dot,
        .step.complete .step-number,
        .step.current .step-icon,
        .step.current .step-dot,
        .step.current .step-number {
          background-color: var(--primary-color);
          color: white;
        }

        .step.complete .step-line {
          background-color: var(--primary-color);
        }

        .step-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .step-label {
          font-weight: 500;
          color: var(--text-primary);
        }

        .step-optional {
          margin-left: 0.5rem;
          font-weight: normal;
          color: var(--text-secondary);
          font-size: 0.875em;
        }

        .step-description {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};
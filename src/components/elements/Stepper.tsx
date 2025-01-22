import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  description?: string;
  optional?: boolean;
}

interface StepperProps {
  steps: Step[];
  activeStep: number;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'dots' | 'progress';
  onChange?: (step: number) => void;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  activeStep,
  orientation = 'horizontal',
  variant = 'default',
  onChange,
  className = '',
}) => {
  const isStepComplete = (index: number) => index < activeStep;
  const isStepActive = (index: number) => index === activeStep;
  const isStepClickable = (index: number) => onChange && index <= activeStep;

  const renderStepIcon = (index: number) => {
    if (isStepComplete(index)) {
      return (
        <div className="stepper-icon completed">
          <Check size={16} />
        </div>
      );
    }

    if (variant === 'dots') {
      return <div className="stepper-dot" />;
    }

    return <div className="stepper-icon">{index + 1}</div>;
  };

  const renderStepContent = (step: Step, index: number) => (
    <div
      className={`stepper-content ${isStepClickable(index) ? 'clickable' : ''}`}
      onClick={() => isStepClickable(index) && onChange?.(index)}
    >
      {renderStepIcon(index)}
      <div className="stepper-text">
        <div className="stepper-label">
          {step.label}
          {step.optional && (
            <span className="stepper-optional">(Optional)</span>
          )}
        </div>
        {step.description && (
          <div className="stepper-description">{step.description}</div>
        )}
      </div>
    </div>
  );

  const renderProgressBar = () => {
    if (variant !== 'progress') return null;
    
    const progress = (activeStep / (steps.length - 1)) * 100;
    return (
      <div className="stepper-progress-track">
        <div
          className="stepper-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  };

  return (
    <div
      className={`stepper stepper-${orientation} stepper-${variant} ${className}`}
    >
      {renderProgressBar()}
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div
            className={`stepper-step ${
              isStepComplete(index) ? 'completed' : ''
            } ${isStepActive(index) ? 'active' : ''}`}
          >
            {renderStepContent(step, index)}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`stepper-connector ${
                isStepComplete(index) ? 'completed' : ''
              }`}
            >
              <span className="stepper-line" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
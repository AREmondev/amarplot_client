import { useFormContext } from 'react-hook-form';

interface Step {
  id: string;
  title: string;
  fields: string[];
  summary: (data: any) => string;
}

interface StepNavigatorProps {
  steps: Step[];
  currentStep: string;
  onStepClick: (stepId: string) => void;
}

export const StepNavigator = ({ steps, currentStep, onStepClick }: StepNavigatorProps) => {
  const { watch, formState: { errors, dirtyFields } } = useFormContext();
  const formData = watch();

  const isStepValid = (step: Step) => {
    return step.fields.every(field => {
      const fieldError = errors[field.split('.')[0]];
      return !fieldError;
    });
  };

  const isStepDirty = (step: Step) => {
    return step.fields.some(field => {
      const fieldName = field.split('.')[0];
      return !!dirtyFields[fieldName];
    });
  };

  return (
    <nav className="space-y-2 sticky top-24">
      {steps.map((step) => {
        const isActive = step.id === currentStep;
        const isValid = isStepValid(step);
        const isDirty = isStepDirty(step);
        const summaryText = step.summary(formData);

        const getIndicatorClass = () => {
          if (!isDirty) {
            return 'bg-gray-300';
          }
          return isValid ? 'bg-green-500' : 'bg-red-500';
        };

        return (
          <button
            type="button"
            key={step.id}
            onClick={() => onStepClick(step.id)}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-start transition-all ${
              isActive
                ? 'bg-blue-50 border-l-4 border-blue-500'
                : 'hover:bg-gray-50'
            }`}>
            <div className={`w-2.5 h-2.5 rounded-full mr-4 mt-1.5 ${getIndicatorClass()}`} />
            <div>
              <p className={`font-semibold ${isActive ? 'text-blue-600' : 'text-gray-800'}`}>{step.title}</p>
              {summaryText && <p className="text-xs text-gray-500 mt-1">{summaryText}</p>}
            </div>
          </button>
        );
      })}
    </nav>
  );
};

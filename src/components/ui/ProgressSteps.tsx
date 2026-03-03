'use client'

interface ProgressStepsProps {
  steps: string[]
  currentStep: number
}

export default function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  i < currentStep
                    ? 'bg-green-500 text-white'
                    : i === currentStep
                    ? 'bg-hustle-blue text-white'
                    : 'bg-gray-200 text-hustle-muted'
                }`}
              >
                {i < currentStep ? '✓' : i + 1}
              </div>
              <span
                className={`text-xs mt-1 text-center hidden sm:block ${
                  i <= currentStep ? 'text-hustle-dark font-medium' : 'text-hustle-muted'
                }`}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-colors ${
                  i < currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

import "./RegistrationProgress.scss";

const REGISTRATION_STEPS = ["Account", "Personal details", "Address"] as const;

type RegistrationProgressProps = {
  currentStep: number;
};

export function RegistrationProgress({ currentStep }: RegistrationProgressProps) {
  return (
    <nav aria-label="Registration progress" className="registration-progress">
      <ol>
        {REGISTRATION_STEPS.map((step, index) => {
          const state = index < currentStep ? "completed" : index === currentStep ? "current" : "upcoming";

          return (
            <li
              aria-current={state === "current" ? "step" : undefined}
              className={`registration-progress__${state}`}
              key={step}
            >
              <span aria-hidden="true" className="registration-progress__number">
                {index + 1}
              </span>
              <span className="registration-progress__label">{step}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

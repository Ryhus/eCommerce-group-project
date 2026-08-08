import { useTranslation } from "react-i18next";

import "./RegistrationProgress.scss";

type RegistrationProgressProps = {
  currentStep: number;
};

export function RegistrationProgress({ currentStep }: RegistrationProgressProps) {
  const { t } = useTranslation("common");
  const registrationSteps = [
    t("registrationProgress.account"),
    t("registrationProgress.personalDetails"),
    t("registrationProgress.address"),
  ];

  return (
    <nav aria-label={t("registrationProgress.navigation")} className="registration-progress">
      <ol>
        {registrationSteps.map((step, index) => {
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

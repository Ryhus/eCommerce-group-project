import { useTranslation } from "react-i18next";

import "./ActivityStrip.scss";

const activityKeys = [
  "activities.run",
  "activities.train",
  "activities.play",
  "activities.recover",
  "activities.explore",
] as const;

const ActivityStrip = () => {
  const { t } = useTranslation("common");

  return (
    <div aria-label={t("activities.region")} className="activity-strip" role="group">
      <ul>
        {activityKeys.map((activityKey) => (
          <li key={activityKey}>{t(activityKey)}</li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityStrip;

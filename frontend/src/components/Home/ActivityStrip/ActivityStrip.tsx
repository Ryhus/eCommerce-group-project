import "./ActivityStrip.scss";

const activities = ["Run", "Train", "Play", "Recover", "Explore"];

const ActivityStrip = () => {
  return (
    <div aria-label="Sport Gear activities" className="activity-strip" role="group">
      <ul>
        {activities.map((activity) => (
          <li key={activity}>{activity}</li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityStrip;

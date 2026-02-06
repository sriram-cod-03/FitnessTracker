const SmartMessages = ({
  remainingCalories,
  remainingProtein,
  remainingFiber,
}) => {
  return (
    <div className="dashboard-card smart-card mt-3">
      <h5 className="mb-3">🧠 Smart Suggestions</h5>

      {/* Calories */}
      {remainingCalories > 0 ? (
        <p className="text-success">
          ✅ You can eat <strong>{remainingCalories}</strong> kcal more today
        </p>
      ) : (
        <p className="text-danger">
          🚨 You exceeded your calorie limit
        </p>
      )}

      {/* Protein */}
      {remainingProtein > 0 ? (
        <p className="text-warning">
          ⚠️ Protein intake is low by{" "}
          <strong>{remainingProtein}</strong> g
        </p>
      ) : (
        <p className="text-success">
          🎉 Protein goal achieved!
        </p>
      )}

      {/* Fiber */}
      {remainingFiber > 0 ? (
        <p className="text-warning">
          🥦 Fiber intake is low by{" "}
          <strong>{remainingFiber}</strong> g
        </p>
      ) : (
        <p className="text-success">
          🌟 Fiber goal achieved!
        </p>
      )}
    </div>
  );
};

export default SmartMessages;

const ProgressBar = ({ label, current = 0, target = 0, unit = "" }) => {
  const percent =
    target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

  return (
    <div style={{ marginBottom: "14px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "14px",
          marginBottom: "6px",
        }}
      >
        <span>{label}</span>
        <span>
          {current}/{target} {unit}
        </span>
      </div>

      <div
        style={{
          background: "#111",
          height: "10px",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background:
              percent >= 100 ? "#00c853" : "#00ffcc",
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

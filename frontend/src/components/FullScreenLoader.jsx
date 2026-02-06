import "../styles/fullscreenLoader.css";

const FullScreenLoader = ({
  title = "Loading...",
  subtitle = "Preparing your fitness data 💪",
}) => {
  return (
    <div className="loader-overlay">
      <div className="loader-box">
        <div className="loader-ring"></div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
};

export default FullScreenLoader;

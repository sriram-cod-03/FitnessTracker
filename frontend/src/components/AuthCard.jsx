import "../styles/auth.css";

const AuthCard = ({ title, children, footer }) => {
  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h3 className="text-center mb-3">{title}</h3>
        {children}
        {footer && <div className="text-center mt-3">{footer}</div>}
      </div>
    </div>
  );
};

export default AuthCard;

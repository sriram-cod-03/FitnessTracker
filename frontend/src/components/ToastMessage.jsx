const ToastMessage = ({ message, type = "error", onClose }) => {
  return (
    <div
      className={`toast-message ${type}`}
      onClick={onClose}
    >
      {message}
    </div>
  );
};

export default ToastMessage;

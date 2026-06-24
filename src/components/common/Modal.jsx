import Ic from "./Ic";

const Modal = ({ title, onClose, children, wide }) => (
  <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className={`modal${wide ? " modal-lg" : ""}`}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div className="ff-display fw-800" style={{ fontSize: 17 }}>{title}</div>
        <button className="btn btn-ghost btn-icon" onClick={onClose}><Ic name="x" size={15} /></button>
      </div>
      {children}
    </div>
  </div>
);

export default Modal;

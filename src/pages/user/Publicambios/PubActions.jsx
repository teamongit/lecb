// components/PubActions.jsx
import { Trash } from "react-bootstrap-icons";

export const PubActions = ({ onBorrarPublicacion }) => (
  <div className="d-flex align-items-center">
    <Trash className="text-danger" role="button" onClick={onBorrarPublicacion} />
  </div>
);
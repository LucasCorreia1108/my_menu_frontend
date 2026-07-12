import { Navigate } from "react-router-dom";
import { getStoredAuth } from "../../utils/authStorage";

export default function RequireAuth({ children }) {
  if (!getStoredAuth()) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

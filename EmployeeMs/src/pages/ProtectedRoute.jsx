import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../AuthContext/AuthContext";

function ProtectedRoute({ children }) {
  const navigator = useNavigate();
  const { isLoggedIn } = useAuth();
  useEffect(
    function () {
      if (!isLoggedIn) {
        navigator("/");
      }
    },
    [isLoggedIn, navigator]
  );
  return isLoggedIn ? children : null;
}

export default ProtectedRoute;

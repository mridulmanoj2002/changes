import React from "react";
import { Route, Navigate } from "react-router-dom";

const PrivateRoute = ({ element, path }) => {
  // Implement your authentication logic here
  const isAuthenticated = true; // Replace this with your actual authentication check

  return isAuthenticated ? (
    <Route path={path} element={element} />
  ) : (
    <Navigate to="/start" />
  );
};

export default PrivateRoute;

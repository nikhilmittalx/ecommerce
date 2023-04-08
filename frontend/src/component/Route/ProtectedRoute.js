import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route } from "react-router-dom";

// const ProtectedRoute = ({ isAdmin, element: element, ...rest }) => {
//   const { loading, isAuthenticated, user } = useSelector((state) => state.user);

//   return (
//     <Fragment>

      {/* {loading === false && (
        <Route
          {...rest}
          render={(props) => {
            if (isAuthenticated === false) {
              return <Navigate to="/login" />;
            }

            if (isAdmin === true && user.role !== "admin") {
              return <Navigate to="/login" />;
            }

            return <element {...props} />;
          }}
        />
      )} */}
//     </Fragment>
//   );
// };

const ProtectedRoute = ({ children }) => {
    const { loading, isAuthenticated, user } = useSelector((state) => state.user);
    // const authed = this.state.isAuth() // isauth() returns true or false based on localStorage
    
    return isAuthenticated ? children : <Navigate to="/login" />;
  }

export default ProtectedRoute;

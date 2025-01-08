import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function SignUpLoginProtectRoutes({ element: Component, ...rest }) {
  const { isAuthenticated } = useSelector((state) => state.userAuth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/adminHome")
    }
  });

  if (!isAuthenticated) {
    return <Component {...rest} />;
  }

  return null;
}

export default SignUpLoginProtectRoutes;
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import useToast from "../../Hooks/UseToast";

function AuthProtectionRoutes({ element: Component, ...rest }) {
    const { isAuthenticated } = useSelector((state) => state.userAuth);
    const navigate = useNavigate();
    const showToast = useToast();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/");
            showToast("Login required", "error");
        }
    }, [isAuthenticated, navigate]);

    if (isAuthenticated) {
        return <Component {...rest} />;
    }

    return null;
}

export default AuthProtectionRoutes;
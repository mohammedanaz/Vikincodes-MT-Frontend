import { useSnackbar } from "notistack";

const useToast = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showToast = (message, variant = "default", duration = 2000) => {
    console.log("From useToast Message is:", message);

    const variantStyles = {
      success: {
        backgroundColor: "#4caf50",
      },
      error: {
        backgroundColor: "#f44336",
      },
      default: {
        backgroundColor: "#333",
      },
    };

    enqueueSnackbar(message, {
      variant,
      style: variantStyles[variant] || variantStyles.default,
      anchorOrigin: {
        vertical: "top",
        horizontal: "center",
      },
      autoHideDuration: duration,
    });
  };

  return showToast;
};

export default useToast;
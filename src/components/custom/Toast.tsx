import { toast, TypeOptions } from "react-toastify";


const Toast = (type: TypeOptions, message: string) => {
    return toast(message, {
        type: type,
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    })
}

export default Toast;
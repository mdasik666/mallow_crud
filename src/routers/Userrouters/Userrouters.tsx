import { Loading } from "components/Loading/Laoding";
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import UserNotfound from "components/Notfound/NotFound";
const Login = lazy(() => import("pages/User/Login/Login"));
const Userlist = lazy(() => import("pages/User/Userlist/Userlist"));

const Userroute = () => {
    return (
        <Routes>
            <Route path="/" element={
                <Suspense fallback={<Loading />}>
                    <Login />
                </Suspense>} />
            <Route path="/userlist" element={
                <Suspense fallback={<Loading />}>
                    <Userlist />
                </Suspense>} />
            <Route path="*" element={<UserNotfound />} />
        </Routes>
    );
}

export default Userroute;
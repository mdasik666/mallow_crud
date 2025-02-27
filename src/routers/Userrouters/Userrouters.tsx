import { FallbackLoading } from "components/Fallback/Fallback";
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import UserNotfound from "components/Notfound/NotFound";
const Login = lazy(() => import("pages/User/Login/Login"));
const Userlist = lazy(() => import("pages/User/Userlist/Userlist"));

const Userroute = () => {
    return (
        <Routes>
            <Route path="/" element={
                <Suspense fallback={<FallbackLoading />}>
                    <Login />
                </Suspense>} />
            <Route path="/userlist" element={
                <Suspense fallback={<FallbackLoading />}>
                    <Userlist />
                </Suspense>} />
            <Route path="*" element={<UserNotfound />} />
        </Routes>
    );
}

export default Userroute;
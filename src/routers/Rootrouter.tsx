import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Userroute from "./Userrouters/Userrouters";
import { Suspense, lazy } from "react";
import { FallbackLoading } from "components/Fallback/Fallback";
const Login = lazy(() => import("pages/User/Login/Login"))

const Rootrouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/*" element={
                    <Suspense fallback={<FallbackLoading />}>
                        <Userroute />
                    </Suspense>
                } />
            </Routes>
        </Router>
    );
}

export default Rootrouter;
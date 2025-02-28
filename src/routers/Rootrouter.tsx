import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Userroute from "./Userrouters/Userrouters";
import { Suspense } from "react";
import { Loading } from "components/Loading/Laoding";

const Rootrouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/*" element={
                    <Suspense fallback={<Loading />}>
                        <Userroute />
                    </Suspense>
                } />
            </Routes>
        </Router>
    );
}

export default Rootrouter;
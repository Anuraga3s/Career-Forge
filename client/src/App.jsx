import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ResumeUpload from "./pages/ResumeUpload";
import Dashboard from "./pages/Dashboard";
import JDCompare from "./pages/JDCompare";
import MockInterview from "./pages/MockInterview";
import RoadmapDetails from "./pages/RoadmapDetails";
import QuizPage from "./pages/QuizPage";
import QuizHistory from "./pages/QuizHistory";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import Legal from "./pages/Legal";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PROTECTED APP ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="profile" element={<Profile />} />
          <Route index element={<Dashboard />} />
          <Route path="resume" element={<ResumeUpload />} />
          <Route path="jd-compare" element={<JDCompare />} />
          <Route path="mock-interview" element={<MockInterview />} />
          <Route path="roadmap/:id" element={<RoadmapDetails />} />
          <Route path="quiz/:id" element={<QuizPage />} />
          <Route path="quiz-history" element={<QuizHistory />} />
          <Route path="/legal" element={<Legal />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

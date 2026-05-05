import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOTP from "./pages/VerifyOTP";
import AdminDashboard   from "./pages/admin/AdminDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";

// Protect routes - redirect to login if not authenticated
function PrivateRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user  = JSON.parse(localStorage.getItem("user") || "{}");
  if (!token) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/admin"   element={<PrivateRoute role="Admin">  <AdminDashboard />   </PrivateRoute>} />
        <Route path="/teacher" element={<PrivateRoute role="Teacher"><TeacherDashboard /></PrivateRoute>} />
        <Route path="/student" element={<PrivateRoute role="Student"><StudentDashboard /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

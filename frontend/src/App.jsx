import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext";

import Splash from "./pages/Splash";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OtpVerify from "./pages/OtpVerify";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Search from "./pages/Search";
import ListingDetails from "./pages/ListingDetails";
import PostListing from "./pages/PostListing";
import Messages from "./pages/Messages";
import Conversation from "./pages/Conversation";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Premium from "./pages/Premium";
import Report from "./pages/Report";
import Admin from "./pages/Admin";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import AboutNetta from "./pages/AboutNetta";
import ContactInfo from "./pages/ContactInfo";
import HelpSupport from "./pages/HelpSupport";

export default function App() {
  return (
            <AuthProvider>
      <ThemeProvider>
      <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<OtpVerify />} />

          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/listing/:id" element={<ProtectedRoute><ListingDetails /></ProtectedRoute>} />
          <Route path="/post" element={<ProtectedRoute><PostListing /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/messages/:id" element={<ProtectedRoute><Conversation /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/premium" element={<ProtectedRoute><Premium /></ProtectedRoute>} />
          <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
                    <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/settings/about" element={<ProtectedRoute><AboutNetta /></ProtectedRoute>} />
          <Route path="/settings/contact" element={<ProtectedRoute><ContactInfo /></ProtectedRoute>} />
          <Route path="/settings/help" element={<ProtectedRoute><HelpSupport /></ProtectedRoute>} />
        </Routes>
           </BrowserRouter>
            </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
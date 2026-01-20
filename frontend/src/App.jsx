import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Jobs from './pages/Jobs';
import CompanyReviews from './pages/CompanyReviews';
import SalaryGuide from './pages/SalaryGuide';
import JobCreate from './pages/JobCreate';
import JobApplications from './pages/JobApplications';
import Notifications from './pages/Notifications';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="companies" element={<CompanyReviews />} />
        <Route path="salaries" element={<SalaryGuide />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Common protected routes if any */}
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
          <Route path="dashboard/recruiter" element={<RecruiterDashboard />} />
          <Route path="jobs/create" element={<JobCreate />} />
          <Route path="jobs/:id/applications" element={<JobApplications />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
          <Route path="dashboard/candidate" element={<CandidateDashboard />} />
          {/* Add My Applications route here */}
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

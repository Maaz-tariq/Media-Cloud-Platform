import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; 
import ProtectedRoute from './components/ProtectedRoute';
import ShareView from './pages/ShareView';
import ErrorPage from './components/ErrorPage';

function App() {
  return (
    <ErrorPage>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route path="/share/:token" element={<ShareView />} />
      </Routes>
    </Router>
   </ErrorPage>

  );
}

export default App;
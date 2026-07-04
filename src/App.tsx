import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './viewmodel/auth/AuthViewModel';
import { LoginPage } from './app/pages/auth/LoginPage';
import { PatientsPage } from './app/pages/dashboard/PatientsPage';
import { PatientDietPage } from './app/pages/diet/PatientDietPage';
import { ProtectedRoute } from './app/components/ProtectedRoute';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard/pacientes"
            element={
              <ProtectedRoute allowedRole="nutricionista">
                <PatientsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dieta"
            element={
              <ProtectedRoute allowedRole="paciente">
                <PatientDietPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './viewmodel/auth/AuthViewModel';
import { LoginPage } from './app/pages/auth/LoginPage';
import { PatientsPage } from './app/pages/dashboard/PatientsPage';
import { PatientDietPage } from './app/pages/diet/PatientDietPage';
import { ProtectedRoute } from './app/components/ProtectedRoute';
import { PatientListPage } from './app/pages/pacientes/PatientListPage';
import { PatientFormPage } from './app/pages/pacientes/PatientFormPage';
import { PatientProfilePage } from './app/pages/pacientes/PatientProfilePage';

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
                <PatientListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/pacientes/novo"
            element={
              <ProtectedRoute allowedRole="nutricionista">
                <PatientFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/pacientes/:id"
            element={
              <ProtectedRoute allowedRole="nutricionista">
                <PatientProfilePage />
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

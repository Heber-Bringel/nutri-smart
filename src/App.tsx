import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './viewmodel/auth/AuthViewModel';
import { LoginPage } from './app/pages/auth/LoginPage';
import { PatientDietPage } from './app/pages/diet/PatientDietPage';
import { ProtectedRoute } from './app/components/ProtectedRoute';
import { PatientListPage } from './app/pages/pacientes/PatientListPage';
import { PatientFormPage } from './app/pages/pacientes/PatientFormPage';
import { PatientProfilePage } from './app/pages/pacientes/PatientProfilePage';
import { MealPlanPage } from './app/pages/plano-alimentar/MealPlanPage';
import { EvolutionChartPage } from './app/pages/evolucao/EvolutionChartPage';
import { BodyMeasurementFormPage } from './app/pages/medidas/BodyMeasurementFormPage';
import { ClinicalNotesPage } from './app/pages/anotacoes/ClinicalNotesPage';
import { PatientMealPlanPage } from './app/pages/paciente/PatientMealPlanPage';

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
            path="/dashboard/pacientes/:id/plano-alimentar"
            element={
              <ProtectedRoute allowedRole="nutricionista">
                <MealPlanPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/pacientes/:id/evolucao"
            element={
              <ProtectedRoute allowedRole="nutricionista">
                <EvolutionChartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/pacientes/:id/medidas"
            element={
              <ProtectedRoute allowedRole="nutricionista">
                <BodyMeasurementFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/pacientes/:id/anotacoes"
            element={
              <ProtectedRoute allowedRole="nutricionista">
                <ClinicalNotesPage />
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
          <Route
            path="/paciente/meu-plano"
            element={
              <ProtectedRoute allowedRole="paciente">
                <PatientMealPlanPage />
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

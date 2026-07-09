import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './viewmodel/auth/AuthViewModel';
import { LoginPage } from './app/pages/auth/LoginPage';
import { PatientDietPage } from './app/pages/diet/PatientDietPage';
import { ProtectedRoute } from './app/components/ProtectedRoute';
import { PatientListPage } from './app/pages/pacientes/PatientListPage';
import { PatientFormPage } from './app/pages/pacientes/PatientFormPage';
import { PatientProfilePage } from './app/pages/pacientes/PatientProfilePage';
import { MealPlanPage } from './app/pages/plano-alimentar/MealPlanPage';
import { BodyMeasurementFormPage } from './app/pages/medidas/BodyMeasurementFormPage';
import { ClinicalNotesPage } from './app/pages/anotacoes/ClinicalNotesPage';
import { SchedulePage } from './app/pages/agenda/SchedulePage';
import { PatientMealPlanPage } from './app/pages/paciente/PatientMealPlanPage';
import { NutritionistLayout } from './app/components/layouts/NutritionistLayout';
import { PatientProfileLayout } from './app/components/layouts/PatientProfileLayout';
import { PatientReportDashboard } from './app/pages/reports/PatientReportDashboard';
import { PatientEvolutionView } from './app/pages/reports/PatientEvolutionView';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="nutricionista">
                <NutritionistLayout />
              </ProtectedRoute>
            }
          >
            {/* O redirect padrao pro dashboard */}
            <Route index element={<Navigate to="/dashboard/pacientes" replace />} />
            <Route path="pacientes" element={<PatientListPage />} />
            <Route path="pacientes/novo" element={<PatientFormPage />} />
            <Route path="pacientes/:id/editar" element={<PatientFormPage />} />
            <Route path="agenda" element={<SchedulePage />} />
            
            <Route path="pacientes/:id" element={<PatientProfileLayout />}>
              <Route index element={<PatientProfilePage />} />
              <Route path="plano-alimentar" element={<MealPlanPage />} />
              <Route path="evolucao" element={<PatientReportDashboard />} />
              <Route path="medidas" element={<BodyMeasurementFormPage />} />
              <Route path="anotacoes" element={<ClinicalNotesPage />} />
            </Route>
          </Route>

          <Route
            path="/dieta"
            element={<Navigate to="/paciente/meu-plano" replace />}
          />
          <Route path="/paciente/meu-plano"
            element={
              <ProtectedRoute allowedRole="paciente">
                <PatientMealPlanPage />
              </ProtectedRoute>
            }
          />
          <Route path="/paciente/evolucao"
            element={
              <ProtectedRoute allowedRole="paciente">
                <PatientEvolutionView />
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

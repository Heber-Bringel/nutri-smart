import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './viewmodel/auth/AuthViewModel';
import { LoginPage } from './app/pages/auth/LoginPage';
import { ForgotPasswordPage } from './app/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './app/pages/auth/ResetPasswordPage';
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

// Componente interno para permitir o uso do useLocation dentro do BrowserRouter.
// A `key` no <Routes> força o AnimatePresence a detectar a mudança de rota e
// executar as animações de exit/enter das páginas envolvidas por PageTransition.
//
// Importante: usamos `getRouteKey` (e não `location.pathname` puro) para que a
// navegação entre as ABAS do perfil do paciente (visão geral, plano alimentar,
// evolução, medidas, anotações) NÃO remonte o PatientProfileLayout. Isso evita
// refazer o fetch do paciente e o flash de skeleton a cada troca de aba — a
// transição visual entre abas fica a cargo de um AnimatePresence local no layout.
function getRouteKey(pathname: string): string {
  const match = pathname.match(
    /^(\/dashboard\/pacientes\/[^/]+)(\/(plano-alimentar|evolucao|medidas|anotacoes))?\/?$/
  );
  if (match && match[1] !== '/dashboard/pacientes/novo') {
    return match[1];
  }
  return pathname;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={getRouteKey(location.pathname)}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
        <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
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
    </AnimatePresence>
  );
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

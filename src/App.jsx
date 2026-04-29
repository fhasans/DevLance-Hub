import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import PageLoader from './components/PageLoader';
import NotFound from './pages/NotFound';

// Lazy-loaded pages for code splitting (NFR: bundle < 500KB)
const Dashboard      = lazy(() => import('./pages/Dashboard'));
const TimeTracker    = lazy(() => import('./pages/tools/TimeTracker'));
const KanbanBoard    = lazy(() => import('./pages/tools/KanbanBoard'));
const JsonFormatter  = lazy(() => import('./pages/tools/JsonFormatter'));
const ApiTester      = lazy(() => import('./pages/tools/ApiTester'));
const RegexTester    = lazy(() => import('./pages/tools/RegexTester'));
const CodeVault      = lazy(() => import('./pages/tools/CodeVault'));
const DummyData      = lazy(() => import('./pages/tools/DummyData'));
const InvoiceGen     = lazy(() => import('./pages/tools/InvoiceGenerator'));
const ClientCRM      = lazy(() => import('./pages/tools/ClientCRM'));
const CoverLetter    = lazy(() => import('./pages/tools/CoverLetter'));
const PomodoroTimer  = lazy(() => import('./pages/tools/PomodoroTimer'));
const MeetingMinutes = lazy(() => import('./pages/tools/MeetingMinutes'));
const PasswordVault  = lazy(() => import('./pages/tools/PasswordVault'));

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={
            <Suspense fallback={<PageLoader />}>
              <Dashboard />
            </Suspense>
          } />
          <Route path="time-tracker" element={
            <Suspense fallback={<PageLoader />}>
              <TimeTracker />
            </Suspense>
          } />
          <Route path="kanban-board" element={
            <Suspense fallback={<PageLoader />}>
              <KanbanBoard />
            </Suspense>
          } />
          <Route path="json-formatter" element={
            <Suspense fallback={<PageLoader />}>
              <JsonFormatter />
            </Suspense>
          } />
          <Route path="api-tester" element={
            <Suspense fallback={<PageLoader />}>
              <ApiTester />
            </Suspense>
          } />
          <Route path="regex-tester" element={
            <Suspense fallback={<PageLoader />}>
              <RegexTester />
            </Suspense>
          } />
          <Route path="code-vault" element={
            <Suspense fallback={<PageLoader />}>
              <CodeVault />
            </Suspense>
          } />
          <Route path="dummy-data" element={
            <Suspense fallback={<PageLoader />}>
              <DummyData />
            </Suspense>
          } />
          <Route path="invoice-gen" element={
            <Suspense fallback={<PageLoader />}>
              <InvoiceGen />
            </Suspense>
          } />
          <Route path="client-crm" element={
            <Suspense fallback={<PageLoader />}>
              <ClientCRM />
            </Suspense>
          } />
          <Route path="cover-letter" element={
            <Suspense fallback={<PageLoader />}>
              <CoverLetter />
            </Suspense>
          } />
          <Route path="pomodoro-timer" element={
            <Suspense fallback={<PageLoader />}>
              <PomodoroTimer />
            </Suspense>
          } />
          <Route path="meeting-minutes" element={
            <Suspense fallback={<PageLoader />}>
              <MeetingMinutes />
            </Suspense>
          } />
          <Route path="password-vault" element={
            <Suspense fallback={<PageLoader />}>
              <PasswordVault />
            </Suspense>
          } />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;

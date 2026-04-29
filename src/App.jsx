import { HashRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import TimeTracker from './pages/tools/TimeTracker';
import KanbanBoard from './pages/tools/KanbanBoard';
import JsonFormatter from './pages/tools/JsonFormatter';
import ApiTester from './pages/tools/ApiTester';
import RegexTester from './pages/tools/RegexTester';
import CodeVault from './pages/tools/CodeVault';
import DummyData from './pages/tools/DummyData';
import InvoiceGenerator from './pages/tools/InvoiceGenerator';
import ClientCRM from './pages/tools/ClientCRM';
import CoverLetter from './pages/tools/CoverLetter';
import PomodoroTimer from './pages/tools/PomodoroTimer';
import MeetingMinutes from './pages/tools/MeetingMinutes';
import PasswordVault from './pages/tools/PasswordVault';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="time-tracker" element={<TimeTracker />} />
          <Route path="kanban-board" element={<KanbanBoard />} />
          <Route path="json-formatter" element={<JsonFormatter />} />
          <Route path="api-tester" element={<ApiTester />} />
          <Route path="regex-tester" element={<RegexTester />} />
          <Route path="code-vault" element={<CodeVault />} />
          <Route path="dummy-data" element={<DummyData />} />
          <Route path="invoice-gen" element={<InvoiceGenerator />} />
          <Route path="client-crm" element={<ClientCRM />} />
          <Route path="cover-letter" element={<CoverLetter />} />
          <Route path="pomodoro-timer" element={<PomodoroTimer />} />
          <Route path="meeting-minutes" element={<MeetingMinutes />} />
          <Route path="password-vault" element={<PasswordVault />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;

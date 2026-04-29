import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import TimeTracker from './pages/tools/TimeTracker';
import KanbanBoard from './pages/tools/KanbanBoard';
import JsonFormatter from './pages/tools/JsonFormatter';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="time-tracker" element={<TimeTracker />} />
          <Route path="kanban-board" element={<KanbanBoard />} />
          <Route path="json-formatter" element={<JsonFormatter />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          {/* Tambahkan rute tools lainnya di sini di masa depan */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

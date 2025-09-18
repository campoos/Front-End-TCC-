import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/Home.jsx'; // Importe a nova página Home
import LoginPage from './pages/login/Login.jsx'; // Importe a sua página de login
import './App.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
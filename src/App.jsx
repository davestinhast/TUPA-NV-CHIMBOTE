import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import Inicio from './pages/Inicio';
import Buscar from './pages/Buscar';
import DetalleTramite from './pages/DetalleTramite';
import Dashboard from './pages/Dashboard';
import Acerca from './pages/Acerca';
import Admin from './pages/Admin';
import ScrollToTop from './components/ScrollToTop';
import TupaBot from './components/TupaBot';
import BackToTop from './components/BackToTop';

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Inicio />} />
                <Route path="/buscar" element={<Buscar />} />
                <Route path="/tramite/:slug" element={<DetalleTramite />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/acerca" element={<Acerca />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Header />
            <main style={{ minHeight: '70vh' }}>
                <AnimatedRoutes />
            </main>
            <Footer />
            <TupaBot />
            <BackToTop />
        </BrowserRouter>
    );
}

export default App;


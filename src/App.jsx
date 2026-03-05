import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Inicio from './pages/Inicio';
import Buscar from './pages/Buscar';
import DetalleTramite from './pages/DetalleTramite';
import Dashboard from './pages/Dashboard';
import Acerca from './pages/Acerca';
import ScrollToTop from './components/ScrollToTop';
import TupaBot from './components/TupaBot';
import BackToTop from './components/BackToTop';

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Header />
            <main style={{ minHeight: '70vh' }}>
                <Routes>
                    <Route path="/" element={<Inicio />} />
                    <Route path="/buscar" element={<Buscar />} />
                    <Route path="/tramite/:slug" element={<DetalleTramite />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/acerca" element={<Acerca />} />
                </Routes>
            </main>
            <Footer />
            <TupaBot />
            <BackToTop />
        </BrowserRouter>
    );
}

export default App;


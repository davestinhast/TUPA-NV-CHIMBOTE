import { useEffect, useRef, useState } from 'react';
import { FileText, Loader } from 'lucide-react';


export default function PDFPreview({ page }) {
    const canvasRef = useRef(null);
    const [status, setStatus] = useState('loading'); 

    const PDF_URL = 'https://www.muninuevochimbote.gob.pe/DOCPORTAL/TUPA-2025-MDNCH.pdf';

    useEffect(() => {
        if (!page) return;
        let cancelled = false;

        async function render() {
            try {
                setStatus('loading');
                const pdfjsLib = await import('pdfjs-dist');
                
                pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

                const loadingTask = pdfjsLib.getDocument({ url: PDF_URL, withCredentials: false });
                const pdf = await loadingTask.promise;
                const pageNum = Math.min(Number(page), pdf.numPages);
                const pdfPage = await pdf.getPage(pageNum);

                const viewport = pdfPage.getViewport({ scale: 1.2 });
                const canvas = canvasRef.current;
                if (!canvas || cancelled) return;

                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext('2d');

                await pdfPage.render({ canvasContext: ctx, viewport }).promise;
                if (!cancelled) setStatus('done');
            } catch (err) {
                console.warn('PDFPreview error:', err);
                if (!cancelled) setStatus('error');
            }
        }

        render();
        return () => { cancelled = true; };
    }, [page]);

    if (status === 'error') {
        return (
            <div style={{
                flex: '1 1 300px', maxWidth: '400px',
                background: '#f8f9fa', borderRadius: '8px',
                border: '1px solid #e0e4e8', padding: '2rem',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: '0.8rem', color: '#888',
                minHeight: '200px'
            }}>
                <FileText size={40} style={{ opacity: 0.3 }} />
                <span style={{ fontSize: '0.85rem', textAlign: 'center' }}>
                    Vista previa no disponible.<br />Usa el botón para ver el PDF oficial.
                </span>
            </div>
        );
    }

    return (
        <div style={{
            flex: '1 1 300px', maxWidth: '400px',
            borderRadius: '8px', border: '1px solid #e0e4e8',
            overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            background: '#f5f5f5', position: 'relative', minHeight: '200px'
        }}>
            {status === 'loading' && (
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: '0.8rem', color: '#888', background: '#f8f9fa'
                }}>
                    <Loader size={28} style={{ animation: 'spin 1s linear infinite' }} />
                    <span style={{ fontSize: '0.82rem' }}>Cargando página {page}…</span>
                </div>
            )}
            <canvas
                ref={canvasRef}
                style={{ width: '100%', display: 'block', opacity: status === 'done' ? 1 : 0 }}
            />
        </div>
    );
}

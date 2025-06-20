import { createProxyMiddleware } from 'http-proxy-middleware';

export const proxyRequest = (req, res, target) => {
    const middleware = createProxyMiddleware({
        target,
        changeOrigin: true,
        // El pathRewrite opcional, comentado para evitar problemas con rutas
        // Si tus microservicios usan rutas específicas, ajusta o elimina esta parte
        // pathRewrite: {
        //   [`^${req.baseUrl}`]: '',
        // },
        onError: (err, req, res) => {
            console.error('❌ Error en proxy:', err.message);
            if (!res.headersSent) {
                res.status(500).json({ message: 'Error interno en el gateway' });
            }
        },
        logLevel: 'debug', // Para ver logs detallados (puedes cambiar a 'info' o 'silent')
    });

    middleware(req, res, (err) => {
        if (err) {
            console.error('❌ Middleware proxy error:', err);
            if (!res.headersSent) {
                res.status(500).json({ message: 'Error en middleware proxy' });
            }
        }
    });
};

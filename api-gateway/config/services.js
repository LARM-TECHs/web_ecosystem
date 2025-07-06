// api-gateway/config/services.js
export const services = {
    'authService': {
        target: process.env.AUTH_SERVICE_URL || 'http://localhost:3000',
        routes: [
            { method: 'POST', path: '/auth/register', authRequired: false, targetPath: '/api/auth/register' },
            { method: 'POST', path: '/auth/login', authRequired: false, targetPath: '/api/auth/login' },
            { method: 'GET', path: '/auth/profile', authRequired: true, targetPath: '/api/auth/profile' }
        ]
    },
    'chatLlmService': {
        target: process.env.CHAT_LLM_SERVICE_URL || 'http://localhost:4001',
        routes: [
            // --- RUTAS ACTUALIZADAS PARA EL NUEVO MODELO DE CONVERSACIONES ---
            { method: 'POST', path: '/chat-llm/stream', authRequired: true, targetPath: '/api/chat-llm/stream' },
            { method: 'GET', path: '/chat-llm/conversations', authRequired: true, targetPath: '/api/chat-llm/conversations' },
            { method: 'GET', path: '/chat-llm/conversations/:conversationId', authRequired: true, targetPath: '/api/chat-llm/conversations/:conversationId' },
            { method: 'POST', path: '/chat-llm/chat', authRequired: true, targetPath: '/api/chat-llm/chat' },
            { method: 'GET', path: '/chat-llm/chats', authRequired: true, targetPath: '/api/chat-llm/chats' },
            { method: 'GET', path: '/chat-llm/chats/:chat_id', authRequired: true, targetPath: '/api/chat-llm/chats/:chat_id' },
            { method: 'GET', path: '/chat-llm/protected', authRequired: true, targetPath: '/api/chat-llm/protected' }
        ]
    },
    'notasEstudiantesService': {
        target: process.env.NOTAS_ESTUDIANTES_SERVICE_URL || 'http://localhost:3002',
        routes: [
            // Rutas de salud
            { method: 'GET', path: '/notas/health', authRequired: false, targetPath: '/api/v1/health' },

            // Rutas de Asignaturas
            { method: 'POST', path: '/notas/asignaturas', authRequired: true, targetPath: '/api/v1/asignaturas' },
            { method: 'GET', path: '/notas/asignaturas', authRequired: true, targetPath: '/api/v1/asignaturas' },
            { method: 'GET', path: '/notas/asignaturas/:id_asignatura', authRequired: true, targetPath: '/api/v1/asignaturas/:id_asignatura' },
            { method: 'GET', path: '/notas/asignaturas/nombre/:nombre_asignatura', authRequired: true, targetPath: '/api/v1/asignaturas/nombre/:nombre_asignatura' },
            { method: 'GET', path: '/notas/asignaturas/carrera/:id_carrera', authRequired: true, targetPath: '/api/v1/asignaturas/carrera/:id_carrera' },
            { method: 'GET', path: '/notas/asignaturas/carrera/:id_carrera/id/:id_asignatura', authRequired: true, targetPath: '/api/v1/asignaturas/carrera/:id_carrera/id/:id_asignatura' },
            { method: 'GET', path: '/notas/asignaturas/brigada/:id_brigada', authRequired: true, targetPath: '/api/v1/asignaturas/brigada/:id_brigada' },
            { method: 'PUT', path: '/notas/asignaturas/:id_asignatura', authRequired: true, targetPath: '/api/v1/asignaturas/:id_asignatura' },
            { method: 'DELETE', path: '/notas/asignaturas/:id_asignatura', authRequired: true, targetPath: '/api/v1/asignaturas/:id_asignatura' },
            { method: 'POST', path: '/notas/asignaturas/carrera', authRequired: true, targetPath: '/api/v1/asignaturas/carrera' },

            // Rutas de Brigadas
            { method: 'POST', path: '/notas/brigadas', authRequired: true, targetPath: '/api/v1/brigadas' },
            { method: 'GET', path: '/notas/brigadas', authRequired: true, targetPath: '/api/v1/brigadas' },
            { method: 'GET', path: '/notas/brigadas/:id_brigada', authRequired: true, targetPath: '/api/v1/brigadas/:id_brigada' },
            { method: 'GET', path: '/notas/brigadas/carrera/:id_carrera', authRequired: true, targetPath: '/api/v1/brigadas/carrera/:id_carrera' },
            { method: 'GET', path: '/notas/brigadas/nombre/:nombre_brigada', authRequired: true, targetPath: '/api/v1/brigadas/nombre/:nombre_brigada' },
            { method: 'PUT', path: '/notas/brigadas/:id_brigada', authRequired: true, targetPath: '/api/v1/brigadas/:id_brigada' },
            { method: 'DELETE', path: '/notas/brigadas/:id_brigada', authRequired: true, targetPath: '/api/v1/brigadas/:id_brigada' },

            // Rutas de Carreras
            { method: 'POST', path: '/notas/carreras', authRequired: true, targetPath: '/api/v1/carreras' },
            { method: 'GET', path: '/notas/carreras', authRequired: true, targetPath: '/api/v1/carreras' },
            { method: 'GET', path: '/notas/carreras/:id_carrera', authRequired: true, targetPath: '/api/v1/carreras/:id_carrera' },
            { method: 'GET', path: '/notas/carreras/facultad/:id_facultad', authRequired: true, targetPath: '/api/v1/carreras/facultad/:id_facultad' },
            { method: 'GET', path: '/notas/carreras/nombre/:nombre_carrera', authRequired: true, targetPath: '/api/v1/carreras/nombre/:nombre_carrera' },
            { method: 'PUT', path: '/notas/carreras/:id_carrera', authRequired: true, targetPath: '/api/v1/carreras/:id_carrera' },
            { method: 'DELETE', path: '/notas/carreras/:id_carrera', authRequired: true, targetPath: '/api/v1/carreras/:id_carrera' },

            // Rutas de EstudianteProfile
            { method: 'POST', path: '/notas/estudiantes', authRequired: true, targetPath: '/api/v1/estudiantes' },
            { method: 'GET', path: '/notas/estudiantes', authRequired: true, targetPath: '/api/v1/estudiantes' },
            { method: 'GET', path: '/notas/estudiantes/me', authRequired: true, targetPath: '/api/v1/estudiantes/me' },
            { method: 'GET', path: '/notas/estudiantes/:id_estudiante_profile', authRequired: true, targetPath: '/api/v1/estudiantes/:id_estudiante_profile' },
            { method: 'GET', path: '/notas/estudiantes/usuario/:id_usuario', authRequired: true, targetPath: '/api/v1/estudiantes/usuario/:id_usuario' },
            { method: 'GET', path: '/notas/estudiantes/brigada/:id_brigada', authRequired: true, targetPath: '/api/v1/estudiantes/brigada/:id_brigada' },
            { method: 'PUT', path: '/notas/estudiantes/:id_estudiante_profile', authRequired: true, targetPath: '/api/v1/estudiantes/:id_estudiante_profile' },
            { method: 'DELETE', path: '/notas/estudiantes/:id_estudiante_profile', authRequired: true, targetPath: '/api/v1/estudiantes/:id_estudiante_profile' },

            // Rutas de Facultades
            { method: 'POST', path: '/notas/facultades', authRequired: true, targetPath: '/api/v1/facultades' },
            { method: 'GET', path: '/notas/facultades', authRequired: true, targetPath: '/api/v1/facultades' },
            { method: 'GET', path: '/notas/facultades/:id_facultad', authRequired: true, targetPath: '/api/v1/facultades/:id_facultad' },
            { method: 'GET', path: '/notas/facultades/nombre/:nombre_facultad', authRequired: true, targetPath: '/api/v1/facultades/nombre/:nombre_facultad' },
            { method: 'PUT', path: '/notas/facultades/:id_facultad', authRequired: true, targetPath: '/api/v1/facultades/:id_facultad' },
            { method: 'DELETE', path: '/notas/facultades/:id_facultad', authRequired: true, targetPath: '/api/v1/facultades/:id_facultad' },

            // Rutas de Notas
            { method: 'POST', path: '/notas/notas', authRequired: true, targetPath: '/api/v1/notas' },
            { method: 'GET', path: '/notas/notas/:id_nota', authRequired: true, targetPath: '/api/v1/notas/:id_nota' },
            { method: 'GET', path: '/notas/notas/estudiante/:id_estudiante_profile', authRequired: true, targetPath: '/api/v1/notas/estudiante/:id_estudiante_profile' },
            { method: 'GET', path: '/notas/notas/estudiante/:id_estudiante_profile/año/:año', authRequired: true, targetPath: '/api/v1/notas/estudiante/:id_estudiante_profile/año/:año' },
            { method: 'GET', path: '/notas/notas/asignatura/:id_asignatura/estudiante/:id_estudiante_profile', authRequired: true, targetPath: '/api/v1/notas/asignatura/:id_asignatura/estudiante/:id_estudiante_profile' },
            { method: 'PUT', path: '/notas/notas/:id_nota', authRequired: true, targetPath: '/api/v1/notas/:id_nota' },
            { method: 'DELETE', path: '/notas/notas/:id_nota', authRequired: true, targetPath: '/api/v1/notas/:id_nota' },
            { method: 'GET', path: '/notas/notas/estudiante/:id_estudiante_profile/promedio', authRequired: true, targetPath: '/api/v1/notas/estudiante/:id_estudiante_profile/promedio' }
        ]
    },
    'votacionService': {
        target: process.env.VOTACION_SERVICE_URL || 'http://localhost:3003',
        routes: [
            // Rutas de salud/test
            { method: 'GET', path: '/votacion/health', authRequired: false, targetPath: '/api/v1/health' },

            // Rutas de Votaciones (eventos de votación)
            { method: 'POST', path: '/votacion/votaciones', authRequired: true, targetPath: '/api/v1/votaciones' },
            { method: 'GET', path: '/votacion/votaciones/activa', authRequired: true, targetPath: '/api/v1/votaciones/activa' },
            { method: 'GET', path: '/votacion/votaciones/:id_votacion', authRequired: true, targetPath: '/api/v1/votaciones/:id_votacion' },
            { method: 'GET', path: '/votacion/votaciones', authRequired: true, targetPath: '/api/v1/votaciones' }, // GET all votaciones
            { method: 'PUT', path: '/votacion/votaciones/:id_votacion/estado', authRequired: true, targetPath: '/api/v1/votaciones/:id_votacion/estado' },
            { method: 'DELETE', path: '/votacion/votaciones/:id_votacion', authRequired: true, targetPath: '/api/v1/votaciones/:id_votacion' },

            // Rutas de Candidatos
            { method: 'POST', path: '/votacion/candidatos', authRequired: true, targetPath: '/api/v1/candidatos' },
            { method: 'GET', path: '/votacion/candidatos', authRequired: true, targetPath: '/api/v1/candidatos' },
            { method: 'GET', path: '/votacion/candidatos/buscarPorNombre', authRequired: true, targetPath: '/api/v1/candidatos/buscarPorNombre' },
            { method: 'GET', path: '/votacion/candidatos/porVotacion/:id_votacion', authRequired: true, targetPath: '/api/v1/candidatos/porVotacion/:id_votacion' },
            { method: 'PUT', path: '/votacion/candidatos/:id_candidato', authRequired: true, targetPath: '/api/v1/candidatos/:id_candidato' },
            { method: 'DELETE', path: '/votacion/candidatos/:id_candidato', authRequired: true, targetPath: '/api/v1/candidatos/:id_candidato' },

            // Rutas de Votos
            { method: 'POST', path: '/votacion/votos', authRequired: true, targetPath: '/api/v1/votos' },
            { method: 'GET', path: '/votacion/votos/:id_votacion/resultados', authRequired: true, targetPath: '/api/v1/votaciones/:id_votacion/resultados' },
            { method: 'GET', path: '/votacion/votos/:id_votacion/votos-por-usuario', authRequired: true, targetPath: '/api/v1/votaciones/:id_votacion/votos-por-usuario' }
        ]
    },
    // --- SERVICIO: Libreria Service ---
    'libreriaService': {
        target: process.env.LIBRERIA_SERVICE_URL || 'http://localhost:3004',
        routes: [
            // Ruta de salud
            { method: 'GET', path: '/libreria/health', authRequired: false, targetPath: '/api/v1/health' },

            // Rutas de Libros
            { method: 'POST', path: '/libreria/libros', authRequired: true, targetPath: '/api/v1/libros' },
            { method: 'GET', path: '/libreria/libros', authRequired: true, targetPath: '/api/v1/libros' },
            { method: 'GET', path: '/libreria/libros/search', authRequired: true, targetPath: '/api/v1/libros/search' },
            { method: 'GET', path: '/libreria/libros/:id_libro', authRequired: true, targetPath: '/api/v1/libros/:id_libro' },
            { method: 'PUT', path: '/libreria/libros/:id_libro', authRequired: true, targetPath: '/api/v1/libros/:id_libro' },
            { method: 'DELETE', path: '/libreria/libros/:id_libro', authRequired: true, targetPath: '/api/v1/libros/:id_libro' },

            // Rutas de Préstamos
            { method: 'POST', path: '/libreria/prestamos', authRequired: true, targetPath: '/api/v1/prestamos' },
            { method: 'GET', path: '/libreria/prestamos', authRequired: true, targetPath: '/api/v1/prestamos' },
            { method: 'GET', path: '/libreria/prestamos/:id_prestamo', authRequired: true, targetPath: '/api/v1/prestamos/:id_prestamo' },
            { method: 'GET', path: '/libreria/prestamos/usuario/:id_usuario', authRequired: true, targetPath: '/api/v1/prestamos/usuario/:id_usuario' },
            { method: 'PUT', path: '/libreria/prestamos/:id_prestamo/devolver', authRequired: true, targetPath: '/api/v1/prestamos/:id_prestamo/devolver' },
            { method: 'DELETE', path: '/libreria/prestamos/:id_prestamo', authRequired: true, targetPath: '/api/v1/prestamos/:id_prestamo' },

            // Rutas de Selecciones
            { method: 'POST', path: '/libreria/selecciones', authRequired: true, targetPath: '/api/v1/selecciones' },
            { method: 'GET', path: '/libreria/selecciones', authRequired: true, targetPath: '/api/v1/selecciones' },
            { method: 'GET', path: '/libreria/selecciones/:id_seleccion', authRequired: true, targetPath: '/api/v1/selecciones/:id_seleccion' },
            { method: 'PUT', path: '/libreria/selecciones/:id_seleccion', authRequired: true, targetPath: '/api/v1/selecciones/:id_seleccion' },
            { method: 'DELETE', path: '/libreria/selecciones/:id_seleccion', authRequired: true, targetPath: '/api/v1/selecciones/:id_seleccion' }
        ]
    },
    'comedorService': {
        target: process.env.COMEDOR_SERVICE_URL || 'http://localhost:3005',
        routes: [
            // Rutas de salud
            { method: 'GET', path: '/comedor/health', authRequired: false, targetPath: '/api/v1/health' },

            // Rutas de Menús
            { method: 'POST', path: '/comedor/menus', authRequired: true, targetPath: '/api/v1/menus' },
            { method: 'GET', path: '/comedor/menus/today', authRequired: true, targetPath: '/api/v1/menus/today' },
            { method: 'GET', path: '/comedor/menus/:date', authRequired: true, targetPath: '/api/v1/menus/:date' },
            { method: 'GET', path: '/comedor/menus', authRequired: true, targetPath: '/api/v1/menus' },
            { method: 'DELETE', path: '/comedor/menus/:date', authRequired: true, targetPath: '/api/v1/menus/:date' },

            // Rutas de QR Codes (para estudiantes)
            // studentComedorId en la URL del gateway, para que el gateway sepa a qué microservicio ir
            { method: 'GET', path: '/comedor/students/:studentComedorId/qr', authRequired: true, targetPath: '/api/v1/qrcodes/students/:studentComedorId/qr' },

            // Rutas de Estudiantes del Comedor
            { method: 'POST', path: '/comedor/students-comedor', authRequired: true, targetPath: '/api/v1/students-comedor' },
            { method: 'GET', path: '/comedor/students-comedor', authRequired: true, targetPath: '/api/v1/students-comedor' },
            { method: 'GET', path: '/comedor/students-comedor/me', authRequired: true, targetPath: '/api/v1/students-comedor/me' },
            { method: 'GET', path: '/comedor/students-comedor/:id', authRequired: true, targetPath: '/api/v1/students-comedor/:id' },
            { method: 'PUT', path: '/comedor/students-comedor/:id', authRequired: true, targetPath: '/api/v1/students-comedor/:id' },
            { method: 'DELETE', path: '/comedor/students-comedor/:id', authRequired: true, targetPath: '/api/v1/students-comedor/:id' },

            // Rutas de Personal del Comedor
            { method: 'POST', path: '/comedor/staff-comedor', authRequired: true, targetPath: '/api/v1/staff-comedor' },
            { method: 'GET', path: '/comedor/staff-comedor', authRequired: true, targetPath: '/api/v1/staff-comedor' },
            { method: 'GET', path: '/comedor/staff-comedor/:id', authRequired: true, targetPath: '/api/v1/staff-comedor/:id' },
            { method: 'PUT', path: '/comedor/staff-comedor/:id', authRequired: true, targetPath: '/api/v1/staff-comedor/:id' },
            { method: 'DELETE', path: '/comedor/staff-comedor/:id', authRequired: true, targetPath: '/api/v1/staff-comedor/:id' },

            // Rutas de Validación y Historial de QR (para personal)
            { method: 'POST', path: '/comedor/staff-comedor/validate-qr', authRequired: true, targetPath: '/api/v1/staff-comedor/validate-qr' },
            { method: 'GET', path: '/comedor/staff-comedor/qr-history', authRequired: true, targetPath: '/api/v1/staff-comedor/qr-history' },
            { method: 'GET', path: '/comedor/staff-comedor/qrcodes/:qrId', authRequired: true, targetPath: '/api/v1/staff-comedor/qrcodes/:qrId' }
        ]
    }
};

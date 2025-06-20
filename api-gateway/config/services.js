// api-gateway/config/services.js
export const services = {
    'authService': {
        target: process.env.AUTH_SERVICE_URL || 'http://localhost:3000',
        routes: {
            // ORIGINAL: '/auth/register': { method: 'POST', authRequired: false },
            // CORRECTION: The API Gateway needs to forward to /api/auth/register on the user-auth-service
            '/auth/register': { method: 'POST', authRequired: false, targetPath: '/api/auth/register' }, // <--- ADD targetPath
            '/auth/login': { method: 'POST', authRequired: false, targetPath: '/api/auth/login' },     // <--- ADD targetPath
            '/auth/profile': { method: 'GET', authRequired: true, targetPath: '/api/auth/profile' }    // <--- ADD targetPath
        }
    },
    'chatLlmService': { // UPDATED SERVICE ENTRY
        target: process.env.CHAT_LLM_SERVICE_URL || 'http://localhost:4001',
        routes: {
            // Gateway path          --> Target path on chat-llm-service
            '/chat-llm/chat': { method: 'POST', authRequired: true, targetPath: '/api/chat-llm/chat' },
            '/chat-llm/chats': { method: 'GET', authRequired: true, targetPath: '/api/chat-llm/chats' },
            '/chat-llm/chats/:chat_id': { method: 'GET', authRequired: true, targetPath: '/api/chat-llm/chats/:chat_id' },
            '/chat-llm/protected': { method: 'GET', authRequired: true, targetPath: '/api/chat-llm/protected' }
        }
    },
    'notasEstudiantesService': {
        // Asegúrate de que esta URL coincida con dónde se ejecuta tu notas-estudiantes-service
        target: process.env.NOTAS_ESTUDIANTES_SERVICE_URL || 'http://localhost:3002',
        routes: {
            // Rutas de salud/test
            '/notas/health': { method: 'GET', authRequired: false, targetPath: '/api/v1/health' },

            // Rutas de Asignaturas
            '/notas/asignaturas': { method: 'POST', authRequired: true, targetPath: '/api/v1/asignaturas' },
            '/notas/asignaturas': { method: 'GET', authRequired: true, targetPath: '/api/v1/asignaturas' },
            '/notas/asignaturas/:id_asignatura': { method: 'GET', authRequired: true, targetPath: '/api/v1/asignaturas/:id_asignatura' },
            '/notas/asignaturas/nombre/:nombre_asignatura': { method: 'GET', authRequired: true, targetPath: '/api/v1/asignaturas/nombre/:nombre_asignatura' },
            '/notas/asignaturas/carrera/:id_carrera': { method: 'GET', authRequired: true, targetPath: '/api/v1/asignaturas/carrera/:id_carrera' },
            '/notas/asignaturas/carrera/:id_carrera/id/:id_asignatura': { method: 'GET', authRequired: true, targetPath: '/api/v1/asignaturas/carrera/:id_carrera/id/:id_asignatura' },
            '/notas/asignaturas/brigada/:id_brigada': { method: 'GET', authRequired: true, targetPath: '/api/v1/asignaturas/brigada/:id_brigada' },
            '/notas/asignaturas/:id_asignatura': { method: 'PUT', authRequired: true, targetPath: '/api/v1/asignaturas/:id_asignatura' },
            '/notas/asignaturas/:id_asignatura': { method: 'DELETE', authRequired: true, targetPath: '/api/v1/asignaturas/:id_asignatura' },
            '/notas/asignaturas/carrera/:id_carrera/:id_asignatura': { method: 'DELETE', authRequired: true, targetPath: '/api/v1/asignaturas/carrera/:id_carrera/:id_asignatura' },
            '/notas/asignaturas/carrera': { method: 'POST', authRequired: true, targetPath: '/api/v1/asignaturas/carrera' },


            // Rutas de Brigadas
            '/notas/brigadas': { method: 'POST', authRequired: true, targetPath: '/api/v1/brigadas' },
            '/notas/brigadas': { method: 'GET', authRequired: true, targetPath: '/api/v1/brigadas' },
            '/notas/brigadas/:id_brigada': { method: 'GET', authRequired: true, targetPath: '/api/v1/brigadas/:id_brigada' },
            '/notas/brigadas/carrera/:id_carrera': { method: 'GET', authRequired: true, targetPath: '/api/v1/brigadas/carrera/:id_carrera' },
            '/notas/brigadas/nombre/:nombre_brigada': { method: 'GET', authRequired: true, targetPath: '/api/v1/brigadas/nombre/:nombre_brigada' },
            '/notas/brigadas/:id_brigada': { method: 'PUT', authRequired: true, targetPath: '/api/v1/brigadas/:id_brigada' },
            '/notas/brigadas/:id_brigada': { method: 'DELETE', authRequired: true, targetPath: '/api/v1/brigadas/:id_brigada' },

            // Rutas de Carreras
            '/notas/carreras': { method: 'POST', authRequired: true, targetPath: '/api/v1/carreras' },
            '/notas/carreras': { method: 'GET', authRequired: true, targetPath: '/api/v1/carreras' },
            '/notas/carreras/:id_carrera': { method: 'GET', authRequired: true, targetPath: '/api/v1/carreras/:id_carrera' },
            '/notas/carreras/facultad/:id_facultad': { method: 'GET', authRequired: true, targetPath: '/api/v1/carreras/facultad/:id_facultad' },
            '/notas/carreras/nombre/:nombre_carrera': { method: 'GET', authRequired: true, targetPath: '/api/v1/carreras/nombre/:nombre_carrera' },
            '/notas/carreras/:id_carrera': { method: 'PUT', authRequired: true, targetPath: '/api/v1/carreras/:id_carrera' },
            '/notas/carreras/:id_carrera': { method: 'DELETE', authRequired: true, targetPath: '/api/v1/carreras/:id_carrera' },

            // Rutas de EstudianteProfile
            '/notas/estudiantes': { method: 'POST', authRequired: true, targetPath: '/api/v1/estudiantes' },
            '/notas/estudiantes': { method: 'GET', authRequired: true, targetPath: '/api/v1/estudiantes' },
            '/notas/estudiantes/me': { method: 'GET', authRequired: true, targetPath: '/api/v1/estudiantes/me' },
            '/notas/estudiantes/:id_estudiante_profile': { method: 'GET', authRequired: true, targetPath: '/api/v1/estudiantes/:id_estudiante_profile' },
            '/notas/estudiantes/usuario/:id_usuario': { method: 'GET', authRequired: true, targetPath: '/api/v1/estudiantes/usuario/:id_usuario' },
            '/notas/estudiantes/brigada/:id_brigada': { method: 'GET', authRequired: true, targetPath: '/api/v1/estudiantes/brigada/:id_brigada' },
            '/notas/estudiantes/:id_estudiante_profile': { method: 'PUT', authRequired: true, targetPath: '/api/v1/estudiantes/:id_estudiante_profile' },
            '/notas/estudiantes/:id_estudiante_profile': { method: 'DELETE', authRequired: true, targetPath: '/api/v1/estudiantes/:id_estudiante_profile' },

            // Rutas de Facultades
            '/notas/facultades': { method: 'POST', authRequired: true, targetPath: '/api/v1/facultades' },
            '/notas/facultades': { method: 'GET', authRequired: true, targetPath: '/api/v1/facultades' },
            '/notas/facultades/:id_facultad': { method: 'GET', authRequired: true, targetPath: '/api/v1/facultades/:id_facultad' },
            '/notas/facultades/nombre/:nombre_facultad': { method: 'GET', authRequired: true, targetPath: '/api/v1/facultades/nombre/:nombre_facultad' },
            '/notas/facultades/:id_facultad': { method: 'PUT', authRequired: true, targetPath: '/api/v1/facultades/:id_facultad' },
            '/notas/facultades/:id_facultad': { method: 'DELETE', authRequired: true, targetPath: '/api/v1/facultades/:id_facultad' },

            // Rutas de Notas
            '/notas/notas': { method: 'POST', authRequired: true, targetPath: '/api/v1/notas' },
            '/notas/notas/:id_nota': { method: 'GET', authRequired: true, targetPath: '/api/v1/notas/:id_nota' },
            '/notas/notas/estudiante/:id_estudiante_profile': { method: 'GET', authRequired: true, targetPath: '/api/v1/notas/estudiante/:id_estudiante_profile' },
            '/notas/notas/estudiante/:id_estudiante_profile/año/:año': { method: 'GET', authRequired: true, targetPath: '/api/v1/notas/estudiante/:id_estudiante_profile/año/:año' },
            '/notas/notas/asignatura/:id_asignatura/estudiante/:id_estudiante_profile': { method: 'GET', authRequired: true, targetPath: '/api/v1/notas/asignatura/:id_asignatura/estudiante/:id_estudiante_profile' },
            '/notas/notas/:id_nota': { method: 'PUT', authRequired: true, targetPath: '/api/v1/notas/:id_nota' },
            '/notas/notas/:id_nota': { method: 'DELETE', authRequired: true, targetPath: '/api/v1/notas/:id_nota' },
            '/notas/notas/estudiante/:id_estudiante_profile/promedio': { method: 'GET', authRequired: true, targetPath: '/api/v1/notas/estudiante/:id_estudiante_profile/promedio' }

            // Añade más rutas según sea necesario
        }
    }

};
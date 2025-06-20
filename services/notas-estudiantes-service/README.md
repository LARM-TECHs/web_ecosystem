# **Guía de Pruebas de API: Microservicio de Notas de Estudiantes**

Este README.md se enfoca en cómo probar los endpoints del **Microservicio de Notas de Estudiantes** a través del **API Gateway** utilizando Postman.

## **Estructura Relevante del Proyecto**

Para este microservicio, la estructura clave y los puertos son:

your-project-root/  
├── api-gateway/            (Puerto principal: 4000\)  
└── services/  
    └── notas-estudiantes-service/ (Puerto interno: 3002\)

**El API Gateway se ejecuta en el puerto 4000\. Todas las solicitudes desde Postman deben dirigirse a este puerto, utilizando el prefijo /notas para acceder a este servicio.**

## **1\. Preparación Previa**

Antes de realizar cualquier prueba, asegúrate de que:

1. **Todas las dependencias** de notas-estudiantes-service y api-gateway (npm install) estén instaladas.  
2. **Los archivos .env** del notas-estudiantes-service y del api-gateway estén correctamente configurados (especialmente JWT\_SECRET debe ser el mismo en ambos, y NOTAS\_ESTUDIANTES\_SERVICE\_URL en el API Gateway debe apuntar a http://localhost:3002).  
3. **Todos los servicios relevantes estén ejecutándose:**  
   * user-auth-service (si aún no está en Postman, ya que necesitas generar tokens desde allí o su API Gateway ruta de login).  
   * notas-estudiantes-service: En su carpeta raíz, npm start (o npm run dev).  
   * api-gateway: En su carpeta raíz, npm start (o npm run dev).  
4. **Tu base de datos PostgreSQL** esté activa y accesible.

## **2\. Configuración de Postman (Recomendado)**

Para una experiencia de prueba más eficiente, configura un "Environment" en Postman:

1. En Postman, haz clic en el icono de "Environments" (normalmente arriba a la izquierda).  
2. Haz clic en el botón \+ para crear un nuevo entorno.  
3. Nómbralo, por ejemplo, Notas Service Dev.  
4. Añade las siguientes variables:  
   * Key: gatewayBaseUrl | Value: http://localhost:4000  
   * Key: authToken | Value: (Déjalo vacío por ahora, lo llenaremos después del login)

Ahora, puedes usar {{gatewayBaseUrl}} en tus URLs de solicitud.

## **3\. Obtener un Token JWT (Desde el API Gateway)**

Necesitarás un token JWT válido para acceder a la mayoría de las rutas protegidas.

* **Método**: POST  
* **URL**: {{gatewayBaseUrl}}/auth/login (Esta ruta va a tu user-auth-service a través del Gateway)  
* **Headers**:  
  * Content-Type: application/json  
* **Body (raw JSON)**:  
  {  
      "correo": "tu\_email@example.com",  
      "contraseña": "tu\_password"  
  }

  *Usa credenciales válidas. Si quieres probar roles específicos (admin, profesor, estudiante), usa credenciales de esas cuentas.*

Haz clic en **"Send"**. Deberías recibir una respuesta con un token JWT. **Copia el valor de token.** Luego, edita tu entorno de Postman y pega este token en la variable authToken (asegurándote de que comience con Bearer ). Ejemplo: Bearer eyJhbGciOiJIUzI1Ni....

## **4\. Pruebas de Endpoints del Servicio de Notas de Estudiantes**

**Base URL en Postman para todas las rutas de este servicio:** {{gatewayBaseUrl}}/notas

Para todas las rutas (excepto /notas/health), debes incluir el encabezado Authorization: {{authToken}}.

### **4.1. Ruta de Salud del Servicio**

* **Descripción**: Verifica si el microservicio está en funcionamiento.  
* **Método**: GET  
* **URL**: {{gatewayBaseUrl}}/notas/health  
* **Headers**: (Ninguno requerido)  
* **Body**: Vacío.  
* **Respuesta esperada**: Status: 200 OK y un JSON similar a:  
  {  
      "message": "Notas Estudiantes service is up and running\!"  
  }

### **4.2. Facultades**

* **Crear Facultad**  
  * **Método**: POST  
  * **URL**: {{gatewayBaseUrl}}/notas/facultades  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (Requiere **rol: admin**)  
  * **Body (raw JSON)**: {"nombre\_facultad": "Facultad de Ingeniería"}  
  * **Respuesta esperada**: Status: 201 Created y el objeto de la facultad creada.  
* **Obtener todas las Facultades**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/notas/facultades  
  * **Headers**: Authorization: {{authToken}}  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y un array de facultades.  
* **Obtener Facultad por ID**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/notas/facultades/:id\_facultad (Ej: /notas/facultades/1)  
  * **Headers**: Authorization: {{authToken}}  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y el objeto de la facultad.  
* **Obtener Facultad por Nombre**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/notas/facultades/nombre/:nombre\_facultad (Ej: /notas/facultades/nombre/Facultad%20de%20Ingeniería)  
  * **Headers**: Authorization: {{authToken}}  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y un array de facultades que coincidan.  
* **Actualizar Facultad**  
  * **Método**: PUT  
  * **URL**: {{gatewayBaseUrl}}/notas/facultades/:id\_facultad (Ej: /notas/facultades/1)  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (Requiere **rol: admin**)  
  * **Body (raw JSON)**: {"nombre\_facultad": "Facultad de Ingeniería y Ciencias"}  
  * **Respuesta esperada**: Status: 200 OK y un mensaje de éxito.  
* **Eliminar Facultad**  
  * **Método**: DELETE  
  * **URL**: {{gatewayBaseUrl}}/notas/facultades/:id\_facultad (Ej: /notas/facultades/1)  
  * **Headers**: Authorization: {{authToken}} (Requiere **rol: admin**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 204 No Content.

### **4.3. Carreras**

* **Crear Carrera**  
  * **Método**: POST  
  * **URL**: {{gatewayBaseUrl}}/notas/carreras  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (Requiere **rol: admin o profesor**)  
  * **Body (raw JSON)**: {"id\_facultad": 1, "nombre\_carrera": "Ingeniería Informática", "años": 5}  
  * **Respuesta esperada**: Status: 201 Created y el objeto de la carrera creada.  
* **Obtener todas las Carreras**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/notas/carreras  
  * **Headers**: Authorization: {{authToken}}  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y un array de carreras.  
* **Obtener Carrera por ID**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/notas/carreras/:id\_carrera (Ej: /notas/carreras/1)  
  * **Headers**: Authorization: {{authToken}}  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y el objeto de la carrera.  
* **Obtener Carreras por Facultad**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/notas/carreras/facultad/:id\_facultad (Ej: /notas/carreras/facultad/1)  
  * **Headers**: Authorization: {{authToken}}  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y un array de carreras.  
* **Obtener Carrera por Nombre**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/notas/carreras/nombre/:nombre\_carrera (Ej: /notas/carreras/nombre/Ingeniería%20Informática)  
  * **Headers**: Authorization: {{authToken}}  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y un array de carreras que coincidan.  
* **Actualizar Carrera**  
  * **Método**: PUT  
  * **URL**: {{gatewayBaseUrl}}/notas/carreras/:id\_carrera (Ej: /notas/carreras/1)  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (Requiere **rol: admin o profesor**)  
  * **Body (raw JSON)**: {"nombre\_carrera": "Ingeniería en Software", "años": 4}  
  * **Respuesta esperada**: Status: 200 OK y un mensaje de éxito.  
* **Eliminar Carrera**  
  * **Método**: DELETE  
  * **URL**: {{gatewayBaseUrl}}/notas/carreras/:id\_carrera (Ej: /notas/carreras/1)  
  * **Headers**: Authorization: {{authToken}} (Requiere **rol: admin**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 204 No Content.

### **4.4. Asignaturas**

* **Crear Asignatura**  
  * **Método**: POST  
  * **URL**: {{gatewayBaseUrl}}/notas/asignaturas  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (Requiere **rol: admin o profesor**)  
  * **Body (raw JSON)**: {"nombre\_asignatura": "Programación Avanzada"}  
  * **Respuesta esperada**: Status: 201 Created y el objeto de la asignatura creada.  
* **Asociar Asignatura a Carrera**  
  * **Método**: POST  
  * **URL**: {{gatewayBaseUrl}}/notas/asignaturas/carrera  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (Requiere **rol: admin o profesor**)  
  * **Body (raw JSON)**: {"id\_carrera": 1, "id\_asignatura": 1}  
  * **Respuesta esperada**: Status: 201 Created y el objeto de la relación creada.  
* **Obtener todas las Asignaturas**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/notas/asignaturas  
  * **Headers**: Authorization: {{authToken}}  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y un array de asignaturas.  
* **Obtener Asignatura por ID**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/notas/asignaturas/:id\_asignatura (Ej: /notas/asignaturas/1)  
  * **Headers**: Authorization: {{authToken}}  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y el objeto de la asignatura.  
* **Obtener Asignatura por Nombre**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/notas/asignaturas/nombre/:nombre\_asignatura (Ej: /notas/asignaturas/nombre/Programación%20Avanzada)  
  * **Headers**: Authorization: {{authToken}}  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y un array de asignaturas que coincidan.  
* **Obtener Asignaturas por Carrera**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/notas/asignaturas/carrera/:id\_carrera (Ej: /notas/asignaturas/carrera/1)  
  * **Headers**: Authorization: {{authToken}}  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y un array de asignaturas asociadas a la carrera.  
* **Obtener Asignatura por Carrera e ID de Asignatura**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/notas/asignaturas/carrera/:id\_carrera/id/:id\_asignatura (Ej: /notas/asignaturas/carrera/1/id/1)  
  * **Headers**: Authorization: {{authToken}}  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y el objeto de la asignatura.  
* **Obtener Asignaturas por Brigada**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/notas/asignaturas/brigada/:id\_brigada (Ej: /notas/asignaturas/brigada/1)  
  * **Headers**: Authorization: {{authToken}}  
  * **Body**: Vacío.  
  * **Notas**: Si el token es de estudiante, solo podrá acceder a las asignaturas de su propia brigada.  
  * **Respuesta esperada**: Status: 200 OK y un array de asignaturas.  
* **Actualizar Asignatura**  
  * **Método**: PUT  
  * **URL**: {{gatewayBaseUrl}}/notas/asignaturas/:id\_asignatura (Ej: /notas/asignaturas/1)  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (Requiere **rol: admin o profesor**)  
  * **Body (raw JSON)**: {"nombre\_asignatura": "Programación Web Avanzada"}  
  * **Respuesta esperada**: Status: 200 OK y un mensaje de éxito.  
* **Eliminar Asignatura**  
  * **Método**: DELETE  
  * **URL**: {{gatewayBaseUrl}}/notas/asignaturas/:id\_asignatura (Ej: /notas/asignaturas/1)  
  * **Headers**: Authorization: {{authToken}} (Requiere **rol: admin**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 204 No Content.  
* **Eliminar Asignatura de una Carrera**  
  * **Método**: DELETE  
  * **URL**: {{gatewayBaseUrl}}/notas/asignaturas/carrera/:id\_carrera/:id\_asignatura (Ej: /notas/asignaturas/carrera/1/1)  
  * **Headers**: Authorization: {{authToken}} (Requiere **rol: admin**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 204 No Content.

### **4.5. Brigadas**

* **Crear Brigada**  
  * **Método**: POST  
  * **URL**: {{gatewayBaseUrl}}/notas/brigadas  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (Requiere **rol: admin o profesor**)  
  * **Body (raw JSON)**: {"id\_carrera": 1, "nombre\_brigada": "B1", "año\_brigada": 2024, "añoFinal\_brigada": 2029}  
  * **Respuesta esperada**: Status: 201 Created y el objeto de la brigada creada.  
* **Obtener todas las Brigadas**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/notas/brigadas  
  * **Headers**: Authorization: {{authToken}}  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y un array de brigadas.  
* **Obtener Brigada por ID**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/notas/brigadas/:id\_brigada (Ej: /notas/brigadas/1)  
  * **Headers**: Authorization: {{authToken}}  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y el objeto de la brigada.  
* **Obtener Brigadas por Carrera**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/notas/brigadas/carrera/:id\_carrera (Ej: /notas/brigadas/carrera/1)  
  * **Headers**: Authorization: {{authToken}}  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y un array de brigadas.  
* **Obtener Brigada por Nombre**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/notas/brigadas/nombre/:nombre\_brigada (Ej: /notas/brigadas/nombre/B1)  
  * **Headers**: Authorization: {{authToken}}  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y un array de brigadas que coincidan.  
* **Actualizar Brigada**  
  * **Método**: PUT  
  * **URL**: {{gatewayBaseUrl}}/notas/brigadas/:id\_brigada (Ej: /notas/brigadas/1)  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (Requiere **rol: admin o profesor**)  
  * **Body (raw JSON)**: {"nombre\_brigada": "B1 (Actualizada)", "añoFinal\_brigada": 2030}  
  * **Respuesta esperada**: Status: 200 OK y el objeto de la brigada actualizada.  
* **Eliminar Brigada**  
  * **Método**: DELETE  
  * **URL**: {{gatewayBaseUrl}}/notas/brigadas/:id\_brigada (Ej: /notas/brigadas/1)  
  * **Headers**: Authorization: {{authToken}} (Requiere **rol: admin**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 204 No Content.

### **4.6. Estudiantes (Perfiles de Estudiantes)**

* **Crear Perfil de Estudiante**  
  * **Método**: POST  
  * **URL**: {{gatewayBaseUrl}}/notas/estudiantes  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (Requiere **rol: admin**)  
  * **Body (raw JSON)**: {"id\_usuario": 2, "nombre\_completo": "Juan Perez", "numero\_matricula": "2024001", "id\_brigada": 1}  
    * id\_usuario debe ser un ID de usuario existente del user-auth-service.  
  * **Respuesta esperada**: Status: 201 Created y el objeto del perfil de estudiante.  
* **Obtener todos los Perfiles de Estudiantes**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/notas/estudiantes  
  * **Headers**: Authorization: {{authToken}} (Requiere **rol: admin o profesor**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y un array de perfiles de estudiantes.  
* **Obtener mi Perfil de Estudiante**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/notas/estudiantes/me  
  * **Headers**: Authorization: {{authToken}} (Requiere **rol: estudiante y que el id\_usuario del token tenga un perfil de estudiante creado**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y el objeto del perfil de estudiante del usuario autenticado.  
* **Obtener Perfil de Estudiante por ID de Perfil**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/notas/estudiantes/:id\_estudiante\_profile (Ej: /notas/estudiantes/1)  
  * **Headers**: Authorization: {{authToken}} (Requiere **rol: admin, profesor o estudiante (solo su propio perfil)**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y el objeto del perfil de estudiante.  
* **Obtener Perfil de Estudiante por ID de Usuario**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/notas/estudiantes/usuario/:id\_usuario (Ej: /notas/estudiantes/usuario/2)  
  * **Headers**: Authorization: {{authToken}} (Requiere **rol: admin o profesor**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y el objeto del perfil de estudiante.  
* **Obtener Estudiantes por Brigada**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/notas/estudiantes/brigada/:id\_brigada (Ej: /notas/estudiantes/brigada/1)  
  * **Headers**: Authorization: {{authToken}} (Requiere **rol: admin o profesor**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y un array de perfiles de estudiantes.  
* **Actualizar Perfil de Estudiante**  
  * **Método**: PUT  
  * **URL**: {{gatewayBaseUrl}}/notas/estudiantes/:id\_estudiante\_profile (Ej: /notas/estudiantes/1)  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (Requiere **rol: admin o el estudiante actualizando su propio perfil**)  
  * **Body (raw JSON)**: {"nombre\_completo": "Juan Pérez Actualizado", "numero\_matricula": "2024002"}  
  * **Respuesta esperada**: Status: 200 OK y un mensaje de éxito.  
* **Eliminar Perfil de Estudiante**  
  * **Método**: DELETE  
  * **URL**: {{gatewayBaseUrl}}/notas/estudiantes/:id\_estudiante\_profile (Ej: /notas/estudiantes/1)  
  * **Headers**: Authorization: {{authToken}} (Requiere **rol: admin**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 204 No Content.

### **4.7. Notas**

* **Crear Nota**  
  * **Método**: POST  
  * **URL**: {{gatewayBaseUrl}}/notas/notas  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (Requiere **rol: profesor o admin**)  
  * **Body (raw JSON)**: {"id\_estudiante\_profile": 1, "id\_asignatura": 1, "valor": 4.5, "año": 2024}  
    * Asegúrate de que id\_estudiante\_profile y id\_asignatura existan previamente.  
  * **Respuesta esperada**: Status: 201 Created y el objeto de la nota creada.  
* **Obtener Nota por ID**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/notas/notas/:id\_nota (Ej: /notas/notas/1)  
  * **Headers**: Authorization: {{authToken}} (Requiere **rol: admin, profesor o estudiante (solo su propia nota)**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y el objeto de la nota.  
* **Obtener Notas por Estudiante**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/notas/notas/estudiante/:id\_estudiante\_profile (Ej: /notas/notas/estudiante/1)  
  * **Headers**: Authorization: {{authToken}} (Requiere **rol: admin, profesor o estudiante (solo sus propias notas)**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y un array de notas del estudiante.  
* **Obtener Notas por Estudiante y Año**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/notas/notas/estudiante/:id\_estudiante\_profile/año/:año (Ej: /notas/notas/estudiante/1/año/2024)  
  * **Headers**: Authorization: {{authToken}} (Requiere **rol: admin, profesor o estudiante (solo sus propias notas)**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y un array de notas del estudiante para ese año.  
* **Obtener Nota por Asignatura y Estudiante**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/notas/notas/asignatura/:id\_asignatura/estudiante/:id\_estudiante\_profile (Ej: /notas/notas/asignatura/1/estudiante/1)  
  * **Headers**: Authorization: {{authToken}} (Requiere **rol: admin, profesor o estudiante (solo su propia nota)**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y un array de notas para esa asignatura y estudiante.  
* **Actualizar Nota**  
  * **Método**: PUT  
  * **URL**: {{gatewayBaseUrl}}/notas/notas/:id\_nota (Ej: /notas/notas/1)  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (Requiere **rol: profesor o admin**)  
  * **Body (raw JSON)**: {"valor": 4.8}  
  * **Respuesta esperada**: Status: 200 OK y el objeto de la nota actualizada.  
* **Eliminar Nota**  
  * **Método**: DELETE  
  * **URL**: {{gatewayBaseUrl}}/notas/notas/:id\_nota (Ej: /notas/notas/1)  
  * **Headers**: Authorization: {{authToken}} (Requiere **rol: profesor o admin**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 204 No Content.  
* **Obtener Promedio de Estudiante**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/notas/notas/estudiante/:id\_estudiante\_profile/promedio (Ej: /notas/notas/estudiante/1/promedio)  
  * **Headers**: Authorization: {{authToken}} (Requiere **rol: admin, profesor o estudiante (solo su propio promedio)**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y un JSON con el promedio.

¡Esta guía detallada debería ayudarte a probar exhaustivamente el microservicio de Notas de Estudiantes a través de tu API Gateway\!
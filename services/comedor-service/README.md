# **Guía de Pruebas de API: Microservicio de Comedor**

Este README.md se enfoca en cómo probar los endpoints del **Microservicio de Comedor** a través del **API Gateway** utilizando Postman.

## **Estructura Relevante del Proyecto**

Para este microservicio, la estructura clave y los puertos son:

your-project-root/  
├── api-gateway/            (Puerto principal: 4000\)  
└── services/  
    └── comedor-service/    (Puerto interno: 3005\)

**El API Gateway se ejecuta en el puerto 4000\. Todas las solicitudes desde Postman deben dirigirse a este puerto, utilizando el prefijo /comedor para acceder a este servicio.**

## **1\. Preparación Previa**

Antes de realizar cualquier prueba, asegúrate de que:

1. **Todas las dependencias** de comedor-service y api-gateway (npm install) estén instaladas.  
2. **Los archivos .env** del comedor-service y del api-gateway estén correctamente configurados (especialmente JWT\_SECRET debe ser el mismo en ambos, y COMEDOR\_SERVICE\_URL en el API Gateway debe apuntar a http://localhost:3005).  
3. **Todos los servicios relevantes estén ejecutándose:**  
   * user-auth-service (Necesitas generar tokens desde allí o su API Gateway ruta de login).  
   * comedor-service: En su carpeta raíz, npm start (o npm run dev).  
   * api-gateway: En su carpeta raíz, npm start (o npm run dev).  
4. **Tu base de datos PostgreSQL** esté activa y accesible, y el esquema comedor esté sincronizado.

## **2\. Configuración de Postman (Recomendado)**

Para una experiencia de prueba más eficiente, configura un "Environment" en Postman:

1. En Postman, haz clic en el icono de "Environments" (normalmente arriba a la izquierda).  
2. Haz clic en el botón \+ para crear un nuevo entorno.  
3. Nómbralo, por ejemplo, Comedor Service Dev.  
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

  *Usa credenciales válidas. Si quieres probar roles específicos (admin, estudiante, staff\_comedor), asegúrate de tener usuarios con esos roles creados previamente en tu user-auth-service.*

Haz clic en **"Send"**. Deberías recibir una respuesta con un token JWT. **Copia el valor de token.** Luego, edita tu entorno de Postman y pega este token en la variable authToken (asegurándote de que comience con Bearer ). Ejemplo: Bearer eyJhbGciOiJIUzI1Ni....

## **4\. Pruebas de Endpoints del Servicio de Comedor**

**Base URL en Postman para todas las rutas de este servicio:** {{gatewayBaseUrl}}/comedor

Para todas las rutas (excepto /comedor/health), debes incluir el encabezado Authorization: {{authToken}}.

### **4.1. Ruta de Salud del Servicio**

* **Descripción**: Verifica si el microservicio está en funcionamiento.  
* **Método**: GET  
* **URL**: {{gatewayBaseUrl}}/comedor/health  
* **Headers**: (Ninguno requerido)  
* **Body**: Vacío.  
* **Respuesta esperada**: Status: 200 OK y un JSON similar a:  
  {  
      "message": "Comedor service is up and running\!"  
  }

### **4.2. Gestión de Menús**

* **Crear/Actualizar Menú**  
  * **Método**: POST  
  * **URL**: {{gatewayBaseUrl}}/comedor/menus  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (Requiere **rol: admin o staff\_comedor**)  
  * **Body (raw JSON)**:  
    {  
        "date": "2025-07-01",  
        "breakfast": "Panqueques con fruta",  
        "lunch": "Arroz con pollo y ensalada",  
        "dinner": "Sopa de verduras y tostadas"  
    }

  * **Respuesta esperada**: Status: 201 Created (si es nuevo) o 200 OK (si se actualiza) y el objeto del menú.  
* **Obtener Menú del Día Actual**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/comedor/menus/today  
  * **Headers**: Authorization: {{authToken}} (Cualquier rol autenticado)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y el objeto del menú para hoy (crea uno por defecto si no existe).  
* **Obtener Menú por Fecha Específica**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/comedor/menus/:date (Ej: /comedor/menus/2025-07-01)  
  * **Headers**: Authorization: {{authToken}} (Cualquier rol autenticado)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y el objeto del menú, o 404 Not Found con mensaje si no existe.  
* **Obtener Todos los Menús (últimos 30\)**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/comedor/menus  
  * **Headers**: Authorization: {{authToken}} (Requiere **rol: admin o staff\_comedor**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y un array de objetos de menú.  
* **Eliminar Menú por Fecha**  
  * **Método**: DELETE  
  * **URL**: {{gatewayBaseUrl}}/comedor/menus/:date (Ej: /comedor/menus/2025-07-01)  
  * **Headers**: Authorization: {{authToken}} (Requiere **rol: admin**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y un mensaje de éxito, o 404 Not Found.

### **4.3. Gestión de Estudiantes del Comedor**

* **Registrar Estudiante del Comedor**  
  * **Método**: POST  
  * **URL**: {{gatewayBaseUrl}}/comedor/students-comedor  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (Requiere **rol: admin o estudiante (solo para registrarse a sí mismo)**)  
  * **Body (raw JSON)**:  
    {  
        "student\_id": "STU001",      
        "name": "María Gámez",  
        "email": "maria.gamez@example.com",  
        "user\_id": 101             
    }

    * user\_id debe ser un ID de usuario existente del user-auth-service con rol 'estudiante' (o el propio user\_id del token si el rol es estudiante).  
    * student\_id puede ser un identificador de matrícula o similar (no es una FK física a notas-estudiantes-service).  
  * **Respuesta esperada**: Status: 201 Created y el objeto del estudiante del comedor registrado.  
* **Obtener Todos los Estudiantes del Comedor**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/comedor/students-comedor  
  * **Headers**: Authorization: {{authToken}} (Requiere **rol: admin o staff\_comedor**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y un array de objetos de estudiantes del comedor.  
* **Obtener Mi Perfil de Estudiante del Comedor**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/comedor/students-comedor/me  
  * **Headers**: Authorization: {{authToken}} (Requiere **rol: estudiante y que el user\_id del token tenga un perfil de estudiante de comedor creado**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y el objeto del perfil del estudiante del comedor.  
* **Obtener Estudiante del Comedor por ID Interno**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/comedor/students-comedor/:id (Ej: /comedor/students-comedor/1)  
  * **Headers**: Authorization: {{authToken}} (Requiere **rol: admin o staff\_comedor**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y el objeto del estudiante del comedor, o 404 Not Found.  
* **Actualizar Estudiante del Comedor**  
  * **Método**: PUT  
  * **URL**: {{gatewayBaseUrl}}/comedor/students-comedor/:id (Ej: /comedor/students-comedor/1)  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (Requiere **rol: admin o staff\_comedor**)  
  * **Body (raw JSON)**:  
    {  
        "name": "María Gámez Actualizada",  
        "email": "maria.g.updated@example.com"  
    }

  * **Respuesta esperada**: Status: 200 OK y el objeto actualizado del estudiante.  
* **Eliminar Estudiante del Comedor**  
  * **Método**: DELETE  
  * **URL**: {{gatewayBaseUrl}}/comedor/students-comedor/:id (Ej: /comedor/students-comedor/1)  
  * **Headers**: Authorization: {{authToken}} (Requiere **rol: admin**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y un mensaje de éxito, o 404 Not Found.

### **4.4. Gestión de Personal del Comedor (staff\_comedor)**

* **Registrar Miembro del Personal**  
  * **Método**: POST  
  * **URL**: {{gatewayBaseUrl}}/comedor/staff-comedor  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (Requiere **rol: admin**)  
  * **Body (raw JSON)**:  
    {  
        "staff\_id": "EMP001",  
        "name": "Carlos Ruíz",  
        "role": "staff\_comedor",  
        "user\_id": 201   
    }

    * user\_id es opcional, pero si se proporciona, debe ser un ID de usuario existente del user-auth-service.  
  * **Respuesta esperada**: Status: 201 Created y el objeto del personal registrado.  
* **Obtener Todos los Miembros del Personal**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/comedor/staff-comedor  
  * **Headers**: Authorization: {{authToken}} (Requiere **rol: admin**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y un array de objetos de personal.  
* **Obtener Miembro del Personal por ID Interno**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/comedor/staff-comedor/:id (Ej: /comedor/staff-comedor/1)  
  * **Headers**: Authorization: {{authToken}} (Requiere **rol: admin**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y el objeto del personal, o 404 Not Found.  
* **Actualizar Miembro del Personal**  
  * **Método**: PUT  
  * **URL**: {{gatewayBaseUrl}}/comedor/staff-comedor/:id (Ej: /comedor/staff-comedor/1)  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (Requiere **rol: admin**)  
  * **Body (raw JSON)**:  
    {  
        "name": "Carlos Ruíz (Actualizado)",  
        "role": "supervisor\_comedor"  
    }

  * **Respuesta esperada**: Status: 200 OK y el objeto actualizado del personal.  
* **Eliminar Miembro del Personal**  
  * **Método**: DELETE  
  * **URL**: {{gatewayBaseUrl}}/comedor/staff-comedor/:id (Ej: /comedor/staff-comedor/1)  
  * **Headers**: Authorization: {{authToken}} (Requiere **rol: admin**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y un mensaje de éxito, o 404 Not Found.

### **4.5. Funcionalidad de Códigos QR (Staff)**

* **Generar o Obtener QR para Estudiante (lado del Estudiante)**  
  * **Descripción**: Un estudiante usa esta ruta para obtener su QR del día.  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/comedor/students/:studentComedorId/qr (Ej: /comedor/students/1/qr)  
    * studentComedorId es el id interno del estudiante en la tabla students\_comedor.  
  * **Headers**: Authorization: {{authToken}} (Requiere **rol: estudiante (para su propio studentComedorId), admin o staff\_comedor**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y un JSON con el qrCode (Data URL base64 de la imagen), qrId, menuId, date, used y studentComedorId.  
* **Validar Código QR (lado del Personal)**  
  * **Descripción**: El personal del comedor escanea un QR para validar la entrada.  
  * **Método**: POST  
  * **URL**: {{gatewayBaseUrl}}/comedor/staff-comedor/validate-qr  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (Requiere **rol: admin o staff\_comedor**)  
  * **Body (raw JSON)**:  
    {  
        "qrData": "CONTENIDO\_DEL\_QR\_GENERADO\_PREVIAMENTE"  
    }

    * qrData es la cadena de texto que fue incrustada en el código QR cuando se generó (ej. STU001-2025-07-01-abcdef1234567890).  
  * **Respuesta esperada**: Status: 200 OK y {"valid": true, "message": "Código QR válido..."} si es exitoso y no usado. 400 Bad Request o 404 Not Found con mensaje apropiado si inválido o ya usado.  
* **Obtener Historial de QRs (para Personal)**  
  * **Descripción**: Permite al personal consultar QRs utilizados.  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/comedor/staff-comedor/qr-history  
  * **Query Params (Opcionales)**: date=YYYY-MM-DD, studentComedorId=ID, used=true/false  
  * **Headers**: Authorization: {{authToken}} (Requiere **rol: admin o staff\_comedor**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y un array de registros de QR, incluyendo detalles del estudiante y menú asociados.  
* **Obtener Detalles de un QR Específico**  
  * **Descripción**: Obtiene la información detallada de un QR específico por su qrId interno.  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/comedor/staff-comedor/qrcodes/:qrId (Ej: /comedor/staff-comedor/qrcodes/1)  
  * **Headers**: Authorization: {{authToken}} (Requiere **rol: admin o staff\_comedor**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y el objeto del registro QR con detalles del estudiante y menú, incluyendo la imagen QR en base64.

¡Con esta guía, deberías tener todo lo necesario para probar exhaustivamente tu nuevo microservicio de Comedor a través del API Gateway\! ¡Mucha suerte con las pruebas\!
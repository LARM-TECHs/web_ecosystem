# **Guía de Pruebas de API: Microservicio de Librería**

Este README.md proporciona una guía completa para probar los endpoints de tu microservicio de librería. Cubriremos dos escenarios: pruebas directas al microservicio (útiles para depuración) y pruebas a través del API Gateway (que es cómo interactuarán tus clientes en producción).

## **Estructura del Proyecto**

Tu ecosistema de microservicios relevante para este servicio es:

your-project-root/  
├── api-gateway/            (Puerto principal: 4000\)  
└── services/  
    ├── user-auth-service/  (Puerto interno: 3000\)  
    └── libreria-service/   (Puerto interno: 3004\)

**Recordatorio**:

* El libreria-service se ejecuta en el puerto **3004**.  
* El user-auth-service se ejecuta en el puerto **3000**.  
* El **API Gateway se ejecuta en el puerto 4000**.

## **1\. Preparación Previa**

Antes de realizar cualquier prueba, asegúrate de que:

1. **Todas las dependencias** de libreria-service, user-auth-service, y api-gateway (npm install) estén instaladas.  
2. **Los archivos .env** de cada servicio (libreria-service/.env, user-auth-service/.env) y del api-gateway/.env estén correctamente configurados. Asegúrate de que JWT\_SECRET sea idéntico en todos, y que las URLs de los servicios (AUTH\_SERVICE\_URL, LIBRERIA\_SERVICE\_URL) en api-gateway/.env apunten a los puertos correctos.  
3. **Todos los servicios y el API Gateway estén ejecutándose:**  
   * En la raíz de user-auth-service: npm start (o npm run dev).  
   * En la raíz de libreria-service: npm start (o npm run dev).  
   * En la raíz de api-gateway: npm start (o npm run dev).  
   * Verifica las consolas de cada servicio para asegurarte de que no haya errores al iniciar.  
4. **Tu base de datos PostgreSQL** esté activa y accesible. El libreria-service creará el esquema libreria y sus tablas automáticamente al iniciar.

## **2\. Configuración de Postman (Esencial)**

Para una experiencia de prueba eficiente, configura un "Environment" en Postman:

1. En Postman, haz clic en el icono de "Environments".  
2. Crea o selecciona un entorno existente (ej., Microservices Dev).  
3. Añade las siguientes variables:  
   * Key: gatewayBaseUrl | Value: http://localhost:4000  
   * Key: libreriaServiceBaseUrl | Value: http://localhost:3004/api/v1 (para pruebas directas)  
   * Key: authToken | Value: (Déjalo vacío por ahora, lo llenaremos después del login)

## **3\. Obtener un Token JWT**

Necesitarás un token JWT válido para acceder a las rutas protegidas.

1. **Crea una solicitud POST para el Login (a través del API Gateway)**:  
   * **Método**: POST  
   * **URL**: {{gatewayBaseUrl}}/auth/login  
   * **Headers**: Content-Type: application/json  
   * **Body (raw JSON)**:  
     {  
         "correo": "tu\_email@example.com",  
         "contraseña": "tu\_password"  
     }

   * **Importante**: Utiliza credenciales de usuarios que hayas registrado en tu user-auth-service. Para probar roles específicos, asegúrate de tener usuarios con roles admin, profesor y estudiante.  
2. **Envía la solicitud**. Deberías recibir una respuesta Status: 200 OK con un token JWT y los detalles del user.  
3. **Copia el Token**: Desde la respuesta, copia el valor completo del token.  
4. **Actualiza la Variable de Entorno authToken**: En tu entorno de Postman, actualiza la variable authToken pegando el token copiado, **asegurándote de que comience con Bearer**  (ej. Bearer eyJhbGciOiJIUzI1Ni...). Esto es crucial para los encabezados de autorización.

## **4\. Pruebas Directas al Microservicio de Librería (Sin API Gateway)**

Estas pruebas son útiles para verificar que el libreria-service funciona de forma independiente. Asegúrate de que tu libreria-service esté en ejecución.

**Base URL en Postman para estas pruebas:** {{libreriaServiceBaseUrl}}

Para todas las rutas (excepto /health), debes incluir el encabezado **Authorization: {{authToken}}** (aunque en un escenario real de microservicios, estos servicios no re-validarían el JWT; solo esperarían los x-user-\* headers inyectados por el Gateway. Aquí lo incluimos por conveniencia en la prueba directa).

### **4.1. Ruta de Salud Directa (/api/v1/health)**

* **Descripción**: Verifica si el microservicio de librería está en funcionamiento.  
* **Método**: GET  
* **URL**: {{libreriaServiceBaseUrl}}/health  
* **Headers**: (Ninguno requerido)  
* **Body**: Vacío.  
* **Respuesta esperada**: Status: 200 OK y un JSON similar a:  
  {  
      "message": "Libreria service is up and running\!"  
  }

### **4.2. Gestión de Libros (Directa)**

**Prefijo de URL en Postman:** {{libreriaServiceBaseUrl}}/libros

* **Crear un Libro**  
  * **Método**: POST  
  * **URL**: {{libreriaServiceBaseUrl}}/libros  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (**Requiere rol: admin o profesor**)  
  * **Body (raw JSON)**:  
    {  
        "title": "Cien Años de Soledad",  
        "author": "Gabriel García Márquez",  
        "classification": "Ficción",  
        "publicationDate": "1967-05-30",  
        "copies": 5,  
        "type": "Físico",  
        "location": "A-12"  
    }

  * **Respuesta esperada**: Status: 201 Created y el objeto del libro creado.  
* **Obtener Todos los Libros**  
  * **Método**: GET  
  * **URL**: {{libreriaServiceBaseUrl}}/libros  
  * **Headers**: Authorization: {{authToken}}  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y un array de libros.  
* **Obtener Libro por ID**  
  * **Método**: GET  
  * **URL**: {{libreriaServiceBaseUrl}}/libros/:id\_libro (Ej: {{libreriaServiceBaseUrl}}/libros/1)  
  * **Headers**: Authorization: {{authToken}}  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y el objeto del libro.  
* **Buscar Libros**  
  * **Método**: GET  
  * **URL**: {{libreriaServiceBaseUrl}}/libros/search?query=Cien (Reemplaza el query)  
  * **Headers**: Authorization: {{authToken}}  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y un array de libros que coincidan.  
* **Actualizar Libro**  
  * **Método**: PUT  
  * **URL**: {{libreriaServiceBaseUrl}}/libros/:id\_libro (Ej: {{libreriaServiceBaseUrl}}/libros/1)  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (**Requiere rol: admin o profesor**)  
  * **Body (raw JSON)**: {"copies": 4}  
  * **Respuesta esperada**: Status: 200 OK y el objeto del libro actualizado.  
* **Eliminar Libro**  
  * **Método**: DELETE  
  * **URL**: {{libreriaServiceBaseUrl}}/libros/:id\_libro (Ej: {{libreriaServiceBaseUrl}}/libros/1)  
  * **Headers**: Authorization: {{authToken}} (**Requiere rol: admin**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK con mensaje de éxito.

### **4.3. Gestión de Préstamos (Directa)**

**Prefijo de URL en Postman:** {{libreriaServiceBaseUrl}}/prestamos

* **Registrar un Préstamo**  
  * **Método**: POST  
  * **URL**: {{libreriaServiceBaseUrl}}/prestamos  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (**Requiere rol: admin, profesor o estudiante**)  
  * **Body (raw JSON)**:  
    {  
        "id\_libro": 1,         // ID de un libro existente  
        "id\_usuario": 101,     // ID de un usuario existente del auth-service (si eres estudiante, usa tu propio id\_usuario)  
        "loanDate": "2024-06-27",  
        "returnDate": "2024-07-27"  
    }

  * **Respuesta esperada**: Status: 201 Created y el objeto del préstamo. Las copias del libro deben reducirse.  
* **Obtener Todos los Préstamos**  
  * **Método**: GET  
  * **URL**: {{libreriaServiceBaseUrl}}/prestamos  
  * **Headers**: Authorization: {{authToken}} (**Requiere rol: admin, profesor o estudiante**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK. Los admin verán todos, profesor/estudiante solo los suyos.  
* **Obtener Préstamo por ID**  
  * **Método**: GET  
  * **URL**: {{libreriaServiceBaseUrl}}/prestamos/:id\_prestamo (Ej: {{libreriaServiceBaseUrl}}/prestamos/1)  
  * **Headers**: Authorization: {{authToken}} (**Requiere rol: admin, profesor o el estudiante dueño**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y el objeto del préstamo.  
* **Obtener Préstamos por ID de Usuario**  
  * **Método**: GET  
  * **URL**: {{libreriaServiceBaseUrl}}/prestamos/usuario/:id\_usuario (Ej: {{libreriaServiceBaseUrl}}/prestamos/usuario/101)  
  * **Headers**: Authorization: {{authToken}} (**Requiere rol: admin, profesor o el propio estudiante**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y un array de préstamos.  
* **Marcar Préstamo como Devuelto**  
  * **Método**: PUT  
  * **URL**: {{libreriaServiceBaseUrl}}/prestamos/:id\_prestamo/devolver (Ej: {{libreriaServiceBaseUrl}}/prestamos/1/devolver)  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (**Requiere rol: admin o profesor**)  
  * **Body (raw JSON)**: {"actualReturnDate": "2024-07-20"} (Opcional, si no se envía, usa la fecha actual)  
  * **Respuesta esperada**: Status: 200 OK. El estado del préstamo debe cambiar a 'devuelto' y las copias del libro deben aumentar.  
* **Eliminar Préstamo**  
  * **Método**: DELETE  
  * **URL**: {{libreriaServiceBaseUrl}}/prestamos/:id\_prestamo (Ej: {{libreriaServiceBaseUrl}}/prestamos/1)  
  * **Headers**: Authorization: {{authToken}} (**Requiere rol: admin**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK con mensaje de éxito.

### **4.4. Gestión de Selecciones (Directa)**

**Prefijo de URL en Postman:** {{libreriaServiceBaseUrl}}/selecciones

* **Crear una Selección (de libro existente)**  
  * **Método**: POST  
  * **URL**: {{libreriaServiceBaseUrl}}/selecciones  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (**Requiere rol: admin, profesor o estudiante**)  
  * **Body (raw JSON)**:  
    {  
        "id\_libro": 1, // ID de un libro existente  
        "quantity": 2  
        // Si tu modelo Seleccion tiene id\_usuario, incluirlo aquí  
        // "id\_usuario": 101  
    }

  * **Respuesta esperada**: Status: 201 Created y el objeto de la selección.  
* **Crear una Selección (sugerencia de libro nuevo)**  
  * **Método**: POST  
  * **URL**: {{libreriaServiceBaseUrl}}/selecciones  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (**Requiere rol: admin, profesor o estudiante**)  
  * **Body (raw JSON)**:  
    {  
        "book": "El Silmarillion",  
        "author": "J.R.R. Tolkien",  
        "publisher": "Minotauro",  
        "quantity": 1  
        // Si tu modelo Seleccion tiene id\_usuario, incluirlo aquí  
        // "id\_usuario": 101  
    }

  * **Respuesta esperada**: Status: 201 Created y el objeto de la selección.  
* **Obtener Todas las Selecciones**  
  * **Método**: GET  
  * **URL**: {{libreriaServiceBaseUrl}}/selecciones  
  * **Headers**: Authorization: {{authToken}} (**Requiere rol: admin o profesor**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y un array de selecciones.  
* **Obtener Selección por ID**  
  * **Método**: GET  
  * **URL**: {{libreriaServiceBaseUrl}}/selecciones/:id\_seleccion (Ej: {{libreriaServiceBaseUrl}}/selecciones/1)  
  * **Headers**: Authorization: {{authToken}} (**Requiere rol: admin o profesor**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK y el objeto de la selección.  
* **Actualizar Selección**  
  * **Método**: PUT  
  * **URL**: {{libreriaServiceBaseUrl}}/selecciones/:id\_seleccion (Ej: {{libreriaServiceBaseUrl}}/selecciones/1)  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (**Requiere rol: admin o profesor**)  
  * **Body (raw JSON)**: {"quantity": 3}  
  * **Respuesta esperada**: Status: 200 OK y el objeto de la selección actualizada.  
* **Eliminar Selección**  
  * **Método**: DELETE  
  * **URL**: {{libreriaServiceBaseUrl}}/selecciones/:id\_seleccion (Ej: {{libreriaServiceBaseUrl}}/selecciones/1)  
  * **Headers**: Authorization: {{authToken}} (**Requiere rol: admin**)  
  * **Body**: Vacío.  
  * **Respuesta esperada**: Status: 200 OK con mensaje de éxito.

## **5\. Pruebas a través del API Gateway**

Estas son las pruebas que simulan cómo tus clientes interactuarán con el servicio de librería. Asegúrate de que tanto el libreria-service como el api-gateway estén en ejecución.

**Base URL en Postman para estas pruebas:** {{gatewayBaseUrl}}/libreria

Para todas las rutas (excepto /libreria/health), debes incluir el encabezado **Authorization: {{authToken}}**.

### **5.1. Ruta de Salud del Servicio (Vía Gateway)**

* **Descripción**: Verifica si el microservicio de librería está en funcionamiento a través del Gateway.  
* **Método**: GET  
* **URL**: {{gatewayBaseUrl}}/libreria/health  
* **Headers**: (Ninguno requerido)  
* **Body**: Vacío.  
* **Respuesta esperada**: Status: 200 OK y un JSON similar a:  
  {  
      "message": "Libreria service is up and running\!"  
  }

### **5.2. Gestión de Libros (Vía Gateway)**

**Prefijo de URL en Postman:** {{gatewayBaseUrl}}/libreria/libros

* **Crear un Libro**  
  * **Método**: POST  
  * **URL**: {{gatewayBaseUrl}}/libreria/libros  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (**Requiere rol: admin o profesor**)  
  * **Body (raw JSON)**: (Usa el mismo ejemplo que en las pruebas directas)  
  * **Respuesta esperada**: Status: 201 Created.  
* **Obtener Todos los Libros**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/libreria/libros  
  * **Headers**: Authorization: {{authToken}}  
  * **Respuesta esperada**: Status: 200 OK.  
* **Obtener Libro por ID**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/libreria/libros/:id\_libro  
  * **Headers**: Authorization: {{authToken}}  
  * **Respuesta esperada**: Status: 200 OK.  
* **Buscar Libros**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/libreria/libros/search?query=Cien  
  * **Headers**: Authorization: {{authToken}}  
  * **Respuesta esperada**: Status: 200 OK.  
* **Actualizar Libro**  
  * **Método**: PUT  
  * **URL**: {{gatewayBaseUrl}}/libreria/libros/:id\_libro  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (**Requiere rol: admin o profesor**)  
  * **Body (raw JSON)**: (Usa el mismo ejemplo)  
  * **Respuesta esperada**: Status: 200 OK.  
* **Eliminar Libro**  
  * **Método**: DELETE  
  * **URL**: {{gatewayBaseUrl}}/libreria/libros/:id\_libro  
  * **Headers**: Authorization: {{authToken}} (**Requiere rol: admin**)  
  * **Respuesta esperada**: Status: 200 OK.

### **5.3. Gestión de Préstamos (Vía Gateway)**

**Prefijo de URL en Postman:** {{gatewayBaseUrl}}/libreria/prestamos

* **Registrar un Préstamo**  
  * **Método**: POST  
  * **URL**: {{gatewayBaseUrl}}/libreria/prestamos  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (**Requiere rol: admin, profesor o estudiante**)  
  * **Body (raw JSON)**: (Usa el mismo ejemplo)  
  * **Respuesta esperada**: Status: 201 Created.  
* **Obtener Todos los Préstamos**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/libreria/prestamos  
  * **Headers**: Authorization: {{authToken}}  
  * **Respuesta esperada**: Status: 200 OK.  
* **Obtener Préstamo por ID**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/libreria/prestamos/:id\_prestamo  
  * **Headers**: Authorization: {{authToken}}  
  * **Respuesta esperada**: Status: 200 OK.  
* **Obtener Préstamos por ID de Usuario**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/libreria/prestamos/usuario/:id\_usuario  
  * **Headers**: Authorization: {{authToken}}  
  * **Respuesta esperada**: Status: 200 OK.  
* **Marcar Préstamo como Devuelto**  
  * **Método**: PUT  
  * **URL**: {{gatewayBaseUrl}}/libreria/prestamos/:id\_prestamo/devolver  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (**Requiere rol: admin o profesor**)  
  * **Body (raw JSON)**: (Usa el mismo ejemplo)  
  * **Respuesta esperada**: Status: 200 OK.  
* **Eliminar Préstamo**  
  * **Método**: DELETE  
  * **URL**: {{gatewayBaseUrl}}/libreria/prestamos/:id\_prestamo  
  * **Headers**: Authorization: {{authToken}} (**Requiere rol: admin**)  
  * **Respuesta esperada**: Status: 200 OK.

### **5.4. Gestión de Selecciones (Vía Gateway)**

**Prefijo de URL en Postman:** {{gatewayBaseUrl}}/libreria/selecciones

* **Crear una Selección**  
  * **Método**: POST  
  * **URL**: {{gatewayBaseUrl}}/libreria/selecciones  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (**Requiere rol: admin, profesor o estudiante**)  
  * **Body (raw JSON)**: (Usa los ejemplos de libro existente o sugerencia de libro nuevo)  
  * **Respuesta esperada**: Status: 201 Created.  
* **Obtener Todas las Selecciones**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/libreria/selecciones  
  * **Headers**: Authorization: {{authToken}} (**Requiere rol: admin o profesor**)  
  * **Respuesta esperada**: Status: 200 OK.  
* **Obtener Selección por ID**  
  * **Método**: GET  
  * **URL**: {{gatewayBaseUrl}}/libreria/selecciones/:id\_seleccion  
  * **Headers**: Authorization: {{authToken}} (**Requiere rol: admin o profesor**)  
  * **Respuesta esperada**: Status: 200 OK.  
* **Actualizar Selección**  
  * **Método**: PUT  
  * **URL**: {{gatewayBaseUrl}}/libreria/selecciones/:id\_seleccion  
  * **Headers**: Content-Type: application/json, Authorization: {{authToken}} (**Requiere rol: admin o profesor**)  
  * **Body (raw JSON)**: (Usa el mismo ejemplo)  
  * **Respuesta esperada**: Status: 200 OK.  
* **Eliminar Selección**  
  * **Método**: DELETE  
  * **URL**: {{gatewayBaseUrl}}/libreria/selecciones/:id\_seleccion  
  * **Headers**: Authorization: {{authToken}} (**Requiere rol: admin**)  
  * **Respuesta esperada**: Status: 200 OK.

¡Esta guía completa te permitirá probar a fondo tu microservicio de Librería\! Si tienes alguna pregunta durante las pruebas, no dudes en consultarme.
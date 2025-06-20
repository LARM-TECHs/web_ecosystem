# Estructura del Proyecto

La estructura del proyecto de la API de usuarios es la siguiente:

```
usuarios
├── config
│   └── database.js
├── controllers
│   └── auth.controller.js  <-- Renombrado para mayor claridad
├── middleware
│   └── auth.middleware.js
├── models
│   └── Usuario.js
├── routes
│   └── auth.routes.js
├── services
│   └── user.service.js     <-- Nuevo archivo para la lógica de negocio
├── utils
│   └── jwt.js
├── .env                    <-- Nuevo archivo de variables de entorno
├── package.json            <-- Nuevo archivo de configuración de dependencias
└── server.js               <-- Nuevo archivo principal del servidor
```


# Guía de Uso de la API de Autenticación

## 1. Preparación en Postman
Abre Postman (o Insomnia, si lo prefieres).

Haz clic en el botón `+` para crear una nueva petición (o selecciona `New` y luego `HTTP Request`).

## 2. Petición para Registrar un Usuario (POST /api/auth/register)
Esta petición se utiliza para crear una nueva cuenta de usuario en tu sistema.

- **Método:** POST  
- **URL:** `http://localhost:3000/api/auth/register`  
  (Asegúrate de que el puerto 3000 sea el que tienes configurado en tu archivo `.env`)

### Configuración en Postman:
1. Selecciona el método **POST** en el desplegable.
2. Ingresa la URL completa en el campo de dirección.
3. Ve a la pestaña **Headers** y añade:
   - **Key:** `Content-Type`
   - **Value:** `application/json`
4. Ve a la pestaña **Body**, selecciona la opción **raw** y elige **JSON** en el desplegable de tipo de contenido.
5. Pega el siguiente cuerpo JSON:

   ```json
   {
       "correo": "usuario.prueba@example.com",
       "contraseña": "passwordSeguro123",
       "rol": "estudiante"
   }
   ```

   Puedes cambiar el correo y el rol como desees para probar diferentes escenarios.

6. Haz clic en el botón **Send**.

### Respuesta Esperada:
- **Status:** 201 Created
- **Body (JSON):**

   ```json
   {
       "message": "Usuario registrado correctamente",
       "usuario": {
           "id_usuario": 1, // O cualquier ID asignado por la DB
           "correo": "usuario.prueba@example.com",
           "rol": "estudiante"
       }
   }
   ```

Si el usuario ya existe, verás un `400 Bad Request` con un mensaje de error.

## 3. Petición para Iniciar Sesión (POST /api/auth/login)
Esta petición se utiliza para autenticar a un usuario existente y obtener un token JWT.

- **Método:** POST  
- **URL:** `http://localhost:3000/api/auth/login`

### Configuración en Postman:
1. Crea una nueva petición (`+`).
2. Selecciona el método **POST**.
3. Ingresa la URL completa.
4. Ve a la pestaña **Headers** y añade:
   - **Key:** `Content-Type`
   - **Value:** `application/json`
5. Ve a la pestaña **Body**, selecciona **raw** y elige **JSON**.
6. Pega el siguiente cuerpo JSON (usa el correo y la contraseña del usuario que acabas de registrar):

   ```json
   {
       "correo": "usuario.prueba@example.com",
       "contraseña": "passwordSeguro123"
   }
   ```

7. Haz clic en el botón **Send**.

### Respuesta Esperada:
- **Status:** 200 OK
- **Body (JSON):**

   ```json
   {
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // Este es tu token JWT
       "usuario": {
           "id_usuario": 1,
           "correo": "usuario.prueba@example.com",
           "rol": "estudiante"
       }
   }
   ```

¡Guarda este token! Lo necesitarás para la siguiente petición.

## 4. Petición para Acceder a una Ruta Protegida (GET /api/auth/profile)
Esta petición demuestra cómo usar el token JWT para acceder a recursos protegidos.

- **Método:** GET  
- **URL:** `http://localhost:3000/api/auth/profile`

### Configuración en Postman:
1. Crea una nueva petición (`+`).
2. Selecciona el método **GET**.
3. Ingresa la URL completa.
4. Ve a la pestaña **Headers** y añade:
   - **Key:** `Authorization`
   - **Value:** `Bearer <PEGA_AQUÍ_TU_TOKEN>`  
     Importante: Reemplaza `<PEGA_AQUÍ_TU_TOKEN>` con el token JWT que obtuviste en el paso 3 (la cadena larga que comienza con `eyJ...`). Asegúrate de que haya un espacio entre **Bearer** y el token.

5. Haz clic en el botón **Send**.

### Respuesta Esperada (con token válido):
- **Status:** 200 OK
- **Body (JSON):**

   ```json
   {
       "message": "Acceso a perfil exitoso",
       "user": {
           "id": 1, // ID del usuario del token
           "correo": "usuario.prueba@example.com",
           "rol": "estudiante",
           "iat": 1678886400, // Timestamp de emisión
           "exp": 1678890000  // Timestamp de expiración
       },
       "data": "Esta es información confidencial del perfil."
   }
   ```

### Respuesta Esperada (sin token o token inválido/expirado):
- **Status:** 401 Unauthorized o 403 Forbidden
- **Body (JSON):**

   ```json
   {
       "message": "Token no proporcionado o formato incorrecto."
   }
   ```

   o

   ```json
   {
       "message": "Token inválido o expirado."
   }
   ```

¡Con estos pasos, podrás verificar que tu microservicio de usuarios está funcionando correctamente! Si encuentras algún error o comportamiento inesperado, revisa los mensajes de error en Postman y también los logs en la terminal donde está corriendo tu microservicio.
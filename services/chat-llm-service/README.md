chat-llm
├── config
│   └── db.js
├── controllers
│   └── chat.controller.js  <-- Nuevo, con la lógica de chat
├── middleware
│   └── auth.middleware.js  <-- Nuevo, para validar tokens del user-auth-service
├── models
│   ├── Chat.js
│   ├── Trace.js
│   └── index.js            <-- Modificado, se quitan User, Admin, Role
├── routes
│   └── chat.routes.js      <-- Renombrado y ajustado
├── utils
│   └── llm.js
├── .env
├── package.json            <-- Nuevo
└── server.js               <-- Nuevo, punto de entrada del servicio
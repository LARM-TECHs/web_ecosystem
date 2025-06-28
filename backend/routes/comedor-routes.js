const express = require('express');
const router = express.Router();
const QRCodeGenerator = require('qrcode');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { authenticateUser, authorizeRoles } = require('../middleware/auth-middleware');

// Importar modelos
const { Menu, Student, Staff, QRCode, User } = require('../models');

// --- Rutas para estudiantes ---

router.get('/student/:studentId/qr',
  //authenticateUser,
  //authorizeRoles(['student']),
  async (req, res) => {
    try {
      const { studentId } = req.params;
      const today = new Date().toISOString().split('T')[0];

      console.log('Generando QR para estudiante:', studentId, 'fecha:', today);

      // Verificar si existe un menú para hoy
      const menu = await Menu.findOne({ where: { date: today } });

      if (!menu) {
        console.log('No hay menú para hoy, creando uno por defecto');
        // Crear menú por defecto para hoy
        const defaultMenu = await Menu.create({
          date: today,
          breakfast: 'Desayuno no disponible',
          lunch: 'Almuerzo no disponible',
          dinner: 'Cena no disponible'
        });
        console.log('Menú por defecto creado:', defaultMenu.toJSON());
      }

      // Buscar el menú nuevamente para asegurar que existe
      const currentMenu = await Menu.findOne({ where: { date: today } });
      
      if (!currentMenu) {
        return res.status(500).json({ error: 'Error creando menú para hoy' });
      }

      // Buscar QR existente para hoy con ese menú
      let qrRecord = await QRCode.findOne({
        where: {
          student_id: studentId,
          date: today,
          menu_id: currentMenu.menu_id
        }
      });

      let qrCode;

      if (!qrRecord) {
        console.log('Creando nuevo QR para estudiante:', studentId);
        // Crear nuevo código QR
        const qrData = `${studentId}-${today}-${crypto.randomBytes(8).toString('hex')}`;
        qrCode = await QRCodeGenerator.toDataURL(qrData);

        // Crear nuevo registro QR con menu_id
        qrRecord = await QRCode.create({
          student_id: studentId,
          qr_code: qrData,
          date: today,
          menu_id: currentMenu.menu_id,
          used: false
        });
        console.log('QR creado:', qrRecord.toJSON());
      } else {
        console.log('QR existente encontrado:', qrRecord.toJSON());
        // Generar imagen QR desde el dato guardado
        qrCode = await QRCodeGenerator.toDataURL(qrRecord.qr_code);
      }

      res.json({ 
        qrCode, 
        date: today, 
        menu_id: currentMenu.menu_id,
        qr_id: qrRecord.qr_id,
        used: qrRecord.used
      });
    } catch (err) {
      console.error('Error generando QR:', err);
      res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
  }
);

router.get('/menu',
  //authenticateUser,
  async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      console.log('Buscando menú para fecha:', today);
      
      let menu = await Menu.findOne({
        where: { date: today }
      });

      if (!menu) {
        console.log('No existe menú para hoy, creando uno por defecto');
        // Crear menú por defecto
        menu = await Menu.create({
          date: today,
          breakfast: 'Menú no disponible',
          lunch: 'Menú no disponible',
          dinner: 'Menú no disponible'
        });
        console.log('Menú creado:', menu.toJSON());
      }

      res.json(menu.toJSON());
    } catch (err) {
      console.error('Error obteniendo menú:', err);
      res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
  }
);

router.get('/menu/:date',
  //authenticateUser,
  async (req, res) => {
    try {
      const { date } = req.params;
      
      console.log('Buscando menú para fecha específica:', date);
      
      const menu = await Menu.findOne({
        where: { date }
      });

      if (!menu) {
        res.json({
          date,
          breakfast: 'Menú no disponible',
          lunch: 'Menú no disponible',
          dinner: 'Menú no disponible'
        });
      } else {
        res.json(menu.toJSON());
      }
    } catch (err) {
      console.error('Error obteniendo menú:', err);
      res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
  }
);

// --- Rutas para staff ---

router.post('/staff/validate-qr',
  authenticateUser,
  authorizeRoles(['admin']),
  async (req, res) => {
    try {
      const { qrData, staffId } = req.body;
      
      console.log('Validando QR:', qrData, 'por staff:', staffId);
      
      if (!qrData || !staffId) {
        return res.status(400).json({ error: 'Datos faltantes' });
      }

      // Buscar QR code con información del estudiante
      const qrRecord = await QRCode.findOne({
        where: {
          qr_code: qrData,
          used: false
        },
        include: [{
          model: Student,
          as: 'student',
          attributes: ['student_id', 'name', 'email']
        }]
      });

      if (!qrRecord) {
        console.log('QR no encontrado o ya usado');
        return res.status(404).json({ 
          valid: false, 
          message: 'Código QR inválido o ya utilizado' 
        });
      }

      // Verificar que el QR sea del día actual
      const today = new Date().toISOString().split('T')[0];
      if (qrRecord.date !== today) {
        console.log('QR expirado. Fecha QR:', qrRecord.date, 'Fecha actual:', today);
        return res.status(400).json({ 
          valid: false, 
          message: 'Código QR expirado' 
        });
      }

      // Marcar QR como usado
      await qrRecord.update({ used: true });
      console.log('QR marcado como usado');

      res.json({
        valid: true,
        message: 'Código QR válido',
        studentId: qrRecord.student_id,
        studentName: qrRecord.student?.name || 'Estudiante no encontrado',
        date: qrRecord.date,
        menu_id: qrRecord.menu_id
      });

    } catch (err) {
      console.error('Error validando QR:', err);
      res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
  }
);

router.get('/staff/menus',
  //authenticateUser,
  //authorizeRoles(['admin']),
  async (req, res) => {
    try {
      const menus = await Menu.findAll({
        order: [['date', 'DESC']],
        limit: 30
      });

      res.json(menus);
    } catch (err) {
      console.error('Error obteniendo menús:', err);
      res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
  }
);

router.post('/staff/menu',
  //authenticateUser,
  //authorizeRoles(['admin']),
  async (req, res) => {
    try {
      const { date, breakfast, lunch, dinner } = req.body;
      
      console.log('Creando/actualizando menú:', { date, breakfast, lunch, dinner });
      
      if (!date) {
        return res.status(400).json({ error: 'Fecha requerida' });
      }

      // Validar formato de fecha
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        return res.status(400).json({ error: 'Formato de fecha inválido. Use YYYY-MM-DD' });
      }

      // Buscar menú existente
      const existingMenu = await Menu.findOne({
        where: { date }
      });

      let menu;
      if (existingMenu) {
        console.log('Actualizando menú existente');
        // Actualizar menú existente
        menu = await existingMenu.update({
          breakfast: breakfast || existingMenu.breakfast,
          lunch: lunch || existingMenu.lunch,
          dinner: dinner || existingMenu.dinner
        });
        res.json({ message: 'Menú actualizado', menu: menu.toJSON() });
      } else {
        console.log('Creando nuevo menú');
        // Crear nuevo menú
        menu = await Menu.create({
          date,
          breakfast: breakfast || 'No disponible',
          lunch: lunch || 'No disponible',
          dinner: dinner || 'No disponible'
        });
        res.json({ message: 'Menú creado', menu: menu.toJSON() });
      }
    } catch (err) {
      console.error('Error guardando menú:', err);
      res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
  }
);

router.delete('/staff/menu/:date',
  //authenticateUser,
  //authorizeRoles(['admin']),
  async (req, res) => {
    try {
      const { date } = req.params;
      
      console.log('Eliminando menú para fecha:', date);
      
      const deletedCount = await Menu.destroy({
        where: { date }
      });

      if (deletedCount === 0) {
        return res.status(404).json({ message: 'Menú no encontrado' });
      }

      res.json({ message: 'Menú eliminado' });
    } catch (err) {
      console.error('Error eliminando menú:', err);
      res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
  }
);

// --- Rutas de prueba (sin protección para desarrollo) ---

router.post('/test/student', async (req, res) => {
  try {
    const { studentId, name, email, userId } = req.body;
    
    console.log('Creando estudiante de prueba:', { studentId, name, email, userId });
    
    const [student, created] = await Student.findOrCreate({
      where: { student_id: studentId },
      defaults: {
        student_id: studentId,
        name,
        email,
        user_id: userId || null
      }
    });

    if (created) {
      res.json({ message: 'Estudiante creado', student: student.toJSON() });
    } else {
      res.json({ message: 'Estudiante ya existe', student: student.toJSON() });
    }
  } catch (err) {
    console.error('Error creando estudiante:', err);
    res.status(500).json({ error: 'Error interno del servidor', details: err.message });
  }
});

router.post('/test/staff', async (req, res) => {
  try {
    const { staffId, name, role, userId } = req.body;
    
    console.log('Creando staff de prueba:', { staffId, name, role, userId });
    
    const [staff, created] = await Staff.findOrCreate({
      where: { staff_id: staffId },
      defaults: {
        staff_id: staffId,
        name,
        role: role || 'staff',
        user_id: userId || null
      }
    });

    if (created) {
      res.json({ message: 'Personal creado', staff: staff.toJSON() });
    } else {
      res.json({ message: 'Personal ya existe', staff: staff.toJSON() });
    }
  } catch (err) {
    console.error('Error creando personal:', err);
    res.status(500).json({ error: 'Error interno del servidor', details: err.message });
  }
});

// --- Rutas adicionales útiles ---

router.get('/staff/qr-history',
  authenticateUser,
  authorizeRoles(['admin']),
  async (req, res) => {
    try {
      const { date, studentId } = req.query;
      const whereClause = {};
      
      if (date) whereClause.date = date;
      if (studentId) whereClause.student_id = studentId;

      const qrHistory = await QRCode.findAll({
        where: whereClause,
        include: [{
          model: Student,
          as: 'student',
          attributes: ['student_id', 'name', 'email']
        }, {
          model: Menu,
          as: 'menu',
          attributes: ['menu_id', 'date', 'breakfast', 'lunch', 'dinner']
        }],
        order: [['created_at', 'DESC']],
        limit: 100
      });

      res.json(qrHistory);
    } catch (err) {
      console.error('Error obteniendo historial QR:', err);
      res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
  }
);

router.get('/staff/students',
  authenticateUser,
  authorizeRoles(['admin']),
  async (req, res) => {
    try {
      const students = await Student.findAll({
        include: [{
          model: User,
          as: 'user',
          attributes: ['name', 'email', 'user_type'],
          required: false
        }],
        order: [['name', 'ASC']]
      });

      res.json(students);
    } catch (err) {
      console.error('Error obteniendo estudiantes:', err);
      res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
  }
);

// Ruta de debug para verificar estructura de BD
router.get('/debug/tables', async (req, res) => {
  try {
    const models = ['Menu', 'Student', 'QRCode', 'User', 'Staff'];
    const info = {};
    
    for (const modelName of models) {
      const model = require('../models')[modelName];
      if (model) {
        info[modelName] = {
          tableName: model.tableName,
          attributes: Object.keys(model.rawAttributes)
        };
      }
    }
    
    res.json(info);
  } catch (err) {
    console.error('Error en debug:', err);
    res.status(500).json({ error: 'Error interno del servidor', details: err.message });
  }
});

module.exports = router;
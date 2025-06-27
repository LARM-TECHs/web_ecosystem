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

      // Buscar QR existente para hoy
      let qrRecord = await QRCode.findOne({
        where: {
          student_id: studentId,
          date: today
        }
      });

      let qrCode;
      if (!qrRecord) {
        // Crear nuevo QR
        const qrData = `${studentId}-${today}-${crypto.randomBytes(8).toString('hex')}`;
        qrCode = await QRCodeGenerator.toDataURL(qrData);

        // Crear registro en BD
        qrRecord = await QRCode.create({
          student_id: studentId,
          qr_code: qrData,
          date: today
        });
      } else {
        // Generar QR desde datos existentes
        qrCode = await QRCodeGenerator.toDataURL(qrRecord.qr_code);
      }

      res.json({ qrCode, date: today });
    } catch (err) {
      console.error('Error generando QR:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

router.get('/menu',
//  authenticateUser,
  async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const menu = await Menu.findOne({
        where: { date: today }
      });

      if (!menu) {
        res.json({
          date: today,
          breakfast: 'Menú no disponible',
          lunch: 'Menú no disponible',
          dinner: 'Menú no disponible'
        });
      } else {
        res.json(menu.toJSON());
      }
    } catch (err) {
      console.error('Error obteniendo menú:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

router.get('/menu/:date',
  //authenticateUser,
  async (req, res) => {
    try {
      const { date } = req.params;
      
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
      res.status(500).json({ error: 'Error interno del servidor' });
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
          attributes: ['student_id', 'name']
        }]
      });

      if (!qrRecord) {
        return res.status(404).json({ 
          valid: false, 
          message: 'Código QR inválido o ya utilizado' 
        });
      }

      // Verificar que el QR sea del día actual
      const today = new Date().toISOString().split('T')[0];
      if (qrRecord.date !== today) {
        return res.status(400).json({ 
          valid: false, 
          message: 'Código QR expirado' 
        });
      }

      // Marcar QR como usado
      await qrRecord.update({ used: true });

      res.json({
        valid: true,
        message: 'Código QR válido',
        studentId: qrRecord.student_id,
        studentName: qrRecord.student?.name || 'Estudiante no encontrado',
        date: qrRecord.date
      });

    } catch (err) {
      console.error('Error validando QR:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

router.get('/staff/menus',
  //authenticateUser,
 // authorizeRoles(['admin']),
  async (req, res) => {
    try {
      const menus = await Menu.findAll({
        order: [['date', 'DESC']],
        limit: 30
      });

      res.json(menus);
    } catch (err) {
      console.error('Error obteniendo menús:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

router.post('/staff/menu',
  //authenticateUser,
  //authorizeRoles(['admin']),
  async (req, res) => {
    try {
      const { date, breakfast, lunch, dinner } = req.body;
      
      if (!date) {
        return res.status(400).json({ error: 'Fecha requerida' });
      }

      // Buscar menú existente
      const existingMenu = await Menu.findOne({
        where: { date }
      });

      let menu;
      if (existingMenu) {
        // Actualizar menú existente
        menu = await existingMenu.update({
          breakfast,
          lunch,
          dinner
        });
        res.json({ message: 'Menú actualizado', menu });
      } else {
        // Crear nuevo menú
        menu = await Menu.create({
          date,
          breakfast,
          lunch,
          dinner
        });
        res.json({ message: 'Menú creado', menu });
      }
    } catch (err) {
      console.error('Error guardando menú:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

router.delete('/staff/menu/:date',
//  authenticateUser,
//  authorizeRoles(['admin']),
  async (req, res) => {
    try {
      const { date } = req.params;
      
      const deletedCount = await Menu.destroy({
        where: { date }
      });

      if (deletedCount === 0) {
        return res.status(404).json({ message: 'Menú no encontrado' });
      }

      res.json({ message: 'Menú eliminado' });
    } catch (err) {
      console.error('Error eliminando menú:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

// --- Rutas de prueba (sin protección para desarrollo) ---

router.post('/test/student', async (req, res) => {
  try {
    const { studentId, name, email, userId } = req.body;
    
    const [student, created] = await Student.findOrCreate({
      where: { student_id: studentId },
      defaults: {
        student_id: studentId,
        name,
        email,
        user_id: userId
      }
    });

    if (created) {
      res.json({ message: 'Estudiante creado', student });
    } else {
      res.json({ message: 'Estudiante ya existe', student });
    }
  } catch (err) {
    console.error('Error creando estudiante:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/test/staff', async (req, res) => {
  try {
    const { staffId, name, role, userId } = req.body;
    
    const [staff, created] = await Staff.findOrCreate({
      where: { staff_id: staffId },
      defaults: {
        staff_id: staffId,
        name,
        role: role || 'staff',
        user_id: userId
      }
    });

    if (created) {
      res.json({ message: 'Personal creado', staff });
    } else {
      res.json({ message: 'Personal ya existe', staff });
    }
  } catch (err) {
    console.error('Error creando personal:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
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
        }],
        order: [['created_at', 'DESC']],
        limit: 100
      });

      res.json(qrHistory);
    } catch (err) {
      console.error('Error obteniendo historial QR:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
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
          attributes: ['name', 'email', 'user_type']
        }],
        order: [['name', 'ASC']]
      });

      res.json(students);
    } catch (err) {
      console.error('Error obteniendo estudiantes:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

module.exports = router;
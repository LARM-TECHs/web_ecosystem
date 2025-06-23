// Rutas para estudiantes

// Obtener código QR diario para estudiante
app.get('/api/student/:studentId/qr', async (req, res) => {
  try {
    const { studentId } = req.params;
    const today = new Date().toISOString().split('T')[0];

    // Verificar si ya existe un QR para hoy
    let qrResult = await pool.query(
      'SELECT qr_code FROM qr_codes WHERE student_id = $1 AND date = $2',
      [studentId, today]
    );

    let qrCode;
    if (qrResult.rows.length === 0) {
      // Crear nuevo código QR
      const qrData = `${studentId}-${today}-${crypto.randomBytes(8).toString('hex')}`;
      qrCode = await QRCode.toDataURL(qrData);
      
      await pool.query(
        'INSERT INTO qr_codes (student_id, qr_code, date) VALUES ($1, $2, $3)',
        [studentId, qrData, today]
      );
    } else {
      // Generar QR visual del código existente
      qrCode = await QRCode.toDataURL(qrResult.rows[0].qr_code);
    }

    res.json({ qrCode, date: today });
  } catch (err) {
    console.error('Error generando QR:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener menú del día - ruta sin parámetro (día actual)
app.get('/api/menu', async (req, res) => {
  try {
    const date = new Date().toISOString().split('T')[0];
    
    const result = await pool.query(
      'SELECT * FROM menus WHERE date = $1',
      [date]
    );

    if (result.rows.length === 0) {
      res.json({
        date,
        breakfast: 'Menú no disponible',
        lunch: 'Menú no disponible',
        dinner: 'Menú no disponible'
      });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error obteniendo menú:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener menú del día - ruta con parámetro de fecha específica
app.get('/api/menu/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM menus WHERE date = $1',
      [date]
    );

    if (result.rows.length === 0) {
      res.json({
        date,
        breakfast: 'Menú no disponible',
        lunch: 'Menú no disponible',
        dinner: 'Menú no disponible'
      });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error obteniendo menú:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Rutas para personal

// Validar código QR escaneado
app.post('/api/staff/validate-qr', async (req, res) => {
  try {
    const { qrData, staffId } = req.body;
    
    if (!qrData || !staffId) {
      return res.status(400).json({ error: 'Datos faltantes' });
    }

    // Verificar si el código QR existe y no ha sido usado
    const result = await pool.query(
      'SELECT * FROM qr_codes WHERE qr_code = $1 AND used = FALSE',
      [qrData]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        valid: false, 
        message: 'Código QR inválido o ya utilizado' 
      });
    }

    const qrRecord = result.rows[0];
    const today = new Date().toISOString().split('T')[0];

    // Verificar si es del día actual
    if (qrRecord.date !== today) {
      return res.status(400).json({ 
        valid: false, 
        message: 'Código QR expirado' 
      });
    }

    // Marcar como usado
    await pool.query(
      'UPDATE qr_codes SET used = TRUE WHERE qr_code = $1',
      [qrData]
    );

    // Obtener información del estudiante
    const studentResult = await pool.query(
      'SELECT name FROM students WHERE student_id = $1',
      [qrRecord.student_id]
    );

    res.json({
      valid: true,
      message: 'Código QR válido',
      studentId: qrRecord.student_id,
      studentName: studentResult.rows[0]?.name || 'Estudiante no encontrado',
      date: qrRecord.date
    });

  } catch (err) {
    console.error('Error validando QR:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener todos los menús
app.get('/api/staff/menus', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM menus ORDER BY date DESC LIMIT 30'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error obteniendo menús:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear o actualizar menú
app.post('/api/staff/menu', async (req, res) => {
  try {
    const { date, breakfast, lunch, dinner } = req.body;
    
    if (!date) {
      return res.status(400).json({ error: 'Fecha requerida' });
    }

    // Verificar si ya existe un menú para esa fecha
    const existingMenu = await pool.query(
      'SELECT id FROM menus WHERE date = $1',
      [date]
    );

    if (existingMenu.rows.length > 0) {
      // Actualizar menú existente
      const result = await pool.query(
        'UPDATE menus SET breakfast = $2, lunch = $3, dinner = $4, updated_at = CURRENT_TIMESTAMP WHERE date = $1 RETURNING *',
        [date, breakfast, lunch, dinner]
      );
      res.json({ message: 'Menú actualizado', menu: result.rows[0] });
    } else {
      // Crear nuevo menú
      const result = await pool.query(
        'INSERT INTO menus (date, breakfast, lunch, dinner) VALUES ($1, $2, $3, $4) RETURNING *',
        [date, breakfast, lunch, dinner]
      );
      res.json({ message: 'Menú creado', menu: result.rows[0] });
    }
  } catch (err) {
    console.error('Error guardando menú:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar menú
app.delete('/api/staff/menu/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    await pool.query('DELETE FROM menus WHERE date = $1', [date]);
    res.json({ message: 'Menú eliminado' });
  } catch (err) {
    console.error('Error eliminando menú:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Rutas de utilidad

// Crear estudiante de prueba
app.post('/api/test/student', async (req, res) => {
  try {
    const { studentId, name, email } = req.body;
    
    const result = await pool.query(
      'INSERT INTO students (student_id, name, email) VALUES ($1, $2, $3) ON CONFLICT (student_id) DO NOTHING RETURNING *',
      [studentId, name, email]
    );
    
    res.json({ message: 'Estudiante creado', student: result.rows[0] });
  } catch (err) {
    console.error('Error creando estudiante:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear personal de prueba
app.post('/api/test/staff', async (req, res) => {
  try {
    const { staffId, name, role } = req.body;
    
    const result = await pool.query(
      'INSERT INTO staff (staff_id, name, role) VALUES ($1, $2, $3) ON CONFLICT (staff_id) DO NOTHING RETURNING *',
      [staffId, name, role || 'staff']
    );
    
    res.json({ message: 'Personal creado', staff: result.rows[0] });
  } catch (err) {
    console.error('Error creando personal:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
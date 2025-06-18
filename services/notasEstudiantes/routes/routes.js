import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../middleware/auth.js';
import { Estudiante, Administrador, Usuario, Asignatura, Brigada, Carrera, Nota, Facultad, CarreraAsignatura} from '../models/index.js';
// import { agregarFacultad, obtenerFacultades, obtenerFacultad, obtenerFacultadNomb, eliminarFacultad, actualizarFacultad} from '../controllers/facultadController';


const router = express.Router()


router.get('/verificar', verifyToken, async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.userId);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        return res.status(200).json(usuario);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const estudiante = await Estudiante.findOne({ where: { correo: email } });

        if (!estudiante) {
            return res.status(404).json({ message: 'Usuario no existe' });
        }

        const isMatch = await bcrypt.compare(password, estudiante.contraseña);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ id: estudiante.id_usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ token });
    } catch (error) {
        console.error('Error en /auth/login:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});


router.post('/loginAdm', async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Administrador.findOne({ where: { correo: email } });

        if (!admin) {
            return res.status(404).json({ message: 'Usuario no existe' });
        }

        const isMatch = password === admin.contraseña;

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ id: admin.id_usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(201).json({ token });
    } catch (error) {
        console.error('Error en /auth/loginAdm:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});


// ASIGNATURAS!!!!!!
// Agregar una asignatura
router.post('/asignaturas', async (req, res) => {
    const { nombre } = req.body;
    try {
        const asignatura = await Asignatura.create({ nombre_asignatura: nombre });
        res.status(201).json(asignatura);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al agregar la asignatura');
    }
});

// Agregar una asignatura a una carrera
router.post('/asignaturas/carrera', async (req, res) => {
    const { id_carrera, id_asignatura } = req.body;
    try {
        const relacion = await CarreraAsignatura.create({ id_carrera, id_asignatura });
        res.status(201).json(relacion);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al agregar la asignatura a la carrera');
    }
});

// Obtener todas las asignaturas
router.get('/asignaturas', async (req, res) => {
    try {
        const asignaturas = await Asignatura.findAll();
        res.json(asignaturas);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las asignaturas');
    }
});

// Obtener una asignatura por ID
router.get('/asignaturas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const asignatura = await Asignatura.findByPk(id);
        if (!asignatura) return res.status(404).json({ message: 'Asignatura no encontrada' });
        res.json(asignatura);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la asignatura');
    }
});

// Obtener una asignatura por nombre
router.get('/asignaturas/nombre/:nombre', async (req, res) => {
    const { nombre } = req.params;
    try {
        const asignaturas = await Asignatura.findAll({ where: { nombre_asignatura: nombre } });
        res.json(asignaturas);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la asignatura');
    }
});

// Obtener asignaturas por carrera
router.get('/asignaturas/carrera/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const carrera = await Carrera.findByPk(id, {
            include: {
                model: Asignatura,
                through: { attributes: [] } // evita atributos del join table
            }
        });
        if (!carrera) return res.status(404).json({ message: 'Carrera no encontrada' });
        res.json(carrera.asignaturas);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las asignaturas por carrera');
    }
});

// Obtener asignaturas por carrera e id_asignatura
router.get('/asignaturas/:carrera/:id', async (req, res) => {
    const { carrera, id } = req.params;
    try {
        const carreraInstance = await Carrera.findByPk(carrera, {
            include: {
                model: Asignatura,
                where: { id_asignatura: id },
                through: { attributes: [] }
            }
        });
        if (!carreraInstance || carreraInstance.asignaturas.length === 0) {
            return res.status(404).json({ message: 'Asignatura no encontrada para esa carrera' });
        }
        res.json(carreraInstance.asignaturas);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la asignatura por carrera y id');
    }
});

// Eliminar una asignatura
router.delete('/asignaturas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Asignatura.destroy({ where: { id_asignatura: id } });
        if (!deleted) return res.status(404).json({ message: 'Asignatura no encontrada' });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar la asignatura');
    }
});

// Eliminar asignatura de una carrera
router.delete('/asignaturas/:id/:idAsig', async (req, res) => {
    const { id, idAsig } = req.params;
    try {
        const deleted = await CarreraAsignatura.destroy({
            where: {
                id_carrera: id,
                id_asignatura: idAsig,
            },
        });
        if (!deleted) return res.status(404).json({ message: 'Relación no encontrada' });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar la asignatura de la carrera');
    }
});

// Actualizar una asignatura
router.put('/asignaturas/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        const [updated] = await Asignatura.update(
            { nombre_asignatura: nombre },
            { where: { id_asignatura: id } }
        );
        if (!updated) return res.status(404).json({ message: 'Asignatura no encontrada' });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar la asignatura');
    }
});

// Obtener asignaturas por la carrera de la brigada
router.get('/asignaturas/brigada/brigada/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const brigada = await Brigada.findByPk(id, {
            include: {
                model: Carrera,
                include: {
                    model: Asignatura,
                    through: { attributes: [] }
                }
            }
        });

        if (!brigada) return res.status(404).json({ message: 'Brigada no encontrada' });

        // Obtener todas las asignaturas de la carrera relacionada a la brigada
        const asignaturas = brigada.carrera ? brigada.carrera.asignaturas : [];
        res.json(asignaturas);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las asignaturas de la brigada');
    }
});



// FACULTADES!!!!!!
// Agregar una facultad
router.post('/facultades', async (req, res) => {
    const { nombre } = req.body;
    try {
        const existe = await Facultad.findOne({ where: { nombre_facultad: nombre } });
        if (existe) {
            return res.status(400).json({ message: "La facultad ya existe" });
        }
        const facultad = await Facultad.create({ nombre_facultad: nombre });
        res.status(201).json(facultad);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al agregar la facultad');
    }
});

// Obtener todas las facultades
router.get('/facultades', async (req, res) => {
    try {
        const facultades = await Facultad.findAll();
        res.json(facultades);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las facultades');
    }
});

// Obtener una facultad por id
router.get('/facultades/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const facultad = await Facultad.findByPk(id);
        if (!facultad) return res.status(404).json({ message: "Facultad no encontrada" });
        res.json(facultad);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la facultad');
    }
});

// Obtener una facultad por nombre
router.get('/facultades/nombre/:nombre', async (req, res) => {
    const { nombre } = req.params;
    try {
        const facultades = await Facultad.findAll({ where: { nombre_facultad: nombre } });
        res.json(facultades);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la facultad');
    }
});

// Eliminar una facultad
router.delete('/facultades/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Facultad.destroy({ where: { id_facultad: id } });
        if (!deleted) return res.status(404).json({ message: "Facultad no encontrada" });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar la facultad');
    }
});

// Actualizar una facultad
router.put('/facultades/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        const [updated] = await Facultad.update(
            { nombre_facultad: nombre },
            { where: { id_facultad: id } }
        );
        if (!updated) return res.status(404).json({ message: "Facultad no encontrada" });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar la facultad');
    }
});

// CARRERAS

// Agregar una carrera
router.post('/carreras', async (req, res) => {
    const { id_facultad, nombre_carrera, años } = req.body;
    try {
        const carrera = await Carrera.create({ id_facultad, nombre_carrera, años });
        res.status(201).json(carrera);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al agregar la carrera');
    }
});

// Obtener todas las carreras
router.get('/carreras', async (req, res) => {
    try {
        const carreras = await Carrera.findAll();
        res.json(carreras);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las carreras');
    }
});

// Obtener una carrera por id
router.get('/carreras/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const carrera = await Carrera.findByPk(id);
        if (!carrera) return res.status(404).json({ message: "Carrera no encontrada" });
        res.json(carrera);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la carrera');
    }
});

// Obtener carreras por facultad
router.get('/carreras/facultad/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const carreras = await Carrera.findAll({ where: { id_facultad: id } });
        res.json(carreras);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

// Obtener carrera por nombre
router.get('/carreras/nombre/:nombre', async (req, res) => {
    const { nombre } = req.params;
    try {
        const carreras = await Carrera.findAll({ where: { nombre_carrera: nombre } });
        res.json(carreras);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la carrera');
    }
});

// Eliminar una carrera
router.delete('/carreras/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Carrera.destroy({ where: { id_carrera: id } });
        if (!deleted) return res.status(404).json({ message: "Carrera no encontrada" });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar la carrera');
    }
});

// Actualizar una carrera
router.put('/carreras/:id', async (req, res) => {
    const { id } = req.params;
    const { id_facultad, nombre_carrera, años } = req.body;
    try {
        const [updated] = await Carrera.update(
            { id_facultad, nombre_carrera, años },
            { where: { id_carrera: id } }
        );
        if (!updated) return res.status(404).json({ message: "Carrera no encontrada" });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar la carrera');
    }
});


// BRIGADAS!!!!!!
// Agregar una brigada
router.post('/brigadas', async (req, res) => {
    const { id_carrera, nombre_brigada, año_brigada, añoFinal_brigada } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO brigada(id_carrera, nombre_brigada, año_brigada, añoFinal_brigada) VALUES($1, $2, $3, $4) RETURNING *',
            [id_carrera, nombre_brigada, año_brigada, añoFinal_brigada]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al agregar la brigada');
    }
});

// Obtener todas las brigadas
router.get('/brigadas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM brigada');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las brigadas');
    }
});

// Obtener una brigada
router.get('/brigadas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM brigada WHERE id_brigada = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "brigada no encontrada" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la brigada');
    }
});

// Obtener brigadas por carrera
router.get('/brigadas/carrera/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM brigada WHERE id_carrera = $1', [id]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

// Obtener una brigada por nombre
router.get('/brigadas/nombre/:nombre', async (req, res) => {
    const { nombre } = req.params;
    try {
        const result = await pool.query('SELECT * FROM brigada WHERE nombre_brigada = $1', [nombre]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la brigada');
    }
});

// Eliminar una brigada
router.delete('/brigadas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM brigada WHERE id_brigada = $1', [id]);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar la brigada');
    }
});

// Actualizar una brigada
router.put('/brigadas/:id', async (req, res) => {
    const { id } = req.params;
    const { id_carrera, nombre_brigada, año_brigada, añoFinal_brigada } = req.body;
    try {
        const result = await pool.query(
            'UPDATE brigada SET id_carrera = $1, nombre_brigada = $2, año_brigada = $3, añoFinal_brigada = $4 WHERE id_brigada = $5 RETURNING *',
            [id_carrera, nombre_brigada, año_brigada, añoFinal_brigada, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "brigada no encontrada" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar la brigada');
    }
});


// ESTUDIANTES!!!!!!
// Agregar un estudiante
router.post('/estudiantes', async (req, res) => {
    const { correo, contraseña, id_brigada, nombre_estudiante, carnet } = req.body;
    try {
        const hashPassword = await bcrypt.hash(contraseña, 10);
        const result = await pool.query(
            'INSERT INTO estudiante(correo, contraseña, rol, id_brigada, nombre_estudiante, carnet) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
            [correo, hashPassword, 'estudiante', id_brigada, nombre_estudiante, carnet]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al agregar el estudiante');
    }
});

// Obtener todos los estudiantes
router.get('/estudiantes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM estudiante');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los estudiantes');
    }
});

// Obtener un estudiante
router.get('/estudiantes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM estudiante WHERE id_estudiante = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "estudiante no encontrado" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el estudiante');
    }
});

// Obtener un estudiante por id_usuario
router.get('/estudiantes/usuario/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM estudiante WHERE id_usuario = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "estudiante no encontrado" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el estudiante');
    }
});

// Obtener estudiantes por brigada
router.get('/estudiantes/brigada/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM estudiante WHERE id_brigada = $1', [id]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

// Obtener un estudiante por correo
router.get('/estudiantes/correo/:correo', async (req, res) => {
    const { correo } = req.params;
    try {
        const result = await pool.query('SELECT * FROM estudiante WHERE correo = $1', [correo]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el estudiante');
    }
});

// Eliminar un estudiante
router.delete('/estudiantes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM estudiante WHERE id_estudiante = $1', [id]);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar el estudiante');
    }
});

// Actualizar un estudiante
router.put('/estudiantes/:id', async (req, res) => {
    const { id } = req.params;
    const { correo, contraseña, id_brigada, nombre_estudiante, carnet } = req.body;
    try {
        const hashPassword = await bcrypt.hash(contraseña, 10);
        const result = await pool.query(
            'UPDATE estudiante SET correo = $1, contraseña = $2, id_brigada = $3, nombre_estudiante = $4, carnet = $5 WHERE id_estudiante = $6 RETURNING *',
            [correo, hashPassword, id_brigada, nombre_estudiante, carnet, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "estudiante no encontrado" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar el estudiante');
    }
});


// NOTAS!!!!!!
// Agregar una nota
router.post('/notas', async (req, res) => {
    const { id_estudiante, id_asignatura, valor, año } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO nota(id_estudiante, id_asignatura, valor, año) VALUES($1, $2, $3, $4) RETURNING *',
            [id_estudiante, id_asignatura, valor, año]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al agregar la nota');
    }
});

// Obtener una nota
router.get('/notas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM nota n JOIN asignatura a ON n.id_asignatura = a.id_asignatura WHERE n.id_nota = $1',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "nota no encontrada" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la nota');
    }
});

// Obtener notas por estudiante
router.get('/notas/estudiante/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM nota n JOIN asignatura a ON n.id_asignatura = a.id_asignatura WHERE n.id_estudiante = $1 ORDER BY n.año ASC',
            [id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

// Obtener notas por estudiante y año
router.get('/notas/estudiante/:id/:ano', async (req, res) => {
    const { id, ano } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM nota n JOIN asignatura a ON n.id_asignatura = a.id_asignatura WHERE n.id_estudiante = $1 AND n.año = $2',
            [id, ano]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

// Obtener nota por estudiante y asignatura
router.get('/notas/:asignatura/:estudiante', async (req, res) => {
    const { asignatura, estudiante } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM nota WHERE id_asignatura = $1 AND id_estudiante = $2',
            [asignatura, estudiante]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la nota');
    }
});

// Eliminar una nota
router.delete('/notas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM nota WHERE id_nota = $1', [id]);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar la nota');
    }
});

// Actualizar una nota
router.put('/notas/:id', async (req, res) => {
    const { id } = req.params;
    const { id_estudiante, id_asignatura, valor, año } = req.body;

    try {
        const [updatedRowsCount, updatedRows] = await Nota.update(
            { id_estudiante, id_asignatura, valor, año },
            { where: { id_nota: id }, returning: true }
        );

        if (updatedRowsCount === 0) {
            return res.status(404).json({ message: "nota no encontrada" });
        }

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar la nota');
    }
});

// Obtener el promedio de un estudiante
router.get('/notas/promedio/promedio/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Nota.findOne({
            attributes: [
                [Sequelize.fn('ROUND', Sequelize.fn('AVG', Sequelize.col('valor')), 1), 'promedio']
            ],
            where: { id_estudiante: id }
        });

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
});


export default router;
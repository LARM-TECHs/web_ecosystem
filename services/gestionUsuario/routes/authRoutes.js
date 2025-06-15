import express, { response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pg from 'pg';

const router = express.Router()

// Configuración de la base de datos
const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'basedatos',
    password: '1234',
    port: 5432,
});

const verifityToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: "no existe el token" })
        }
        const decoded = jwt.verify(token, 'yilian_yailin')
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(500).json({ message: "error en el servidor" })
    }
}

router.get('/verificar', verifityToken, async (req, res) => {
    try {
        const usuario = await pool.query('SELECT * FROM usuario WHERE id_usuario = $1', [req.userId]);
        if (usuario.rows.length === 0) {
            return res.status(404).json({ message: "usuario no encontrado" })
        }
        return res.status(201).json(usuario.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Usuario simulado
    const user = {
        email: 'usuario@gmail.com',
        password: 'contraseña123', // Asegúrate de que esta contraseña sea la misma que se usa en el hash
        id_usuario: 1 // ID simulado
    };

    try {
        // Busca el usuario por email
        const { rows } = await pool.query('SELECT * FROM estudiante WHERE correo = $1', [email]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'usuario no existe' });
        }

        // Verifica la contraseña
        const isMatch = await bcrypt.compare(password, rows[0].contraseña)

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }


        // Genera un token JWT
        const token = jwt.sign({ id: rows[0].id_usuario }, 'yilian_yailin', { expiresIn: '1h' });

        return res.status(201).json({ token });
    } catch (error) {
        console.error('Error en /auth/login:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
})

router.post('/loginAdm', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Busca el usuario por email
        const { rows } = await pool.query('SELECT * FROM administrador WHERE correo = $1', [email]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'usuario no existe' });
        }

        // Verifica la contraseña
        const isMatch = (password == rows[0].contraseña) ? true : false;

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }


        // Genera un token JWT
        const token = jwt.sign({ id: rows[0].id_usuario }, 'yilian_yailin', { expiresIn: '1h' });
        return res.status(201).json({ token });
    } catch (error) {
        console.error('Error en /auth/loginAdm:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
})





// ESTUDIANTES!!!!!!
// Agregar un estudiante
router.post('/estudiantes', async (req, res) => {
    const { correo, contraseña, id_brigada, nombre_estudiante, carnet } = req.body;
    try {
        const hashPassword = await bcrypt.hash(contraseña, 10);
        const result = await pool.query('INSERT INTO estudiante(correo, contraseña, rol, id_brigada, nombre_estudiante, carnet) VALUES($1, $2, "estudiante", $3, $4, $5)', [correo, hashPassword, id_brigada, nombre_estudiante, carnet]);
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
        res.status(500).send('Error al obtener las estudiantes');
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
        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la estudiante');
    }
})


// Obtener un estudiante por id_usuario
router.get('/estudiantes/usuario/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM estudiante WHERE id_usuario = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "estudiante no encontrado" });
        }
        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la estudiante');
    }
})


// Obtener  estudiantes por brigada
router.get('/estudiantes/brigada/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM estudiante WHERE e.id_brigada = $1 GROUP BY e.id_estudiante', [id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
});

//Obtener un estudiante por correo
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


// Eliminar una estudiante
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
        const result = await pool.query('UPDATE estudiante SET correo = $1, contraseña = $2, id_brigada = $3, nombre_estudiante = $4, carnet =$5  WHERE id_estudiante = $6 RETURNING *', [correo, hashPassword, id_brigada, nombre_estudiante, carnet, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "estudiante no encontrado" });
        }
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar el estudiante');
    }
});





export default router;
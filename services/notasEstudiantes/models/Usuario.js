// models/usuario.js
export default (sequelize, DataTypes) => {
    const Usuario = sequelize.define('usuario', {
        id_usuario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING,
        },
        correo: {
            type: DataTypes.STRING,
        },
        contraseña: {
            type: DataTypes.STRING,
        },
        // Agrega aquí otros campos que tenga tu tabla usuario
    }, {
        schema: process.env.DB_SCHEMA,
        tableName: 'usuario',
        timestamps: false,
    });

    return Usuario;
};

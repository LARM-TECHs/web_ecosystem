import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

class QRCode extends Model { }

QRCode.init({
    qr_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del código QR'
    },
    student_comedor_id: { // Clave foránea al ID interno de students_comedor
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'students_comedor',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'ID del estudiante del comedor al que pertenece el QR'
    },
    menu_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'menus',
            key: 'menu_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'ID del menú al que está asociado el QR'
    },
    qr_code: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Contenido del código QR'
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Fecha de validez del código QR'
    },
    used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Indica si el código QR ha sido utilizado'
    },
    used_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Marca de tiempo cuando el código QR fue utilizado'
    }
}, {
    sequelize,
    modelName: 'QRCode',
    tableName: 'qr_codes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    comment: 'Tabla para almacenar los códigos QR de acceso al comedor',
    indexes: [
        { unique: true, fields: ['qr_code'] }
    ]
});

export default QRCode;

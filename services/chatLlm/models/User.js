// User.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

class User extends Model {
    async isValidPassword(password) {
        return bcrypt.compare(password, this.password);
    }
}

User.init({
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(120),
        unique: true,
        allowNull: false,
        validate: { isEmail: true }
    },
    password: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    user_type: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    },
    registration_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    schema: process.env.DB_SCHEMA || 'llm',
    hooks: {
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    }
});

export default User;

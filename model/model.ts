import { PostgresSingleton } from "../connection/connection";
import { DataTypes, Sequelize } from 'sequelize';

export const sequelize: Sequelize = PostgresSingleton.getConnection();

/** 
*Definizione dell'ORM attraverso "Sequelize" per l'interazione con il database
**/

export const Users = sequelize.define('users', {
    email: {
        type: DataTypes.STRING(100),
        primaryKey: true
    },
    role: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    token: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
},
    {
        modelName: 'users',
        timestamps: false,
        freezeTableName: true
    });

export const Models = sequelize.define('models', {
    id: {
        type: DataTypes.NUMBER,
        primaryKey: true,
        autoIncrement: true
    },
    user_email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.JSON,
        allowNull: false
    },
    cost: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
    {
        modelName: 'models',
        timestamps: false,
        freezeTableName: true
    });

export const Revisions = sequelize.define('revisions', {
    model_id: {
        type: DataTypes.NUMBER,
        primaryKey: true
    },
    start: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    goal: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    cost: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    description: {
        type: DataTypes.JSON,
        primaryKey: true,
        allowNull: false
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cancelled: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    token_cost: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
},
    {
        modelName: 'revisions',
        timestamps: false,
        freezeTableName: true
    });

import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

if (!process.env.DATABASE_URL) console.warn("No DATABASE_URL provided, defaulting to sqlite://data.db")
const db = new Sequelize(process.env.DATABASE_URL || "sqlite://data.db", {logging: false});

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: number;
    declare email: string;
    declare username: string;
    declare salt: Buffer;
    declare hash: Buffer;
    declare loginAttemptNext: number;
}
User.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true
    },
    email: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    username: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    salt: {
        type: DataTypes.BLOB,
        allowNull: false
    },
    hash: {
        type: DataTypes.BLOB,
        allowNull: false
    },
    loginAttemptNext: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
    }
}, {sequelize: db});

export class TokenBlacklist extends Model<InferAttributes<TokenBlacklist>, InferCreationAttributes<TokenBlacklist>> {
    declare id: Buffer;
    declare expires: Date;
}
TokenBlacklist.init({
    id: {
        type: DataTypes.BLOB,
        primaryKey: true
    },
    expires: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    indexes: [{
        unique: true,
        fields: ['id']
    }], 
    sequelize: db,
    timestamps: false,
    freezeTableName: true
});


db.authenticate().then(()=>{
    db.sync({ alter: true }).then(()=>{
        console.log('Database has been connected!');
    });
}).catch((err)=>{
    console.log('Could not connect to database: ', err)
})
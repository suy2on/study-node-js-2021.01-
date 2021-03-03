const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true, //빈값은 겹치는거 아니다
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100), // 암호화시 글자길이 생각해서
                allowNull: true, //카카오로그인시 없을 수 있음
            },
            provider: { //로그인 제공자
                type: Sequelize.STRING(10),
                allowNull: false,
                defaultValue: 'local', //kakao라면 kakao라고 넣자
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
         }, {
                sequelize,
                timestamps: true, // update create at 넣어줌
                underscored: false,
                modelName: 'User',
                tableName: 'users',
                paranoid: true, //deletedAt 자동
                charset: 'utf8',
                collate: 'utf8_general_ci',
            });    
    }
    
    static associate(db){
        db.User.hasMany(db.Post);
        db.User.belongsToMany(db.User, {
            foreignKey: 'followingId',
            as: 'Followers',
            through: 'Follow',
        });
        db.User.belongsToMany(db.User, {
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow',
        });
        db.User.hasMany(db.Domain);
    }
}
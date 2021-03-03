const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      name: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      age: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      married: {
        type: Sequelize.BOOLEAN, // true , false
        allowNull: false,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE, // DATETIME(날짜,시간),  DATE -> DateOnly
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    }, {
      sequelize,
      timestamps: false,  // createdAt, updateAt 자동으로 만들어준다
      underscored: false, // created_At 으로 만들어줌
      modelName: 'User', // js 쓸이름
      tableName: 'users', // mysql에서 쓸이름
      paranoid: false, // deletedAt도 해준다 soft delete
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db){
      db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id' });
  }
 // source키는 내꺼, foreignkey 는 남의 꺼 
};
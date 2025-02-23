const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        firstName: { type: DataTypes.STRING, allowNull: false },
        lastName: { type: DataTypes.STRING, allowNull: false },
        username: { type: DataTypes.STRING, allowNull: false },
        hash: { type: DataTypes.STRING, allowNull: false },
        phoneNo: { type: DataTypes.STRING, allowNull: false },
        imgPath: { type: DataTypes.STRING, allowNull: false }
    };

    const options = {
        defaultScope: {
            
            attributes: { exclude: ['hash'] }
        },
        scopes: {
          
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('User', attributes, options);
}
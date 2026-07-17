import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const CareerCluster = sequelize.define(
"CareerCluster",
{
 id:{
   type:DataTypes.UUID,
   defaultValue:DataTypes.UUIDV4,
   primaryKey:true
 },

 name:{
   type:DataTypes.STRING,
   allowNull:false
 }

},
{
 tableName:"career_clusters",
 timestamps:true,
 underscored:true
}
);
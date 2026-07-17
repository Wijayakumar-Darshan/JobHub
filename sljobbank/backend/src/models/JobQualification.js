import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const JobQualification = sequelize.define(
'JobQualification',
{

id:{
 type:DataTypes.UUID,
 defaultValue:DataTypes.UUIDV4,
 primaryKey:true
},

jobId:{
 type:DataTypes.UUID,
 allowNull:false,
 field:"job_id"
},

qualificationId:{
 type:DataTypes.UUID,
 allowNull:false,
 field:"qualification_id"
},

instituteId:{
 type:DataTypes.UUID,
 allowNull:true,
 field:"institute_id"
},

required:{
 type:DataTypes.BOOLEAN,
 defaultValue:true
}

},
{
 tableName:'job_qualifications',
 timestamps:true,
 underscored:true
}
)
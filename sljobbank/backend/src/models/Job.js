import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const Job = sequelize.define('Job', {

  id:{
    type:DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    primaryKey:true
  },

  title:{
    type:DataTypes.STRING,
    allowNull:false
  },

  description:{
    type:DataTypes.TEXT
  },

  responsibilities:{
    type:DataTypes.TEXT
  },

  qualifications:{
    type:DataTypes.TEXT
  },

  skills:{
    type:DataTypes.TEXT
  },

  clusterId:{
    type:DataTypes.UUID,
    field:'cluster_id'
  },

  salaryMin:{
    type:DataTypes.DOUBLE
  },

  salaryMax:{
    type:DataTypes.DOUBLE
  },

  industryDemand:{
    type:DataTypes.STRING,
    field:'industry_demand'
  },

  sector:{
    type:DataTypes.STRING
  },

  remoteAvailable:{
    type:DataTypes.BOOLEAN,
    defaultValue:false,
    field:'remote_available'
  }

},
{
 tableName:'jobs',
 timestamps:true,
 underscored:true
})
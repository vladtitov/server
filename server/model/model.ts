
import * as ORM from "sequelize";
import {Sequelize, LoggingOptions} from "sequelize";
import * as path from 'path';
//import {initPostModel} from './initModel';


//const dbUrl: string = "postgres://postgres:postgres@localhost:5432/complete-typescript-course";

let file = path.join(__dirname, '../data/posts.sqlite');
console.log(file);
/*
const optionsSQLITE: any = {
  benchmark: true,
  logging:console.log,
  dialect: "sqlite",
  storage: file
};
*/

const options: any = {
  benchmark: true,
  logging:console.log,
  dialect: "mysql",
  host: "front-desk.ca"
};



const sequelize: Sequelize = new ORM('frontdes_callcenter','frontdes','Xzsawq2!', options);
//const sequelizeLite: Sequelize = new ORM('','','',optionsSQLITE);

function initUserModel(sequelize: Sequelize) {
  return sequelize.define("registration", {
    status: ORM.STRING,
    nickname:ORM.STRING,
    confirmed:ORM.BOOLEAN,
    lastVisit:ORM.DATE,
    email:  ORM.STRING,
    password: ORM.TEXT,
    role:ORM.INTEGER,
    createdAt:ORM.DATE,
    updatedAt:ORM.DATE,
    uid:ORM.STRING
  });
}



function initUserModelLite(sequelize: Sequelize) {
  return sequelize.define("registration", {
    uid:ORM.TEXT,
    email:  ORM.TEXT,
    password: ORM.TEXT,
    role:ORM.INTEGER,
    status: ORM.TEXT,
    createdAt:ORM.INTEGER,
    updatedAt:ORM.INTEGER,
    confirmed:ORM.INTEGER,
    lastVisit:ORM.INTEGER,
    nickname:ORM.TEXT
  });
}

export const UserModel =  initUserModel(sequelize);
//export const UserModel =  initUserModelLite(sequelizeLite);

//UserModel.sync({force: true});

export interface VOUser{
  id?:number;
  nickname?:string;
  email?:string;
  role?:number;
  status?:string;
  password?:string;
  uid?:string;
  createdAt?:number;
  updatedAt?:number;
  confirmed?:number;
  lastVisit?:number;
  deviceid?:string;
}
//export const PostModel =  initPostModel(sequelize);


//UserModel.hasMany(PostModel, {foreignKey: "userId"});

//PostModel.belongsTo(UserModel, {foreignKey: "userId"});*/
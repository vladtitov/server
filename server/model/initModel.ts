
import * as ORM from "Sequelize";
import {Sequelize} from "Sequelize";




export function initPostModel(sequelize: Sequelize) {
  return sequelize.define("post", {
     userId: ORM.INTEGER,
    description: ORM.TEXT
  });
}


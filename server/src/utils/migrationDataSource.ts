import { DataSource } from "typeorm";
import { __prod__ } from "../constant";
import { dataSourceObj } from "./dataSourceObj";

const MigrationDataSource = new DataSource(dataSourceObj(__prod__))

export default MigrationDataSource
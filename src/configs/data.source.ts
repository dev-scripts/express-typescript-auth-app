import "reflect-metadata";
import { envVariables } from "./env.variables";
import { DataSource } from "typeorm";
import  {User} from './../entities';
// import { loadEntities, loadSubscribers } from "typeorm-graphql-loader";

export const dataSource = new DataSource({
  type: envVariables.DB_TYPE as "mysql",
  host: envVariables.DB_HOST,
  port: +envVariables.DB_PORT,
  username: envVariables.DB_USER,
  password: envVariables.DB_PASSWORD,
  database: envVariables.DB_NAME,
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: ["src/subscribers/**/*.ts"],
  logging: true,
  synchronize: false,
  migrationsTableName: "_migrations",
});

export const initializeDataSource = async () => {
    if (!dataSource.isConnected) {
    await dataSource.initialize()
      .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
  };
}
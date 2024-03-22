import "reflect-metadata";
import { envVariables } from "./env.variables";
import { DataSource } from "typeorm";

export const dataSource = new DataSource({
  type: envVariables.DB_TYPE as "mysql",
  host: envVariables.DB_HOST,
  port: +envVariables.DB_PORT,
  username: envVariables.DB_USER,
  password: envVariables.DB_PASSWORD,
  database: envVariables.DB_NAME,
  entities: ["./build/entities/**/*.js"],
  migrations: ["./build/migrations/**/*.js"],
  logging: true,
  synchronize: false,
  migrationsTableName: "_migrations",
});

// export const initializeDataSource = async () => {
//     if (!dataSource.isConnected) {
//     await dataSource.initialize()
//       .then(() => {
//     console.log("Data Source has been initialized!");
//   })
//   .catch((err) => {
//     console.error("Error during Data Source initialization:", err);
//   });
//   };
// }
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from 'config';

const { type, port, database, host, username, password, synchronize } = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: type,
    host: process.env.RDS_HOSTNAME || host,
    port: process.env.RDS_PORT || port,
    database: process.env.RDS_DB_NAME || database,
    username: process.env.RDS_USERNAME || username,
    password: process.env.RDS_PASSWORD || password,
    entities: [__dirname + '/../../**/*.entity.{js,ts}'],
    synchronize: process.env.TYPEORM_SYNC || synchronize
}
import {createPool} from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = createPool({
  host: 'mysql-157dc9d5-santiagopontin2811-958d.k.aivencloud.com',
  port: '15658',
  user: 'avnadmin',
  password: '',
  database: 'defaultdb'
});

export default pool;
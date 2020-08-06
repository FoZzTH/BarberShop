import { Pool } from 'pg';
import { databaseConfig } from './database.config';

const pool = new Pool(databaseConfig);

export default {
  query: async (
    text: string,
    params?: Array<string | number | boolean>,
  ): Promise<any> => {
    const { rows } = await pool.query(text, params);
    return rows;
  },
};

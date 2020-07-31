import { Pool } from 'pg';
import { dbConfig } from '../configs/db.config';

const pool = new Pool(dbConfig);

export default {
  query: async (
    text: string,
    params?: Array<string | number | boolean>,
  ): Promise<any> => {
    const { rows } = await pool.query(text, params);
    return rows;
  },
};

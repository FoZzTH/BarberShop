import database from '../database';

import { IMasters } from './masters.interface';

export class MastersRepository {
  findAll(): Promise<Array<IMasters>> {
    return database.query('SELECT id, first_name, last_name FROM masters');
  }

  create(master: IMasters): Promise<null> {
    return database.query(
      'INSERT INTO masters (first_name, last_name) VALUES ($1, $2, $3)',
      [master.first_name, master.last_name],
    );
  }

  findById(id: number): Promise<Array<IMasters>> {
    return database.query(
      'SELECT id, first_name, last_name FROM masters WHERE id = $1',
      [id],
    );
  }

  update(
    id: number,
    column: string,
    to: string | number | boolean,
  ): Promise<null> {
    return database.query(`UPDATE masters SET ${column} = $1 WHERE id = $2`, [
      to,
      id,
    ]);
  }
}

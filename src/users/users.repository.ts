import database from '../database';

import { IUsers } from './users.interface';

export class UsersRepository {
  findAll(): Promise<Array<IUsers>> {
    return database.query(
      'SELECT id, tel_id, first_name, last_name, state FROM users',
    );
  }

  create(user: IUsers): Promise<null> {
    return database.query(
      'INSERT INTO users (tel_id, first_name, last_name, state ) VALUES ($1, $2, $3, $4)',
      [user.tel_id, user.first_name, user.last_name, user.state],
    );
  }

  findByTelId(telId: number): Promise<Array<IUsers>> {
    return database.query(
      'SELECT id, tel_id, first_name, last_name, state FROM users WHERE tel_id = $1',
      [telId],
    );
  }

  update(
    telId: number,
    column: string,
    to: string | number | boolean,
  ): Promise<null> {
    return database.query(`UPDATE users SET ${column} = $1 WHERE tel_id = $2`, [
      to,
      telId,
    ]);
  }
}

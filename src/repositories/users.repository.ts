import db from '../db';

import { IUsers } from 'src/interfaces/users.interface';

export class UsersRepository {
  findAll(): Promise<Array<IUsers>> {
    return db.query('SELECT id, tel_id, first_name, last_name FROM users');
  }

  create(user: IUsers): Promise<null> {
    return db.query(
      'INSERT INTO users (tel_id, first_name, last_name) VALUES ($1, $2, $3)',
      [user.tel_id, user.first_name, user.last_name],
    );
  }

  findByTelId(telId: number): Promise<IUsers> {
    return db.query(
      'SELECT id, tel_id, first_name, last_name FROM users WHERE tel_id = $1',
      [telId],
    );
  }

  update(
    telId: number,
    column: string,
    to: string | number | boolean,
  ): Promise<null> {
    return db.query(`UPDATE users SET ${column} = $1 WHERE tel_id = $2`, [
      to,
      telId,
    ]);
  }
}
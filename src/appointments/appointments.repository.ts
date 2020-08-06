import database from '../database';

import { IAppointments } from './appointments.interface';

export class AppointmentsRepository {
  findAll(): Promise<Array<IAppointments>> {
    return database.query(
      'SELECT id, users_id, masters_id, email, date, service FROM appointments',
    );
  }

  create(appointment: IAppointments): Promise<null> {
    return database.query(
      `INSERT INTO appointments (users_id, masters_id, email, date, service) 
      VALUES (
        (SELECT id FROM users WHERE tel_id = $1 LIMIT 1), 
        (SELECT id FROM masters WHERE id = $2 LIMIT 1),
        $3, $4, $5)`,
      [
        appointment.user_id,
        appointment.masters_id,
        appointment.email,
        appointment.date,
        appointment.service,
      ],
    );
  }

  findById(id: number): Promise<Array<IAppointments>> {
    return database.query(
      'SELECT id, users_id, masters_id, email, date, service FROM appointments WHERE id = $1',
      [id],
    );
  }

  update(
    id: number,
    column: string,
    to: string | number | boolean,
  ): Promise<null> {
    return database.query(
      `UPDATE appointments SET ${column} = $1 WHERE id = $2`,
      [to, id],
    );
  }

  findByUser(usersId: number): Promise<Array<IAppointments>> {
    return database.query(
      'SELECT id, users_id, masters_id, email, date, service FROM appointments WHERE users_id = $1',
      [usersId],
    );
  }

  getList(userId: number): Promise<Array<IAppointments>> {
    return database.query(
      'SELECT id, users_id, masters_id, email, date, service FROM appointments WHERE users_id = $1 AND now() < date::timestamp',
      [userId],
    );
  }

  getOldList(userId: number): Promise<Array<IAppointments>> {
    return database.query(
      'SELECT id, users_id, masters_id, email, date, service FROM appointments WHERE users_id = $1 AND now() > date::timestamp',
      [userId],
    );
  }

  findWereColumnNull(
    userId: number,
    column: string,
  ): Promise<Array<IAppointments>> {
    return database.query(
      `SELECT id, users_id, masters_id, email, date, service FROM appointments WHERE users_id = $1 AND ${column} IS NULL`,
      [userId],
    );
  }

  delete(id: number): Promise<null> {
    return database.query('DELETE FROM appointments WHERE id = $1', [id]);
  }

  clear(userId: number): Promise<null> {
    return database.query(
      'DELETE FROM appointments WHERE users_id = $1 AND masters_id IS NULL',
      [userId],
    );
  }

  getWhereDateOverlap(date: string): Promise<Array<IAppointments> | null> {
    return database.query(
      `SELECT id, date FROM appointments WHERE date - $1 < INTERVAL '1 hours' AND date - $1 > INTERVAL '-1 hours'`,
      [date],
    );
  }

  beginTransaction(): Promise<null> {
    return database.query('BEGIN');
  }

  commitTransaction(): Promise<null> {
    return database.query('COMMIT');
  }

  rollbackTransaction(toSavePoint: boolean, name?: string): Promise<null> {
    return database.query(
      toSavePoint ? `ROLLBACK TO SAVEPOINT ${name}` : 'ROLLBACK',
    );
  }

  savepointTransaction(name: string): Promise<null> {
    return database.query(`SAVEPOINT ${name}`);
  }

  setColumnNull(id: number, column: string): Promise<null> {
    return database.query(
      `UPDATE appointments SET ${column} = NULL WHERE id = $1`,
      [id],
    );
  }

  getFromView() {
    return database.query('SELECT * FROM todayAppointments');
  }

  getFromProc(service) {
    // return database.query(
    //   `SELECT COUNT(DISTINCT u.id) as uniq_users, a.service
    //   FROM appointments a JOIN users u ON a.users_id = u.id
    //   WHERE LOWER(a.service) = LOWER($1)
    //   GROUP BY a.service`, [service]
    // );

    return database.query('SELECT * FROM analysis($1)', [service]);
  }
}

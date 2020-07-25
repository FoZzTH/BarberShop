import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table
export class AppointmServices extends Model<AppointmServices> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.INTEGER,
  })
  appointment_id: number;

  @Column({
    type: DataType.INTEGER,
  })
  service_id: number;
}

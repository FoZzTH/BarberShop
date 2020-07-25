import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table
export class Appointments extends Model<Appointments> {
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
  user_id: number;

  @Column({
    type: DataType.INTEGER,
  })
  master_id: number;

  @Column({
    type: DataType.DATE,
  })
  date: string;

  @Column({
    type: DataType.TIME,
  })
  time: string;
}

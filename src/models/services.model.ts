import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table
export class Services extends Model<Services> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
  })
  value: string;
}

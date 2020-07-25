import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table
export class Messages extends Model<Messages> {
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
  chat_id: number;

  @Column({
    type: DataType.INTEGER,
  })
  date_id: number;

  @Column({
    type: DataType.STRING,
  })
  text: string;
}

import { Sequelize } from 'sequelize-typescript';
import { sequelizeConfig } from '../configs/sequelize.config';
import {
  Users,
  AppointmServices,
  Appointments,
  Masters,
  Messages,
  Services,
} from '../models';

export const dbService = {
  provide: 'SequelizeInstance',
  useFactory: async () => {
    const sequelize = new Sequelize(sequelizeConfig);

    sequelize.addModels([
      Users,
      Services,
      Appointments,
      AppointmServices,
      Messages,
      Masters,
    ]);
    await sequelize.sync();

    return sequelize;
  },
};

import { Injectable } from '@nestjs/common';
import { AppointmentsRepository } from './appointments.repository';
import { IAppointments } from './appointments.interface';
import { ITelCtx } from 'src/interfaces/ctx.interface';
import { UsersService } from 'src/users/users.service';
import { Printer } from 'prettier';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
    private readonly usersService: UsersService,
  ) {}

  async findById(id: number): Promise<IAppointments | null> {
    const appointments = await this.appointmentsRepository.findById(id);
    return appointments ? appointments[0] : null;
  }

  findAll(): Promise<Array<IAppointments>> {
    return this.appointmentsRepository.findAll();
  }

  async create(appointment: IAppointments): Promise<boolean> {
    await this.appointmentsRepository.create(appointment);

    return true;
  }

  async findWereColumnNull(
    ctx: ITelCtx,
    column: string,
  ): Promise<IAppointments | null> {
    const user = await this.usersService.findByTelId(ctx);
    const appointments = await this.appointmentsRepository.findWereColumnNull(
      user.id,
      column,
    );

    return appointments ? appointments[0] : null;
  }

  async update(
    appointment_id: number,
    column: string,
    to: string | null,
  ): Promise<boolean> {
    await this.appointmentsRepository.update(appointment_id, column, to);

    return true;
  }

  async getList(ctx: ITelCtx): Promise<Array<IAppointments>> {
    const user = await this.usersService.findByTelId(ctx);
    const appointments = await this.appointmentsRepository.getList(user.id);

    return appointments;
  }

  async getOldList(ctx: ITelCtx): Promise<Array<IAppointments>> {
    const user = await this.usersService.findByTelId(ctx);
    const appointments = await this.appointmentsRepository.getOldList(user.id);

    return appointments;
  }

  async clear(ctx: ITelCtx): Promise<boolean> {
    const user = await this.usersService.findByTelId(ctx);
    this.appointmentsRepository.clear(user.id);

    return true;
  }

  async getWhereDateOverlap(
    date: string,
  ): Promise<Array<IAppointments> | null> {
    return this.appointmentsRepository.getWhereDateOverlap(date);
  }

  async delete(id: number): Promise<null> {
    return this.appointmentsRepository.delete(id);
  }

  async beginTransaction(): Promise<null> {
    return this.appointmentsRepository.beginTransaction();
  }

  async commitTransaction(): Promise<null> {
    return this.appointmentsRepository.commitTransaction();
  }

  async rollbackTransaction(
    toSavePoint: boolean = false,
    name?: string,
  ): Promise<null> {
    return this.appointmentsRepository.rollbackTransaction(toSavePoint, name);
  }

  async savepointTransaction(name: string): Promise<null> {
    return this.appointmentsRepository.savepointTransaction(name);
  }

  async setColumnNull(id: number, column: string): Promise<null> {
    return this.appointmentsRepository.setColumnNull(id, column);
  }

  getFromView(): Promise<Array<object>> {
    return this.appointmentsRepository.getFromView();
  }

  getFromProc(service: string): Promise<Array<object>> {
    return this.appointmentsRepository.getFromProc(service);
  }
}

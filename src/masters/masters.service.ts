import { Injectable } from '@nestjs/common';
import { MastersRepository } from './masters.repository';
import { IMasters } from './masters.interface';
import { ITelCtx } from 'src/interfaces/ctx.interface';

@Injectable()
export class MastersService {
  constructor(private readonly mastersRepository: MastersRepository) {}

  findAll(): Promise<Array<IMasters>> {
    return this.mastersRepository.findAll();
  }

  async findById(id: number) {
    const master = await this.mastersRepository.findById(id);

    return master[0];
  }
}

import { Injectable, Inject } from '@nestjs/common';

import { Services } from '../models';
import { IService } from 'src/interfaces/service.interfaces';

@Injectable()
export class ServicesService {
  constructor(
    @Inject('ServicesRepository')
    private readonly servicesRepository: typeof Services,
  ) {}

  public async getOrCreateServiceIfNotEx(
    value: string,
  ): Promise<Services | null> {
    const service: IService = {
      id: 0,
      value: value,
    };

    const dbService = await this.findByValue(value);

    if (dbService) {
      return dbService;
    }

    return this.servicesRepository.create(service);
  }

  public findByValue(value: string): Promise<Services | null> {
    return this.servicesRepository.findOne({
      where: {
        value: value,
      },
    });
  }
}

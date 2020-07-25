import { Injectable, Inject } from '@nestjs/common';

import { Masters } from '../models';

@Injectable()
export class MastersService {
  constructor(
    @Inject('MastersRepository')
    private readonly mastersRepository: typeof Masters,
  ) {}
}

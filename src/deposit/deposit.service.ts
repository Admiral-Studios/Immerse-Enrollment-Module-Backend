import { Injectable } from '@nestjs/common';
import { EntityManager } from '../dal/entity-manager';
import { CreateDepositDto } from './dto/request-dto/create-deposits.dto';
import { plainToInstance } from 'class-transformer';
import { DepositResponseDto } from './dto/response-dto/deposit-response.dto';

@Injectable()
export class DepositService {
  constructor(private readonly em: EntityManager) {}

  public async createDeposits(createDepositsDto: CreateDepositDto[]) {
    const deposit = await this.em.depositRepository.createDeposit(
      createDepositsDto[0],
    );

    return plainToInstance(DepositResponseDto, deposit);
  }

  public async getAllDeposits() {
    const deposits = await this.em.depositRepository.findAll();
    return plainToInstance(DepositResponseDto, deposits);
  }
}

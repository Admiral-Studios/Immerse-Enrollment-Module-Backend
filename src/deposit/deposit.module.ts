import { Module } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { DepositController } from './deposit.controller';
import { DalModule } from '../dal/dal.module';

@Module({
  imports: [DalModule],
  controllers: [DepositController],
  providers: [DepositService],
})
export class DepositModule {}

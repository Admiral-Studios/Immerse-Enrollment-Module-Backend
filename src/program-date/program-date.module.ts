import { Module } from '@nestjs/common';
import { DalModule } from '../dal/dal.module';
import { ProgramDateController } from './program-date.controller';
import { ProgramDateService } from './program-date.service';

@Module({
  imports: [DalModule],
  controllers: [ProgramDateController],
  providers: [ProgramDateService],
  exports: [ProgramDateService],
})
export class ProgramDateModule {}

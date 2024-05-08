import {
  Body,
  Controller,
  Get,
  ParseArrayPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DepositService } from './deposit.service';
import { ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { CreateDepositDto } from './dto/request-dto/create-deposits.dto';
import { DepositResponseDto } from './dto/response-dto/deposit-response.dto';

@ApiTags('deposit')
@Controller('deposit')
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @Get()
  @ApiSecurity('x-api-key')
  @UseGuards(ApiKeyGuard)
  getAllDeposits(): Promise<DepositResponseDto[]> {
    return this.depositService.getAllDeposits();
  }

  @Post()
  @ApiBody({ type: [CreateDepositDto] })
  @ApiSecurity('x-api-key')
  @UseGuards(ApiKeyGuard)
  createProducts(
    @Body(
      new ParseArrayPipe({
        items: CreateDepositDto,
      }),
    )
    uploadDepositsDto: CreateDepositDto[],
  ): Promise<DepositResponseDto> {
    return this.depositService.createDeposits(uploadDepositsDto);
  }
}

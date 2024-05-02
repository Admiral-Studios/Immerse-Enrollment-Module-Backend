import {
  Body,
  Controller,
  Get,
  ParseArrayPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { UploadCouponsDto } from './dto/request-dto/upload-coupons.dto';
import { ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CouponResponseDto } from './dto/response-dto/coupon-response.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { DeleteProductsDto } from '../product/dto/request-dto/delete-products.dto';
import { DeleteCouponsDto } from './dto/request-dto/delete-coupons.dto';

@Controller('coupon')
@ApiTags('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get()
  @ApiSecurity('x-api-key')
  @UseGuards(ApiKeyGuard)
  getAllCoupons(): Promise<CouponResponseDto[]> {
    return this.couponService.getAllCoupons();
  }

  @Post()
  @ApiBody({ type: [UploadCouponsDto] })
  @ApiSecurity('x-api-key')
  @UseGuards(ApiKeyGuard)
  uploadCoupons(
    @Body(
      new ParseArrayPipe({
        items: UploadCouponsDto,
      }),
    )
    uploadCouponsDto: UploadCouponsDto[],
  ) {
    return this.couponService.uploadCoupons(uploadCouponsDto);
  }

  @Post('delete')
  @ApiSecurity('x-api-key')
  @UseGuards(ApiKeyGuard)
  deleteNotExistingCoupons(@Body() deleteCouponsDto: DeleteCouponsDto) {
    return this.couponService.deleteNotExistingCoupons(
      deleteCouponsDto.existingCouponsIds,
    );
  }
}

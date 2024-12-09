import {
  IsInt,
  IsString,
  IsUUID,
  Min,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CalculatePriceDto {
  @IsInt()
  @Min(1, { message: 'Số lượng vé phải lớn hơn hoặc bằng 1.' })
  ticketCount: number;

  @IsString()
  seatClass: string;

  @IsUUID('4', { message: 'ID chuyến bay không hợp lệ.' })
  flightId: string;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Discount phải là một số hợp lệ và không quá 2 chữ số thập phân.',
    },
  )
  @Min(0, { message: 'Discount không được âm.' })
  discount?: number; // Thuộc tính không bắt buộc
}

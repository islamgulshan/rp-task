import { IsNotEmpty, Matches } from 'class-validator';
import { ResponseMessage } from '../../../utils/enum';

export class CarDto {
  @IsNotEmpty()
  @Matches(/^[a-zA-Z ]{3,26}$/, {
    message: ResponseMessage.INVALID_NAME,
  })
  name: string;

  @IsNotEmpty()
  @Matches(/^[a-zA-Z ]{3,26}$/, {
    message: ResponseMessage.INVALID_COLOR,
  })
  color: string;

  @IsNotEmpty()
  model: string;

  @IsNotEmpty()
  make: string;

  @IsNotEmpty()
  registration_no: string;

  @IsNotEmpty()
  category_id: number;
  
}

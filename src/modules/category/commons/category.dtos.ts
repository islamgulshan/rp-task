import { IsNotEmpty, Matches } from 'class-validator';
import { ResponseMessage } from '../../../utils/enum';

export class CategoryDto {
  @IsNotEmpty()
  @Matches(/^[a-zA-Z ]{3,26}$/, {
    message: ResponseMessage.INVALID_NAME,
  })
  name: string;
  
}

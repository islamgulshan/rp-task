import { IsEmail, IsNotEmpty, IsNumberString, Matches } from 'class-validator';
import { ResponseMessage } from '../../utils/enum';
import { IsValidCountry } from '../../modules/common/validator/country.validator';
import { IsValidPhoneNumber } from '../../modules/common/validator/phone.validator';
import { SameAs } from './../common/validator/same-as.validator';

export class RegisterPayload {
  @IsNotEmpty()
  @Matches(/^[a-zA-Z ]{3,26}$/, {
    message: ResponseMessage.INVALID_FIRSTNAME,
  })
  firstName: string;

  @IsNotEmpty()
  @Matches(/^[a-zA-Z ]{3,26}$/, {
    message: ResponseMessage.INVALID_LASTNAME,
  })
  lastName: string;

  @IsNotEmpty()
  @IsValidCountry()
  country: string;

  @IsEmail()
  @IsNotEmpty()
  @Matches(
    /^[a-zA-Z]+[a-zA-Z0-9_.-]*[a-zA-Z0-9]+@(([a-zA-Z0-9-]){3,30}.)+([a-zA-Z0-9]{2,5})$/,
    { message: ResponseMessage.INVALID_EMAIL },
  )
  @Matches(/^(?!.*[-_.]{2}).*$/, {
    message: ResponseMessage.INVALID_EMAIL,
  })
  email: string;

  @IsNotEmpty()
  @IsValidPhoneNumber()
  phoneNumber: string;
}
 

export class EmailDto {
  @IsNotEmpty()
  email: string;
}

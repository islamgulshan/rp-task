import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Injectable } from '@nestjs/common';
import { ResponseCode, ResponseMessage } from '../../utils/enum';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  static configureSendGrid() {
    return {
      transport: {
        service: 'sendgrid',
        host: 'smtp.sendgrid.net',
        secure: false,
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY,
        },
      },
      defaults: {
        from: process.env.SENDGRID_EMAIL,
      },
    };
  }

 
 
  /**
   * Send verification code email to user on signup
   *
   * @param email
   * @param verificationCode
   */
  public async sendEmailPassword(
    user: any,
    password: string,
  ): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      const currentYear = new Date().getFullYear();
      try {
        await this.mailerService.sendMail({
          to: user.email,
          subject: 'Welcome',
          html: `<html lang="en">
            <head>
              <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet" type="text/css">
              <link href="https://fonts.googleapis.com/css?family=Rubik:400,700&display=swap" rel="stylesheet" type="text/css">
            </head>
            <body style="background-color: #111111;">
            <table bgcolor="#111111" role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" height="100%" align="center">
            <tbody><tr>
            <td bgcolor="#111111" style="background-color:#111111;padding-top:0px" valign="top" align="center" class="m_6069702506707232563pd_10">
            
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center">
            <tbody><tr>
            <td align="center" valign="top" bgcolor="#111111">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" class="m_6069702506707232563table" style="width:100%;max-width:600px">
            
            <tbody><tr>
            <td align="center" valign="top" class="m_6069702506707232563table" style="padding-top:25px">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" align="center">
            
            <tbody> <tr>
            <td align="center" valign="top">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" align="center">
            <tbody><tr>
            <td align="center" valign="top">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tbody><tr>
            <td style="border-left:1px solid #e5e7e8;border-right:1px solid #e5e7e8;border-top:1px solid #eff1f2;border-bottom:1px solid #e5e7e8;border-collapse:collapse;border-radius:8px" align="center" bgcolor="#F8F9FA" valign="top" width="100%">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tbody><tr>
            <td style="border-left:1px solid #e0e2e3;border-right:1px solid #e0e2e3;border-top:1px solid #eefof1;border-bottom:1px solid #e0e2e3;border-collapse:collapse;border-radius:8px" align="center" bgcolor="#F8F9FA" valign="top" width="100%">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tbody><tr>
            <td style="border-left:1px solid #dbdddd;border-right:1px solid #dbdddd;border-top:1px solid #eceeef;border-bottom:1px solid #dbdddd;border-collapse:collapse;border-radius:8px" align="center" bgcolor="#F8F9FA" valign="top" width="100%">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tbody><tr>
            <td style="border-left:1px solid #d5d7d8;border-right:1px solid #d5d7d8;border-top:1px solid #e9ebec;border-bottom:1px solid #d5d7d8;border-collapse:collapse;border-radius:8px" align="center" bgcolor="#F8F9FA" valign="top" width="100%">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tbody><tr>
            <td style="border-radius: 8px;border-collapse:collapse" width="100%" bgcolor="#ffffff">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
            
            <tbody>
            <tr>
            <td align="left" valign="top" style="padding:40px">
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="min-width: 600px;">
            <tbody> 

            <tr>
<td class="m_6069702506707232563pd_r0" align="left" valign="top" style="font-size:14px;line-height:24px;font-family:Rubik,Open Sans,Arial,sans-serif;color:#1f1f1f;padding-bottom:15px;padding-right:0px">
<p>
Please use password for login
  </p>
</td>
</tr>

            <tr>
            <td align="center" valign="middle" style="background-color:#000;border-radius:4px;color:#ffffff;font-size:16px;line-height:24px;font-family:Google Sans,Roboto,Arial,Helvetica,sans-serif;font-weight:500;border-top:12px solid #000;border-right:24px solid #000;border-bottom:12px solid #000;border-left:24px solid #000;text-decoration:none;display:block">
${password}
</td>
            </tr>
           
            </tbody></table>
            </td>
            </tr>
            
            </tbody></table>
            </td>
            </tr>
            </tbody></table>
            </td>
            </tr>
            </tbody></table>
            </td>
            </tr>
            </tbody></table>
            </td>
            </tr>
            </tbody></table>
            </td>
            </tr>
            </tbody></table>
            </td>
            </tr>
            </tbody></table>
            </td>
            </tr>
            <tr>
            <td aria-hidden="true" align="center" valign="top" style="font-size:14px;line-height:24px;font-family:Rubik,Open Sans,Arial,sans-serif;color:#4a4a4a;padding:10px">
            Copyright © ${currentYear} Task. All rights reserved.
            </td>
            </tr>
            </tbody></table>
            </td>
            </tr>
            </tbody></table>
            </td>
            </tr>
            </tbody></table>
            
            </td>
            </tr>
            </tbody></table>
            </body>
            </html>`,
        });
        resolve();
      } catch (err) {
        console.log(err);

        reject(
          new HttpException(
            {
              statusCode: ResponseCode.EMAIL_SENDING_ERROR,
              message: ResponseMessage.EMAIL_SENDING_ERROR,
            },
            ResponseCode.BAD_REQUEST,
          ),
        );
      }
    });
  }
 
  
}

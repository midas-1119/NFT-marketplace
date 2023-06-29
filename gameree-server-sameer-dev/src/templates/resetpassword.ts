export const resetPasswordTemplate = ( link ) =>{
    return (
        `<head>
        <title>Rating Reminder</title>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
        <meta content="width=device-width" name="viewport">
        <style type="text/css">
            @font-face {
            font-family: &#x27;Postmates Std&#x27;;
            font-weight: 600;
            font-style: normal;
            src: local(&#x27;Postmates Std Bold&#x27;), url(https://s3-us-west-1.amazonaws.com/buyer-static.postmates.com/assets/email/postmates-std-bold.woff) format(&#x27;woff&#x27;);
            }

            @font-face {
            font-family: &#x27;Postmates Std&#x27;;
            font-weight: 500;
            font-style: normal;
            src: local(&#x27;Postmates Std Medium&#x27;), url(https://s3-us-west-1.amazonaws.com/buyer-static.postmates.com/assets/email/postmates-std-medium.woff) format(&#x27;woff&#x27;);
            }

            @font-face {
            font-family: &#x27;Postmates Std&#x27;;
            font-weight: 400;
            font-style: normal;
            src: local(&#x27;Postmates Std Regular&#x27;), url(https://s3-us-west-1.amazonaws.com/buyer-static.postmates.com/assets/email/postmates-std-regular.woff) format(&#x27;woff&#x27;);
            }
        </style>
        <style media="screen and (max-width: 680px)">
            @media screen and (max-width: 680px) {
                .page-center {
                padding-left: 0 !important;
                padding-right: 0 !important;
                }
                
                .footer-center {
                padding-left: 20px !important;
                padding-right: 20px !important;
                }
            }
        </style>
        </head>
        <body style="background-color: #f4f4f5;">
        <table cellpadding="0" cellspacing="0" style="width: 100%; height: 100%; background-color: #f4f4f5; text-align: center;">
        <tbody><tr>
        <td style="text-align: center;">
        <table align="center" cellpadding="0" cellspacing="0" id="body" style="background-color: #fff; width: 100%; max-width: 680px; height: 100%;">
        <tbody><tr>
        <td>
        <table align="center" cellpadding="0" cellspacing="0" class="page-center" style="text-align: left; padding-bottom: 50px; padding-top: 20px; width: 100%; padding-left: 30px; padding-right: 30px;">
        <tbody><tr>
        <td style="text-align: center;">
            <img style="width: 250px; height: 70px; display: block; margin: 0 auto;" src="https://d1pgqke3goo8l6.cloudfront.net/wRMe5oiRRqYamUFBvXEw_logo.png"/>
        </td>
        </tr>
        <tr>
        <td colspan="2" style="padding-top: 40px; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #000000; text-align: center; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 48px; font-smoothing: always; font-style: normal; font-weight: 600; letter-spacing: -2.6px; line-height: 52px; mso-line-height-rule: exactly; text-decoration: none;">Are you having trouble signing in ?</td>
        </tr>
        <tr>
        <td style="-ms-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #9095a2; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 20px; font-smoothing: always; font-style: normal; font-weight: 500; letter-spacing: -0.18px; line-height: 24px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: top; width: 100%; padding-top: 30px; padding-bottom: 30px; text-align: center;">
            You can follow these steps to reset your password.
        </td>
        </tr>
        <tr>
        <td>
            <p style="font-size:18px; padding: 0 0 8px; font-weight:400;margin:0;">Step 1 : Go to <a  data-click-track-id="37" href="${link}" style="color: #000; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-smoothing: always; font-style: normal; font-weight: 600; mso-line-height-rule: exactly; text-decoration: none; text-align: center; target="_blank">Gameree Marketplace</a></p>
            <p style="font-size:18px; padding: 8px 0; font-weight:400;margin:0;">Step 2 : Click on Sign In and then click Forgot Password ?</p>
            <p style="font-size:18px; padding: 8px 0; font-weight:400;margin:0;">Step 3 : Enter your email address</p>
            <p style="font-size:18px; padding: 8px 0; font-weight:400;margin:0;">Step 4 : Check your email for Reset password code</p>
            <p style="font-size:18px; padding: 8px 0; font-weight:400;margin:0;">Step 5 : Enter the code to reset your password</p>
            <p style="font-size:18px; padding: 8px 0; font-weight:400;margin:0;">Step 6 : Login to start using Gameree Marketplace</p>
        </td>
        </tr>
        <tr>
        <td style="padding-top: 25px; padding-bottom: 25px;">
        <table cellpadding="0" cellspacing="0" style="width: 100%">
        <tbody>
        <tr>
        <td style="text-align: center;">
            <img style="width: 300px; height: 300px; margin: 10px 0 10px;" src="https://waffa-fe.s3.amazonaws.com/14ba50c6-30a1-416a-83c8-bc5dc439c534-MicrosoftTeams-image%20%284%29.png"/>
        </td>
        </tr>
        <tr>
        <td style="text-align: center;">
            <img style="width: 300px; height: 300px; margin: 10px 0 15px;" src="https://waffa-fe.s3.amazonaws.com/31e1c4a2-d2ef-4cde-afac-04f57ed7d0d9-MicrosoftTeams-image%20%281%29.png"/>
        </td>
        </tr>
        <tr>
        <td style="text-align: center;">
            <img style="width: 300px; height: 300px; margin: 10px 0 15px;" src="https://waffa-fe.s3.amazonaws.com/090c5e61-b625-4f71-9add-7db812e0e1eb-MicrosoftTeams-image%20%282%29.png"/>
        </td>
        </tr>
        </tbody></table>
        </td>
        </tr>
        <tr>
        </tr>
        <tr>
        <td style="-ms-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #9095a2; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 16px; font-smoothing: always; font-style: normal; font-weight: 400; letter-spacing: -0.18px; line-height: 24px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: top; width: 100%;">
             Thank you.
        </td>
        </tr>
        </tbody></table>
        </td>
        </tr>
        </tbody></table>
        </body>`
    )
}
const nodemailer = require('nodemailer')
import { OAuth2Client } from 'google-auth-library'

const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground'

const sendEmail = async(to: string, subject: string, url: string) => {
  const oAuth2Client = new OAuth2Client(
    // process.env.GOOGLE_CLIENT_ID,
    '339838492859-tasrm3s56o7nv6rrnhvjb8hndnctcu6c.apps.googleusercontent.com',
    // process.env.GOOGLE_CLIENT_SECRET,
    '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',
    OAUTH_PLAYGROUND
  )
  oAuth2Client.setCredentials({ refresh_token: '1//04B6mSqm8e4OACgYIARAAGAQSNwF-L9IrooQvKJXA4Iro9ZQZeZ43Go_HTwuXf3o5BkP_YQtbwfNkjgilvF0tYGDlrCmu7gKZZH8' })

  try {
    const accessToken = await oAuth2Client.getAccessToken()

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'duniakodingacademy@gmail.com',
        clientId: '339838492859-tasrm3s56o7nv6rrnhvjb8hndnctcu6c.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken: '1//04B6mSqm8e4OACgYIARAAGAQSNwF-L9IrooQvKJXA4Iro9ZQZeZ43Go_HTwuXf3o5BkP_YQtbwfNkjgilvF0tYGDlrCmu7gKZZH8',
        accessToken
      }
    })

    const options = {
      from: 'duniakodingacademy@gmail.com',
      to,
      subject: `Discussme - ${subject}`,
      html: `
        <div style="border: 5px solid #ccc; padding: 15px;">
          <h1 style="text-align: center;">Fintrack ${subject}</h1>
          <p>Please click below button to proceed the chosen action</p>
          <a style="display: block; text-decoration: none; background: orange; color: #fff; width: 130px; height: 35px; text-align: center; line-height: 35px; margin-top: 15px" href=${url}>Click Me</a>
          <div style="margin-top: 20px;">
            <p>Thank you for using <strong>Discussme</strong> as your discussion app.
            <p>Warm Regards,</p>
            <p>- Discussme Team -</p>
          </div>
        </div>
      `
    }

    const result = await transport.sendMail(options)
    return result
  } catch (err) {
    console.log(err)
  }
}

export default sendEmail
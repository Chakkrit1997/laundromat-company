import axios from 'axios'
import querystring from 'querystring'
import Env from '@ioc:Adonis/Core/Env'
const LineAccessToken = Env.get('LINE_ACCESS_TOKEN', '')
export const LineNotify = async (MachineNumber: number, Message: string) => {
  try {
    await axios({
      method: 'post',
      url: 'https://notify-api.line.me/api/notify',
      data: querystring.stringify({
        message: `MachineNumber[${MachineNumber}]` + Message,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${LineAccessToken}`,
      },
    })
  } catch (error) {
    console.log('Error: Service LineNotify', error)
  }
}

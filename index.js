const admin = require('firebase-admin')
const { google } = require('googleapis')
const axios = require('axios')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const serviceAccount = require('./fcm-6937c-firebase-adminsdk-5xtwx-eacb818cc5.json')
const databaseURL = 'https://fcm-6937c.firebaseio.com'
const URL =
  'https://fcm.googleapis.com/v1/projects/fcm-6937c/messages:send'
const deviceToken =
  'ds6WqTYUdncggNBRZuqacP:APA91bH-QUMqew0BsxiGEtNz8Lk_p8RgFSeLo10htM39yPRrIKhMzj9Fx4WpwiEpnMFFiy_nJQxWEA3cepveau3b_xyC7RUbkzkd8Vcxiok9h2bGvPOMNTbKqwfs7ro0eEdhPkpkyCeS'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var key = serviceAccount
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    )
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}

async function init() {
  const body = {
    message: {
      data: { key: 'value' },
      notification: {
        title: 'Notification title pipat',
        body: 'Notification body'
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          requireInteraction: 'true'
        }
      },
      token: deviceToken
    }
  }

  try {
    const accessToken = await getAccessToken()
    console.log('accessToken: ', accessToken)
    const { data } = await axios.post(URL, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log('name: ', data.name)
  } catch (err) {
    console.log('err: ', err.message)
  }
}

init()

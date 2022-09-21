import { decodeJwt, parseJwt } from '@cfworker/jwt'
import bodyParser from '@zentered/issue-forms-body-parser'
import { add } from 'date-fns'
import pkg from 'date-fns-tz'
const { zonedTimeToUtc } = pkg

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const oicd = request.headers.get('Authorization')
  const decoded = decodeJwt(oicd)

  const issuer = 'https://token.actions.githubusercontent.com'
  const audience = decoded.payload.aud

  const parsedJwt = await parseJwt(oicd, issuer, audience)

  if (!parsedJwt.valid) {
    console.error(parsedJwt.reason)
    return
  }

  const data = await request.json()
  const { serverId, timeZone, payload } = data
  const parsedBody = await bodyParser(payload.issue.body)

  // TODO: simplify date handling
  const startTime = parsedBody.time
  const startDate = parsedBody.date
  const duration = parsedBody.duration?.duration
  const content = parsedBody['event-description']
  const location = parsedBody.location
  const zonedDateTime = `${startDate.date}T${startTime.time}`

  const utcDate = zonedTimeToUtc(zonedDateTime, timeZone)
  const utcEndDate = add(utcDate, duration)

  // TODO: adjust entity type and privacy level depending on online/offline events from issue body
  const discordEventData = {
    name: payload.issue.title,
    description: content.text,
    scheduled_start_time: utcDate.toJSON(),
    scheduled_end_time: utcEndDate.toJSON(),
    privacy_level: 2,
    entity_type: 3,
    entity_metadata: {
      location: location.text
    }
  }

  console.log(discordEventData)

  const discordRequestOptions = {
    method: 'POST',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      Authorization: `Bot ${DISCORD_TOKEN}`
    },
    body: JSON.stringify(discordEventData)
  }

  // console.log(JSON.stringify(discordEventData))

  // TODO: response is always {}, should output errors
  const apiResponse = await fetch(
    `${DISCORD_API_URL}/guilds/${serverId}/scheduled-events`,
    discordRequestOptions
  )

  console.log(apiResponse)

  return new Response('OK')
}

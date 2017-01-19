const multicastDNS = require('multicast-dns')
const DNSTXT = require('dns-txt')

const Client = require('castv2-client').Client
const Application = require('castv2-client').Application
const MediaController = require('castv2-client').MediaController

const castName = process.env.CAST_NAME

function foundChromecast(host, res) {
  const client = new Client()

  client.connect(host, () => {
    client.getSessions((err, sessions) => {
      client.join(sessions[0], Application, (err, app) => {
        const media = app.createController(MediaController)
        media.getStatus((err, status) => {
          let response
          if (status.playerState == 'PLAYING') {
            media.pause()
            response = 'paused'
          } else {
            media.play()
            response = 'playing'
          }

          client.close()
          res.send(response)
        })
      })
    })
  })
}

module.exports = (req, res) => {
  const mdns = multicastDNS()

  mdns.on('response', function(response) {
    response.answers.forEach(answer => {
      if (answer.type === 'PTR' && answer.name === '_googlecast._tcp.local') {
        const chromecast = {}

        response.additionals.forEach(additional => {
          if (additional.type === 'TXT') {
            const txt = DNSTXT()
            const record = txt.decode(additional.data)
            chromecast['name'] = record['fn']
          }

          if (additional.type === 'A') {
            chromecast['host'] = additional.data
          }
        })

        if (chromecast.name == castName) {
          mdns.destroy()
          foundChromecast(chromecast.host, res)
        }
      }
    })
  })

  mdns.query('_googlecast._tcp.local', 'PTR')
}

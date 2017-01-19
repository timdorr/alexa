'use strict';

const Alexa = require('alexa-sdk')
const http = require('http')

const APP_ID = 'amzn1.ask.skill.4c552023-f1e1-482f-aa54-56e1c7c11f62'

const handlers = {
  PlayPauseAction: function() {
    http.get(process.env.CAST_URL, res => {
      let status = ''
      res.on('data', data => status += data)
      res.on('end', () => this.emit(':tell', 'The Chromecast is now ' + status))
    })
  }
}

exports.handler = function (event, context) {
  const alexa = Alexa.handler(event, context)
  alexa.appId = APP_ID
  alexa.registerHandlers(handlers)
  alexa.execute()
}

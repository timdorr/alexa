var Alexa = require('alexa-sdk')
var moment = require('moment-timezone')

var APP_ID = 'amzn1.ask.skill.45c35251-e8dc-443a-9c97-3f505dee1eb6'

var schedule = [
  { time: '7:00am',  item: 'bottle' },
  { time: '8:00am',  item: 'baby food and sippy cup' },
  { time: '9:00am',  item: 'nap' },
  { time: '11:00am', item: 'bottle' },
  { time: '12:00pm', item: 'baby food and sippy cup' },
  { time: '1:30pm',  item: 'nap' },
  { time: '3:00pm',  item: 'bottle' },
  { time: '5:30pm',  item: 'nap' },
  { time: '7:00pm',  item: 'bath time and bottle' },
]

function getNext() {
  var now = moment().tz('America/New_York')
  var nextThing = schedule[0]

  for (var i = 0; i < schedule.length; i++) {
    var time = schedule[i].time
    var timeStr = now.format('MM-DD-YYYY') + " " + time
    var scheduled = moment.tz(timeStr, 'MM-DD-YYYY HH:mma', 'America/New_York')
    if (now.isBefore(scheduled)) {
      nextThing = schedule[i]
      break;
    }
  }

  return nextThing
}

var handlers = {
    CheckSchedule: function() {
      var next = getNext()
      this.emit(':tell', 'It\'s time for a ' + next.item + ' at ' + next.time)
    }
}

exports.handler = function (event, context) {
  var alexa = Alexa.handler(event, context)
  alexa.appId = APP_ID
  alexa.registerHandlers(handlers)
  alexa.execute()
}

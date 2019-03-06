# Meeting availability

App that returns the first available meeting time from an array of attendee work schedules.

### How to run

Clone repository and cd into it. Ensure you have Node installed.

Run `npm install`

Run `node`

In node, `meetingAvailability = require('./src/meeting_availability.js')`

Then call `meetingAvailability(schedules)`, passing in meeting schedules, which will return first available time

To run tests, run `npm run test`

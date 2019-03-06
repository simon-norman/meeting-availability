const { expect } = require('chai')
const meetingAvailability = require('../src/meeting_availability')

describe('Find available meeting time', () => {
  it('should return earliest available time, for specified duration, from set of attendee calendars', function () {
    const schedules = [
      [['11:00', '11:30'], ['13:30', '16:00'], ['16:00', '17:30'], ['17:45', '19:00']],
      [['09:15', '12:00'], ['14:00', '16:30'], ['17:00', '17:30']],
      [['11:30', '12:15'], ['15:00', '16:30'], ['17:45', '19:00']],
    ]

    expect(meetingAvailability(schedules, 60)).equals('12:15')
  })
})

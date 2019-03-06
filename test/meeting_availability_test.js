const { expect } = require('chai')
const meetingAvailability = require('../src/meeting_availability')

describe('Find available meeting time', () => {
  it('should return earliest available time, for specified duration, from set of attendee calendars', function () {
    const schedules = [
      [['09:00', '11:30'], ['13:30', '16:00'], ['16:00', '17:30'], ['17:45', '19:00']],
      [['09:15', '12:00'], ['14:00', '16:30'], ['17:00', '17:30']],
      [['11:30', '12:15'], ['15:00', '16:30'], ['17:45', '19:00']],
    ]

    expect(meetingAvailability(schedules, 60)).equals('12:15')
  })

  it('should return earliest available time, including if it is at the start of the day', function () {
    const schedules = [
      [['13:30', '16:00']],
      [['14:00', '16:30']],
    ]

    expect(meetingAvailability(schedules, 60)).equals('09:00')
  })

  it('should return earliest available time, including if it is at the end of the day', function () {
    const schedules = [
      [['09:00', '16:00']],
      [['14:00', '18:00']],
    ]

    expect(meetingAvailability(schedules, 60)).equals('06:00')
  })

  it('should, if a time is the finishing time for an appointment, treat it as available', function () {
    const schedules = [
      [['09:00', '10:00']],
    ]

    expect(meetingAvailability(schedules, 60)).equals('10:00')
  })

  it('should, if a time is the starting time for an appointment, treat it as unavailable', function () {
    const schedules = [
      [['09:59', '12:00']],
    ]

    expect(meetingAvailability(schedules, 60)).equals('12:00')
  })
})

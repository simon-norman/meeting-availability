const { expect } = require('chai')
const PeriodFactory = require('../src/period')

describe('Find available meeting time', () => {
  let Period
  let period
  let startTime
  let endTime
  let noOfUnavailableAttendees

  beforeEach(() => {
    startTime = new Date('2000-01-01 10:00')
    endTime = new Date('2000-01-01 10:02')
    noOfUnavailableAttendees = 1
    Period = PeriodFactory()
  })

  context('Given period with a given start time has NOT been created', function () {
    describe('When createOrUpdateIfExists is called', function () {
      beforeEach(() => {
        period = Period.createOrUpdateIfExists({ startTime, endTime, noOfUnavailableAttendees })
      })

      it('should create period, setting start time', function () {
        expect(period.startTime).equals(startTime)
      })

      it('should create period, setting number of available attendees for period', function () {
        expect(period.noOfUnavailableAttendees).equals(noOfUnavailableAttendees)
      })

      describe('When all is called', function () {
        it('should return all created periods', function () {
          const period2 = Period.createOrUpdateIfExists({
            startTime: new Date('2120-10-12 18:00'),
            noOfUnavailableAttendees,
          })

          expect(Period.all()).deep.equals([period, period2])
        })
      })

      describe('When duration is called on a period', function () {
        it('should return number of seconds between start and end times', function () {
          expect(period.durationInMins()).equals(2)
        })
      })

      describe('When find available period is called on Period with a meeting time', function () {
        context('Given there is an available period for that time', function () {
          it('should return that period start time', function () {
            const period2 = Period.createOrUpdateIfExists({
              startTime: new Date('2000-01-01 10:02'),
              endTime: new Date('2000-01-01 10:12'),
              noOfUnavailableAttendees: 0,
            })

            expect(Period.findAvailablePeriodTime({ duration: 10 })).equals(period2.startTime)
          })
        })

        context('Given there is no available period for that time', function () {
          it('should return null', function () {
            expect(Period.findAvailablePeriodTime({ duration: 10 })).equals(null)
          })
        })
      })
    })
  })

  context('Given period with a given start time was already created', function () {
    it('should update period with updated data when createOrUpdateIfExists is called', function () {
      Period.create({ startTime, noOfUnavailableAttendees })
      Period.createOrUpdateIfExists({ startTime, noOfUnavailableAttendees: 10 })

      expect(Period.all()[0].noOfUnavailableAttendees).equals(10)
    })

    it('should update last added period with specified close time when addEndTimeToLastAddedPeriod called', function () {
      Period.create({ startTime, noOfUnavailableAttendees })
      Period.addEndTimeToLastAddedPeriod({ endTime })

      expect(Period.all()[0].endTime).equals(endTime)
    })
  })
})


module.exports = () => {
  const periods = []

  return class Period {
    constructor({ startTime, endTime, noOfUnavailableAttendees }) {
      this.startTime = startTime
      this.endTime = endTime
      this.noOfUnavailableAttendees = noOfUnavailableAttendees
    }

    static create(periodData) {
      const period = new Period(periodData)
      periods.push(period)
      return period
    }

    static updatePeriod(periodData) {
      const periodIndex = Period.findPeriodIndex(periodData.startTime)
      periods[periodIndex] = periodData
      return periods[periodIndex]
    }

    static createOrUpdateIfExists(periodData) {
      try {
        return Period.updatePeriod(periodData)
      } catch (error) {
        return Period.create(periodData)
      }
    }

    static findPeriodIndex(startTime) {
      const index = periods.findIndex(period => period.startTime === startTime)
      if (index > -1) {
        return index
      }
      throw new Error('Period not found in periods')
    }

    static all() {
      return periods
    }

    static findAvailableMeetingTime({ meetingDuration }) {
      for (const period of Period.all()) {
        if (period.isTimeSuitable({ meetingDuration })) {
          return period.startTime
        }
      }
      return null
    }

    durationInMins() {
      const duration = this.endTime.valueOf() - this.startTime.valueOf()
      return duration / 1000 / 60
    }

    isTimeSuitable({ meetingDuration }) {
      const available = this.noOfUnavailableAttendees === 0
      const periodLongEnough = this.durationInMins() >= meetingDuration
      return available && periodLongEnough
    }
  }
}

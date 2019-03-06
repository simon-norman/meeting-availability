
module.exports = () => {
  const periods = []

  return class Period {
    static createOrUpdateIfExists(periodData) {
      try {
        return Period.updatePeriod(periodData)
      } catch (error) {
        return Period.create(periodData)
      }
    }

    static updatePeriod(periodData) {
      const periodIndex = Period.findPeriodIndex(periodData.startTime)
      periods[periodIndex] = periodData
      return periods[periodIndex]
    }

    static findPeriodIndex(startTime) {
      const index = periods.findIndex(period => period.startTime === startTime)
      if (index > -1) {
        return index
      }
      throw new Error('Period not found in periods')
    }


    static create(periodData) {
      const period = new Period(periodData)
      periods.push(period)
      return period
    }

    static all() {
      return periods
    }

    static addEndTimeToLastAddedPeriod({ endTime }) {
      if (periods[periods.length - 1]) {
        periods[periods.length - 1].endTime = endTime
      }
    }

    static findAvailablePeriodTime({ duration }) {
      for (const period of Period.all()) {
        if (period.isTimeSuitable({ duration })) {
          return period.startTime
        }
      }
      return null
    }

    constructor({ startTime, endTime, noOfUnavailableAttendees }) {
      this.startTime = startTime
      this.endTime = endTime
      this.noOfUnavailableAttendees = noOfUnavailableAttendees
    }

    durationInMins() {
      const duration = this.endTime.valueOf() - this.startTime.valueOf()
      return duration / 1000 / 60
    }

    isTimeSuitable({ duration }) {
      const available = this.noOfUnavailableAttendees === 0
      const periodLongEnough = this.durationInMins() >= duration
      return available && periodLongEnough
    }
  }
}

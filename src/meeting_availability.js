const Moment = require('moment')

let schedules
let scheduleDate

const isAvailable = (time) => {
  for (const schedule of schedules) {
    for (const appointment of schedule) {
      const appointmentStart = scheduleDate + appointment[0]
      const appointmentEnd = scheduleDate + appointment[1]
      if (
        time.isSameOrAfter(new Moment(appointmentStart)) &&
        time.isBefore(new Moment(appointmentEnd))
      ) {
        return false
      }
    }
  }

  return true
}

function meetingAvailability(attendeeSchedules, meetingTime) {
  schedules = attendeeSchedules
  scheduleDate = '2000-01-01 '

  const dayStartTime = new Moment(`${scheduleDate}09:00`)
  const dayEndTime = new Moment(`${scheduleDate}19:00`)

  const availabilityByPeriod = []
  let periodIndex = 0
  availabilityByPeriod[periodIndex] = {
    startTime: dayStartTime.clone(),
    isAvailable: isAvailable(dayStartTime.clone()),
  }
  // set start time and availability of first one
  for (
    let time = dayStartTime.clone();
    time.isBefore(dayEndTime);
    time.add(1, 'minutes')) {
    const isThisMinAvail = availabilityByPeriod[periodIndex].isAvailable
    const nextMinTime = time.clone().add(1, 'minutes')
    const isNextMinAvail = isAvailable(nextMinTime)

    if (isThisMinAvail !== isNextMinAvail) {
      const prevPeriodStart = availabilityByPeriod[periodIndex].startTime
      const prevPeriodDuration = Moment.duration(nextMinTime.diff(prevPeriodStart)).asMinutes()
      availabilityByPeriod[periodIndex].duration = prevPeriodDuration

      periodIndex += 1

      availabilityByPeriod[periodIndex] = {
        startTime: nextMinTime,
        isAvailable: isNextMinAvail,
      }
    }
  }
  const finalPeriod = availabilityByPeriod.slice(-1)[0]
  const prevPeriodDuration = Moment.duration(dayEndTime.diff(finalPeriod.startTime)).asMinutes()
  finalPeriod.duration = prevPeriodDuration


  const suitableMeetingPeriod = availabilityByPeriod.find((period) => {
    return period.duration >= meetingTime && period.isAvailable
  })

  return suitableMeetingPeriod.startTime.format('hh:mm')
}

module.exports = meetingAvailability

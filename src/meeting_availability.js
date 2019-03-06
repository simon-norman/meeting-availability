const Moment = require('moment')

const scheduleDate = '2000-01-01 '

function meetingAvailability(attendeeSchedules, meetingTime) {
  const arrayOfAppointments = []
  attendeeSchedules.forEach((schedule) => {
    schedule.forEach((appointment) => {
      arrayOfAppointments.push({
        time: new Date(`${scheduleDate}${appointment[0]}`),
        isStartTime: true,
      })

      arrayOfAppointments.push({
        time: new Date(`${scheduleDate}${appointment[1]}`),
        isStartTime: false,
      })
    })
  })

  arrayOfAppointments.sort((a, b) => a.time.valueOf() - b.time.valueOf())


  const dayStartTime = new Date(`${scheduleDate}09:00`)
  const dayEndTime = new Date(`${scheduleDate}19:00`)

  const availabilityByPeriod = new Map()
  let countOfMeetings = 0
  availabilityByPeriod[dayStartTime] = {
    countOfMeetings,
  }

  arrayOfAppointments.forEach((appointment) => {
    let changeToMeetingCount

    if (appointment.isStartTime) {
      countOfMeetings += 1
    } else {
      countOfMeetings -= 1
    }

    availabilityByPeriod.set(appointment.time, { countOfMeetings })
  })

  let suitableMeetingTime
  let previousPeriod = dayStartTime

  for (const [period, availability] of availabilityByPeriod) {
    const periodDuration = period.valueOf() - previousPeriod.valueOf()
    if (periodDuration >= meetingTime && availability.countOfMeetings <= 0) {
      suitableMeetingTime = period
      break
    }
    previousPeriod = period
  }
  
  return Moment(suitableMeetingTime).format('hh:mm')
}

module.exports = meetingAvailability

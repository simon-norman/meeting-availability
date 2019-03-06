const Moment = require('moment')
const PeriodFactory = require('./period')

let appointments
let noOfUnavailableAttendees
let Period

const scheduleDate = '2000-01-01 '
const dayStartTime = new Date(`${scheduleDate}09:00`)
const dayEndTime = new Date(`${scheduleDate}19:00`)

const newAppointment = (isStartTime, time) => ({
  time: new Date(`${scheduleDate}${time}`),
  isStartTime,
})

const extractAppointmentsFromScheduleToArray = (schedule) => {
  schedule.forEach(([startTime, endTime]) => {
    appointments.push(newAppointment(true, startTime))

    appointments.push(newAppointment(false, endTime))
  })
}

const sortAppointmentsByTimeAscending = () => {
  appointments.sort((a, b) => a.time.valueOf() - b.time.valueOf())
}

const setAvailabilityForPeriod = (appointment) => {
  if (appointment.isStartTime) {
    noOfUnavailableAttendees += 1
  } else {
    noOfUnavailableAttendees -= 1
  }

  return Period.createOrUpdateIfExists({ startTime: appointment.time, noOfUnavailableAttendees })
}

const calcAvailabilityByPeriod = () => {
  noOfUnavailableAttendees = 0
  let prevPeriod
  if (appointments[0].time > dayStartTime) {
    prevPeriod = Period.createOrUpdateIfExists({ startTime: dayStartTime, noOfUnavailableAttendees })
  }
  appointments.forEach((appointment) => {
    const newPeriod = setAvailabilityForPeriod(appointment)

    if (prevPeriod) {
      prevPeriod.endTime = newPeriod.startTime
      Period.updatePeriod(prevPeriod)
    }
    prevPeriod = newPeriod
  })

  prevPeriod.endTime = dayEndTime
  Period.updatePeriod(prevPeriod)
}

function meetingAvailability(attendeeSchedules, meetingDuration) {
  Period = PeriodFactory()
  appointments = []
  attendeeSchedules.forEach((schedule) => {
    extractAppointmentsFromScheduleToArray(schedule)
  })

  sortAppointmentsByTimeAscending()

  calcAvailabilityByPeriod()

  const suitableMeetingTime = Period.findAvailableMeetingTime({ meetingDuration })

  return Moment(suitableMeetingTime).format('hh:mm')
}

module.exports = meetingAvailability

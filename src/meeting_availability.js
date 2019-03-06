const Moment = require('moment')

let appointments
let noOfUnavailableAttendees
let availabilityByPeriod

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

  availabilityByPeriod.set(appointment.time, { noOfUnavailableAttendees })
}

const setEndTimeForPrevPeriod = (endTime, prevPeriod) => {
  const availability = availabilityByPeriod.get(prevPeriod)
  availability.endTime = endTime
  availabilityByPeriod.set(prevPeriod, availability)
}

const calcAvailabilityByPeriod = () => {
  availabilityByPeriod = new Map()
  noOfUnavailableAttendees = 0
  availabilityByPeriod.set(dayStartTime, { noOfUnavailableAttendees })
  let prevPeriod = dayStartTime

  appointments.forEach((appointment) => {
    setAvailabilityForPeriod(appointment)

    setEndTimeForPrevPeriod(appointment.time, prevPeriod)
    prevPeriod = appointment.time
  })

  setEndTimeForPrevPeriod(dayEndTime, prevPeriod)
}

const periodDurationInSecs = (period, endTime) => {
  const duration = endTime.valueOf() - period.valueOf()
  return duration / 1000 / 60
}

const isTimeSuitable = (periodDuration, meetingTime, availability) =>
  periodDuration >= meetingTime && availability.noOfUnavailableAttendees <= 0

const findSuitableMeetingTime = (meetingTime) => {
  let suitableMeetingTime

  for (const [period, availability] of availabilityByPeriod) {
    const periodDuration = periodDurationInSecs(period, availability.endTime)

    if (isTimeSuitable(periodDuration, meetingTime, availability)) {
      suitableMeetingTime = period
      break
    }
  }

  return suitableMeetingTime
}

function meetingAvailability(attendeeSchedules, meetingTime) {
  appointments = []
  attendeeSchedules.forEach((schedule) => {
    extractAppointmentsFromScheduleToArray(schedule)
  })

  sortAppointmentsByTimeAscending()

  calcAvailabilityByPeriod()

  const suitableMeetingTime = findSuitableMeetingTime(meetingTime)

  return Moment(suitableMeetingTime).format('hh:mm')
}

module.exports = meetingAvailability

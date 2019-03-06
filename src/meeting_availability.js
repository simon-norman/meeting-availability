const Moment = require('moment')
const PeriodClassFactory = require('./period')

let appointments
let noOfUnavailableAttendees
let Period

const scheduleDate = '2000-01-01 '
const dayStartTime = new Date(`${scheduleDate}09:00`)
const dayEndTime = new Date(`${scheduleDate}19:00`)

const newAppointment = (modifierToAvailableAttendees, time) => ({
  time: new Date(`${scheduleDate}${time}`),
  modifierToAvailableAttendees,
})

const extractAppointmentsFrom = (schedule) => {
  schedule.forEach(([startTime, endTime]) => {
    appointments.push(newAppointment(-1, startTime))

    appointments.push(newAppointment(1, endTime))
  })
}

const sortAppointmentsByTimeAscending = () => {
  appointments.sort((a, b) => a.time.valueOf() - b.time.valueOf())
}

const createAvailablePeriodDayStartIfNoAppointmentsThen = () => {
  if (appointments[0].time > dayStartTime) {
    Period.create({ startTime: dayStartTime, noOfUnavailableAttendees })
  }
}

const updatePeriodAvailabilityFrom = (appointment) => {
  Period.addEndTimeToLastAddedPeriod({ endTime: appointment.time })

  noOfUnavailableAttendees += appointment.modifierToAvailableAttendees

  Period.createOrUpdateIfExists({
    startTime: appointment.time,
    noOfUnavailableAttendees,
  })
}

const generatePeriodAvailabilityFromAppointments = () => {
  noOfUnavailableAttendees = 0

  Period = PeriodClassFactory()
  createAvailablePeriodDayStartIfNoAppointmentsThen()

  appointments.forEach((appointment) => {
    updatePeriodAvailabilityFrom(appointment)
  })

  Period.addEndTimeToLastAddedPeriod({ endTime: dayEndTime })
}

function meetingAvailability(attendeeSchedules, meetingDuration) {
  appointments = []
  attendeeSchedules.forEach((schedule) => {
    extractAppointmentsFrom(schedule)
  })

  sortAppointmentsByTimeAscending()

  generatePeriodAvailabilityFromAppointments()

  const suitableMeetingTime = Period.findAvailablePeriodTime({ duration: meetingDuration })

  return Moment(suitableMeetingTime).format('hh:mm')
}

module.exports = meetingAvailability

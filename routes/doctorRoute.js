import express from 'express'
import { appointmentCancel, appointmentComplete, appointmentsDoctor, doctorDashboard, doctorList, getDoctorProfile, loginDoctor, updateDoctorProfile } from '../controllers/doctorController.js'
import doctorAuth from '../middlewares/doctorAuth.js'


const doctorRouter = express.Router()

doctorRouter.get('/list',doctorList)
doctorRouter.post('/login-doctor',loginDoctor)
doctorRouter.get('/doctorAppointments',doctorAuth,appointmentsDoctor)
doctorRouter.post('/complete-appointment',doctorAuth,appointmentComplete)
doctorRouter.post('/cancel-appointment',doctorAuth,appointmentCancel)
doctorRouter.get('/doctorDashboard',doctorAuth,doctorDashboard)
doctorRouter.get('/profile',doctorAuth,getDoctorProfile)
doctorRouter.post('/update-profile',doctorAuth,updateDoctorProfile)

export default doctorRouter
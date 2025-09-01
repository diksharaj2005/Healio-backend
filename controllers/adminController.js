import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
// API for adding doctor

const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    //   console.log("Body fields:", {
    //    name,
    //    email,
    //    password,
    //    speciality,
    //    degree,
    //    experience,
    //    about,
    //    fees,
    //    address,
    //  });
    //  console.log("Uploaded file:", imageFile);

    // checking for all data to add Doctor
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }

    // validating email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // validating the strong password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // hashing doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageURL = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      image: imageURL,
      password: hashedPassword,
      speciality,
      fees,
      degree,
      experience,
      about,
      address: JSON.parse(address),
      date: Date.now(),


    };

    const newDoctor = new doctorModel(doctorData)
    await newDoctor.save()

    res.json({success:true,message:"Doctor Added"})
  } catch (error) {
    console.error(error);
    res.json({success:false,message:error.message})
  }
};

// API FOR THE ADMINLOGIN
const loginadmin = async(req,res)=>{
  try {

    const {email,password}= req.body
    if (email===process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email+password,process.env.JWT_SECRET)
      res.json({success:true,token})

    }else{
      res.json({success:false,message:"Invalid Credentials"})
    }
  } catch (error) {
     console.error(error);
    res.json({success:false,message:error.message})
  }

}

// API TOGET ALL DOCTORS LIST FOR ADMIN PANEL
const allDoctors = async(req,res)=>{
  try {
    const doctors = await doctorModel.find({}).select('-password')
    res.json({success:true,doctors})
  } catch (error) {
    console.error(error);
    res.json({success:false,message:error.message})
  }

}

// api to get all apointments list 
const appointmentAdmin = async(req,res)=>{
  try {
    const appointments = await appointmentModel.find({})
    res.json({success:true,appointments})
    
  } catch (error) {
     console.error(error);
    res.json({success:false,message:error.message})
  }
}


// cancel appointment by admin

const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // Release doctor's slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);

    if (doctorData && doctorData.slots_booked[slotDate]) {
      doctorData.slots_booked[slotDate] = doctorData.slots_booked[slotDate].filter(
        (e) => e !== slotTime
      );
      await doctorModel.findByIdAndUpdate(docId, {
        slots_booked: doctorData.slots_booked,
      });
    }


    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


// api to get dashboard data for admin panel
const adminDashboard = async(req,res)=>{
try {

  const doctors = await doctorModel.find({})
  const users = await userModel.find({})
  const appointments = await appointmentModel.find({})

  const dashData = {
    doctors:doctors.length,
    appointments:appointments.length,
    patients:users.length,
    latestAppointments:appointments.reverse().slice(0,5)
  }
  res.json({success:true,dashData})
  
} catch (error) {
  console.error(error);
    res.json({ success: false, message: error.message });
}
}

export { addDoctor,loginadmin,allDoctors ,appointmentAdmin ,appointmentCancel,adminDashboard};

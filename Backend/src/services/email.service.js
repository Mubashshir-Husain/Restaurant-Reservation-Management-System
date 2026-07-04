import nodemailer from 'nodemailer';
import Reservation from '../Models/Reservation.js';
import User from '../Models/user.js';
import { RESERVATION_STATUS } from '../Config/constants.js';

let transporter;

// Initialize Transporter
const getTransporter = async () => {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log('Email Configured custom SMTP transport.');
  } else {
    // Ethereal Fallback for local testing
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('Email Configured fallback Ethereal SMTP transport.');
      console.log(`Email Ethereal Credentials: User=${testAccount.user}, Pass=${testAccount.pass}`);
    } catch (err) {
      console.error('Email Failed to configure Ethereal transport:', err.message);
    }
  }
  return transporter;
};

// Send Confirmation Email
export const sendBookingConfirmation = async (userEmail, userName, resDetails) => {
  const mailTransporter = await getTransporter();
  if (!mailTransporter) return;

  const mailOptions = {
    from: process.env.SMTP_FROM || '"BistroReserve" <no-reply@bistroreserve.com>',
    to: userEmail,
    subject: 'Reservation Confirmed - BistroReserve',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #059669; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Booking Confirmed!</h2>
        <p>Dear <strong>${userName}</strong>,</p>
        <p>Your table reservation at <strong>BistroReserve</strong> was successful. Here are your booking details:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 15px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Date:</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${resDetails.date}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Time Slot:</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${resDetails.timeSlot}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Guests:</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${resDetails.guests} Guests</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Table Label:</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Table ${resDetails.table?.label || 'Auto-Assigned'}</td>
          </tr>
        </table>
        <p>We look forward to serving you. If you need to make changes or cancel your booking, please log into your BistroReserve dashboard.</p>
        <p style="color: #64748b; font-size: 11px; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 10px;">
          BistroReserve Restaurant • 124 Gastronomy Way, Sector 5, New Delhi
        </p>
      </div>
    `,
  };

  try {
    const info = await mailTransporter.sendMail(mailOptions);
    console.log(`[Email] Confirmation sent to ${userEmail}. Message ID: ${info.messageId}`);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[Email] Ethereal mail preview link: ${previewUrl}`);
    }
  } catch (err) {
    console.error('[Email] Error sending confirmation email:', err.message);
  }
};

// Send 24-Hour Reminder Email
export const send24HourReminder = async (userEmail, userName, resDetails) => {
  const mailTransporter = await getTransporter();
  if (!mailTransporter) return;

  const mailOptions = {
    from: process.env.SMTP_FROM || '"BistroReserve" <no-reply@bistroreserve.com>',
    to: userEmail,
    subject: 'Dining Reminder: Your Booking Tomorrow at BistroReserve',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #d97706; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Upcoming Dining Reminder</h2>
        <p>Dear <strong>${userName}</strong>,</p>
        <p>This is a friendly reminder that you have an upcoming reservation tomorrow at <strong>BistroReserve</strong>. We are preparing for your arrival!</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 15px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Date:</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${resDetails.date}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Time Slot:</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${resDetails.timeSlot}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Guests:</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${resDetails.guests} Guests</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Table Label:</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Table ${resDetails.table?.label || 'Auto-Assigned'}</td>
          </tr>
        </table>
        <p>If you cannot make it, please cancel your booking at least 2 hours before your slot to allow other guests to reserve the table.</p>
        <p>See you tomorrow!</p>
        <p style="color: #64748b; font-size: 11px; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 10px;">
          BistroReserve Restaurant • 124 Gastronomy Way, Sector 5, New Delhi
        </p>
      </div>
    `,
  };

  try {
    const info = await mailTransporter.sendMail(mailOptions);
    console.log(`[Email] 24-hour reminder sent to ${userEmail}. Message ID: ${info.messageId}`);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[Email] Ethereal mail preview link: ${previewUrl}`);
    }
  } catch (err) {
    console.error('[Email] Error sending reminder email:', err.message);
  }
};

// Periodic Check Task (runs check and sends mail)
export const checkAndSendReminders = async () => {
  try {
    const now = new Date();
    // 24 hours in milliseconds
    const oneDayMs = 24 * 60 * 60 * 1000;

    // Find confirmed reservations that have not sent reminders yet
    const pendingReservations = await Reservation.find({
      status: RESERVATION_STATUS.CONFIRMED,
      reminderSent: false,
    }).populate('user').populate('table');

    for (const res of pendingReservations) {
      if (!res.user || !res.user.email) continue;

      const [hours, minutes] = res.timeSlot.split(':');
      const resDateTime = new Date(`${res.date}T${hours}:${minutes}:00`);

      const timeDiff = resDateTime.getTime() - now.getTime();

      // If reservation is in the future AND is within 24 hours
      if (timeDiff > 0 && timeDiff <= oneDayMs) {
        await send24HourReminder(res.user.email, res.user.name, res);
        res.reminderSent = true;
        await res.save();
      } else if (timeDiff < 0) {
        // If reservation date is in the past, just mark reminderSent = true to exclude it in next scans
        res.reminderSent = true;
        await res.save();
      }
    }
  } catch (err) {
    console.error('[Email Scheduler] Error scanning reminders:', err.message);
  }
};

// Initialize Scheduler Interval
export const startEmailScheduler = (intervalMinutes = 5) => {
  console.log(`[Email Scheduler] Started scanner job (interval: ${intervalMinutes} mins).`);
  // Run immediately on start
  checkAndSendReminders();
  // Set interval
  setInterval(checkAndSendReminders, intervalMinutes * 60 * 1000);
};

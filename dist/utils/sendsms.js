import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
export const sendOtpSms = async (to, otp) => {
    try {
        const response = await axios.post(process.env.TERMII_BASE_URL, {
            api_key: process.env.TERMII_API_KEY,
            to,
            from: process.env.TERMII_SENDER_ID,
            sms: `Your Alabamarket verification OTP is: ${otp}`,
            type: 'plain',
            channel: 'generic'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(`OTP sent to ${to}:`, response.data);
    }
    catch (error) {
        console.error('Error sending SMS via Termii:', error.response?.data || error);
        throw new Error('SMS sending failed');
    }
};

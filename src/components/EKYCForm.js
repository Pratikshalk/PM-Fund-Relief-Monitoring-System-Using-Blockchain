import React, { useState, useEffect } from 'react';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { db } from '../firebase';

const EKYCForm = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null);

    const auth = getAuth();

    useEffect(() => {
        // ✅ Initialize reCAPTCHA only once
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible',
                callback: (response) => {
                    console.log("reCAPTCHA Verified:", response);
                },
                'expired-callback': () => {
                    console.log("reCAPTCHA expired. Please refresh.");
                }
            });
            window.recaptchaVerifier.render();
        }
    }, [auth]);

    // ✅ Function to send OTP
    const sendOTP = async () => {
        if (!phoneNumber.startsWith('+')) {
            setMessage("Phone number must be in international format (e.g., +91XXXXXXXXXX)");
            return;
        }

        setLoading(true);
        try {
            const appVerifier = window.recaptchaVerifier;
            const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            setConfirmationResult(result);
            setMessage("OTP sent successfully!");
        } catch (error) {
            console.error("Error sending OTP:", error.message);
            setMessage("Failed to send OTP. Try again.");
        }
        setLoading(false);
    };

    // ✅ Function to verify OTP
    const verifyOTP = async () => {
        if (!confirmationResult) {
            setMessage("Please request OTP first.");
            return;
        }

        setLoading(true);
        try {
            const credential = await confirmationResult.confirm(otp);
            const walletAddress = localStorage.getItem('walletAddress');

            // ✅ Save verification status in Firestore
            await db.collection('users').doc(walletAddress).set({
                phoneNumber: phoneNumber,
                otpVerified: true
            }, { merge: true });

            setMessage("Phone number verified successfully!");
        } catch (error) {
            console.error("Error verifying OTP:", error.message);
            setMessage("Invalid OTP. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div>
            <h2>Complete eKYC Verification</h2>
            <div>
                <label>Phone Number:</label>
                <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91XXXXXXXXXX"
                    required
                />
                <button onClick={sendOTP} disabled={loading}>
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
            </div>
            <div>
                <label>OTP:</label>
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />
                <button onClick={verifyOTP} disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify eKYC'}
                </button>
            </div>
            <div id="recaptcha-container"></div> {/* ✅ Required for reCAPTCHA */}
            {message && <p>{message}</p>}
        </div>
    );
};

export default EKYCForm;

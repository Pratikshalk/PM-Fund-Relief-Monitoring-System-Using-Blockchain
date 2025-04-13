import React, { useState, useEffect } from "react";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase"; // ✅ Import Firebase auth

function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    // ✅ Ensure reCAPTCHA is loaded once
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible", // ✅ Makes reCAPTCHA invisible for better UX
        callback: (response) => {
          console.log("reCAPTCHA verified:", response);
        },
        "expired-callback": () => {
          console.log("reCAPTCHA expired. Refresh the page.");
        },
      });
      window.recaptchaVerifier.render();
    }
  }, []);

  const sendOTP = () => {
    if (!phone.startsWith("+")) {
      alert("Phone number must be in international format (e.g., +91XXXXXXXXXX)");
      return;
    }

    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phone, appVerifier)
      .then((result) => {
        setConfirmationResult(result);
        alert(`OTP sent to ${phone}`);
      })
      .catch((error) => {
        console.error("OTP send error:", error);
        alert("Failed to send OTP. Check console for details.");
      });
  };

  const verifyOTP = () => {
    if (!confirmationResult) {
      alert("Please request OTP first!");
      return;
    }

    confirmationResult
      .confirm(otp)
      .then((result) => {
        console.log("User verified:", result.user);
        alert("Phone number verified successfully!");
      })
      .catch((error) => {
        console.error("Verification failed:", error);
        alert("Invalid OTP. Try again.");
      });
  };

  return (
    <div>
      <h2>Phone Number Login</h2>
      <input
        type="text"
        placeholder="Enter phone number (e.g., +91XXXXXXXXXX)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={sendOTP}>Send OTP</button>

      <div id="recaptcha-container"></div> {/* ✅ reCAPTCHA is required for real OTP */}

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={verifyOTP}>Verify OTP</button>
    </div>
  );
}

export default LoginPage;

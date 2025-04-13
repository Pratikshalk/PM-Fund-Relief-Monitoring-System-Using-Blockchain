
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { db } from "../beneficiary_firebase";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../assets/beneficiary_form.css';
import { fetchBankDetails } from '../utils/bankAPI';
import { validateIFSC } from '../utils/validation';

const BeneficiaryForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", fullName: "",
        email: "", phone: "", isEmailVerified: false, isPhoneVerified: false,
        ifscCode: "", bankName: "", branchName: "", accountNumber: "",
        aadharNumber: "", areaCity: "", address: "",
        aadharFileUrl: "", billFileUrl: "", incidentFileUrl: "",
        currentLocation: { lat: null, lng: null },
        //new
        walletAddress: ""
    });

    const [activeSection, setActiveSection] = useState("personal");
    const [loading, setLoading] = useState(false);
    const [locationError, setLocationError] = useState(null);
    const [bankDetailsLoading, setBankDetailsLoading] = useState(false);
    const [termsAgreed, setTermsAgreed] = useState(false);

    // Handler functions
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!termsAgreed) {
            toast.error("Please agree to the terms before submitting");
            return;
        }

        if (!formData.aadharFileUrl || !formData.billFileUrl || !formData.incidentFileUrl) {
            toast.error("Please upload all required documents before submitting!");
            return;
        }

        try {
            setLoading(true);
            await addDoc(collection(db, "beneficiaries"), {
                ...formData,
                walletAddress: formData.walletAddress.toLowerCase(), // Store in consistent format
                timestamp: new Date()
            });
            toast.success("Form submitted successfully!");
            // Reset form
            setFormData({
                firstName: "", lastName: "", fullName: "",
                email: "", phone: "", isEmailVerified: false, isPhoneVerified: false,
                ifscCode: "", bankName: "", branchName: "", accountNumber: "",
                aadharNumber: "", areaCity: "", address: "",
                aadharFileUrl: "", billFileUrl: "", incidentFileUrl: "",
                currentLocation: { lat: null, lng: null }
            });
            setTermsAgreed(false);
        } catch (error) {
            console.error("Error:", error);
            toast.error("Submission failed! Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const verifyContact = (type) => {
        toast.info(`Verification code sent to your ${type}`);
        setFormData(prev => ({
            ...prev,
            [`is${type.charAt(0).toUpperCase() + type.slice(1)}Verified`]: true
        }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const fieldName = e.target.name + "Url";

        if (file) {
            const fileType = e.target.name.includes("aadhar") ? "aadhar" : "image";
            if (!validateFile(file, fileType)) return;

            const uploadedUrl = await uploadToPinata(file);
            if (uploadedUrl) {
                setFormData(prev => ({
                    ...prev,
                    [fieldName]: uploadedUrl
                }));
                toast.success(`${file.name} uploaded successfully!`);
            }
        }
    };

    const validateFile = (file, type) => {
        const MAX_AADHAR_SIZE = 5 * 1024 * 1024;
        const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
        
        if (type === 'aadhar') {
            if (file.type !== "application/pdf") {
                toast.error("Aadhaar card must be in PDF format");
                return false;
            }
            if (file.size > MAX_AADHAR_SIZE) {
                toast.error("Aadhaar card PDF must be less than 5MB");
                return false;
            }
        } else {
            const validTypes = ["image/jpeg", "image/png", "image/jpg"];
            if (!validTypes.includes(file.type)) {
                toast.error("Bill/Incident photo must be JPG, PNG, or JPEG");
                return false;
            }
            if (file.size > MAX_IMAGE_SIZE) {
                toast.error("Bill/Incident photo must be less than 2MB");
                return false;
            }
        }
        return true;
    };


    const uploadToPinata = async (file) => {
        if (!file) return null;
        setLoading(true);
        const data = new FormData();
        data.append("file", file);
        data.append("pinataMetadata", JSON.stringify({ name: file.name }));
        data.append("pinataOptions", JSON.stringify({ cidVersion: 0 }));

        try {
            const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
                    pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY
                }
            });
            return response.data.IpfsHash ? `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}` : null;
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload file");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        currentLocation: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    }));
                    toast.success("Location captured successfully!");
                },
                (error) => {
                    setLocationError("Unable to retrieve your location");
                    console.error("Geolocation error:", error);
                }
            );
        } else {
            setLocationError("Geolocation not supported");
        }
    };

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ 
                    method: "eth_requestAccounts" 
                });
                setFormData(prev => ({
                    ...prev,
                    walletAddress: accounts[0]
                }));
                toast.success("Wallet connected!");
            } catch (error) {
                toast.error("User rejected connection");
            }
        } else {
            toast.error(
                <span>
                    MetaMask not installed! 
                    <a href="https://metamask.io/download.html" target="_blank" style={{color:'white'}}>
                        Download here
                    </a>
                </span>
            );
        }
    };
    
    // Check if wallet is already connected on load
    useEffect(() => {
        if (window.ethereum?.selectedAddress) {
            setFormData(prev => ({
                ...prev,
                walletAddress: window.ethereum.selectedAddress
            }));
        }
    }, []);


    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            fullName: `${prev.firstName} ${prev.lastName}`.trim()
        }));
    }, [formData.firstName, formData.lastName]);

    // Then use it in your useEffect:
    // Update the bank details useEffect section (remove the duplicate fetchBankDetails function)
    useEffect(() => {
        const fetchBankInfo = async () => {
          if (!formData.ifscCode || !validateIFSC(formData.ifscCode)) {
            // Clear fields if IFSC becomes invalid
            setFormData(prev => ({
              ...prev,
              bankName: "",
              branchName: ""
            }));
            return;
          }
      
          try {
            setBankDetailsLoading(true);
            const { bank, branch, source } = await fetchBankDetails(formData.ifscCode);
            console.log(`Fetched from ${source}`);
            
            setFormData(prev => ({
              ...prev,
              bankName: bank,
              branchName: branch
            }));
          } catch (error) {
            console.error("Bank details error:", error);
            toast.error("Couldn't verify IFSC automatically. Please enter bank details manually.");
            setFormData(prev => ({
              ...prev,
              bankName: "",
              branchName: ""
            }));
          } finally {
            setBankDetailsLoading(false);
          }
        };
      
        // 1 second debounce
        const timer = setTimeout(fetchBankInfo, 1000);
        return () => clearTimeout(timer);
      }, [formData.ifscCode]);
// Remove the duplicate fetchBankDetails function from your component
// Since you're importing it from '../utils/bankAPI'
    //new 
    useEffect(() => {
        document.body.classList.add('beneficiary-page');
        return () => document.body.classList.remove('beneficiary-page');
    }, []); 

    return (
        <div className="modern-form-container">
            <div className="form-header">
                <h1>Beneficiary Registration</h1>
                <div className="progress-steps">
                    <div 
                        className={`step ${activeSection === "personal" ? "active" : ""}`}
                        onClick={() => setActiveSection("personal")}
                    >
                        <span>1</span> Personal
                    </div>
                    <div 
                        className={`step ${activeSection === "address" ? "active" : ""}`}
                        onClick={() => setActiveSection("address")}
                    >
                        <span>2</span> Address
                    </div>
                    <div 
                        className={`step ${activeSection === "bank" ? "active" : ""}`}
                        onClick={() => setActiveSection("bank")}
                    >
                        <span>3</span> Bank
                    </div>
                    <div 
                        className={`step ${activeSection === "documents" ? "active" : ""}`}
                        onClick={() => setActiveSection("documents")}
                    >
                        <span>4</span> Documents
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Personal Information Section */}
                {activeSection === "personal" && (
                    <div className="form-section personal-info">
                        <h2 className="section-title">
                            <i className="icon-user"></i> Personal Information
                        </h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>First Name</label>
                                <input 
                                    type="text" 
                                    name="firstName" 
                                    value={formData.firstName} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input 
                                    type="text" 
                                    name="lastName" 
                                    value={formData.lastName} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input 
                                    type="text" 
                                    value={`${formData.firstName} ${formData.lastName}`.trim()} 
                                    readOnly 
                                    className="read-only"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <div className="input-with-action">
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        className={`verify-btn ${formData.isEmailVerified ? "verified" : ""}`}
                                        onClick={() => verifyContact("email")}
                                        disabled={formData.isEmailVerified}
                                    >
                                        {formData.isEmailVerified ? '✓ Verified' : 'Verify'}
                                    </button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <div className="input-with-action">
                                    <input 
                                        type="tel" 
                                        name="phone" 
                                        value={formData.phone} 
                                        onChange={handleChange} 
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        className={`verify-btn ${formData.isPhoneVerified ? "verified" : ""}`}
                                        onClick={() => verifyContact("phone")}
                                        disabled={formData.isPhoneVerified}
                                    >
                                        {formData.isPhoneVerified ? '✓ Verified' : 'Verify'}
                                    </button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Aadhaar Number</label>
                                <input 
                                    type="text" 
                                    name="aadharNumber" 
                                    value={formData.aadharNumber} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                        </div>
                        <div className="section-navigation">
                            <button 
                                type="button" 
                                className="next-btn"
                                onClick={() => setActiveSection("address")}
                            >
                                Next: Address Information →
                            </button>
                        </div>
                    </div>
                )}

                {/* Address Information Section */}
                {activeSection === "address" && (
                    <div className="form-section address-info">
                        <h2 className="section-title">
                            <i className="icon-location"></i> Address Information
                        </h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Area & City</label>
                                <input 
                                    type="text" 
                                    name="areaCity" 
                                    placeholder="Area name, City name"
                                    value={formData.areaCity} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                            <div className="form-group span-2">
                                <label>Full Address</label>
                                <textarea 
                                    name="address" 
                                    value={formData.address} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                            <div className="form-group location-group">
                                <button 
                                    type="button" 
                                    className="location-btn"
                                    onClick={handleUseCurrentLocation}
                                >
                                    <i className="icon-gps"></i> Use Current Location
                                </button>
                                {locationError && <span className="error-text">{locationError}</span>}
                                {formData.currentLocation.lat && (
                                    <div className="coordinates">
                                        Lat: {formData.currentLocation.lat.toFixed(4)}, 
                                        Lng: {formData.currentLocation.lng.toFixed(4)}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="section-navigation">
                            <button 
                                type="button" 
                                className="back-btn"
                                onClick={() => setActiveSection("personal")}
                            >
                                ← Back
                            </button>
                            <button 
                                type="button" 
                                className="next-btn"
                                onClick={() => setActiveSection("bank")}
                            >
                                Next: Bank Details →
                            </button>
                        </div>
                    </div>
                )}

                {/* Bank Details Section */}
                {activeSection === "bank" && (
                    <div className="form-section bank-info">
                        <h2 className="section-title">
                            <i className="icon-bank"></i> Bank Details
                        </h2>
                        <div className="form-grid">
                        <div className="form-group">
                            <label>IFSC Code</label>
                            <input
                                type="text"
                                name="ifscCode"
                                value={formData.ifscCode}
                                onChange={(e) => {
                                    const value = e.target.value.toUpperCase();
                                    if (value.length <= 11) {
                                        handleChange({
                                            target: {
                                                name: "ifscCode",
                                                value: value
                                            }
                                        });
                                    }
                                }}
                                placeholder="11-character IFSC code"
                                maxLength="11"
                                required
                            />
                            {formData.ifscCode.length === 11 && !validateIFSC(formData.ifscCode) && (
                                <span className="error-text">Invalid IFSC format</span>
                            )}
                            {bankDetailsLoading && (
                                <span className="loading-text">Fetching details...</span>
                            )}
                        </div>
                            <div className="form-group">
                                <label>Bank Name</label>
                                <input 
                                    type="text" 
                                    name="bankName" 
                                    value={formData.bankName} 
                                    readOnly
                                    className="read-only"
                                />
                            </div>
                            <div className="form-group">
                                <label>Branch Name</label>
                                <input 
                                    type="text" 
                                    name="branchName" 
                                    value={formData.branchName} 
                                    readOnly
                                    className="read-only"
                                />
                            </div>
                            <div className="form-group">
                                <label>Account Number</label>
                                <input 
                                    type="text" 
                                    name="accountNumber" 
                                    value={formData.accountNumber} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Wallet Address</label>
                                <div className="wallet-input-group">
                                    <input
                                        type="text"
                                        name="walletAddress"
                                        value={formData.walletAddress}
                                        placeholder="0x..."
                                        readOnly
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        className="connect-wallet-btn"
                                        onClick={connectWallet}
                                    >
                                        {formData.walletAddress ? '✓ Connected' : 'Connect Wallet'}
                                    </button>
                                </div>
                                {!formData.walletAddress && (
                                    <div className="wallet-help">
                                        <a href="https://metamask.io/download.html" target="_blank" rel="noopener">
                                            Don't have MetaMask? Install it first
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="section-navigation">
                            <button 
                                type="button" 
                                className="back-btn"
                                onClick={() => setActiveSection("address")}
                            >
                                ← Back
                            </button>
                            <button 
                                type="button" 
                                className="next-btn"
                                onClick={() => setActiveSection("documents")}
                            >
                                Next: Documents →
                            </button>
                        </div>

                    </div>
                )}

                {/* Documents Section */}
                {activeSection === "documents" && (
                    <div className="form-section documents-info">
                        <h2 className="section-title">
                            <i className="icon-docs"></i> Required Documents
                        </h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Aadhaar Card (PDF, max 5MB)</label>
                                <div className="file-upload-card">
                                    <input 
                                        type="file" 
                                        name="aadharFile" 
                                        accept=".pdf" 
                                        onChange={handleFileChange} 
                                        required
                                    />
                                    <div className="file-preview">
                                        {formData.aadharFileUrl ? (
                                            <>
                                                <i className="icon-pdf"></i>
                                                <span>Aadhaar.pdf</span>
                                                <a href={formData.aadharFileUrl} target="_blank" rel="noopener noreferrer">
                                                    View
                                                </a>
                                            </>
                                        ) : (
                                            <>
                                                <i className="icon-upload"></i>
                                                <span>Upload Aadhaar</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Light Bill (JPG/PNG, max 2MB)</label>
                                <div className="file-upload-card">
                                    <input 
                                        type="file" 
                                        name="billFile" 
                                        accept=".jpg,.jpeg,.png" 
                                        onChange={handleFileChange} 
                                        required
                                    />
                                    <div className="file-preview">
                                        {formData.billFileUrl ? (
                                            <>
                                                <i className="icon-image"></i>
                                                <span>BillProof.jpg</span>
                                                <a href={formData.billFileUrl} target="_blank" rel="noopener noreferrer">
                                                    View
                                                </a>
                                            </>
                                        ) : (
                                            <>
                                                <i className="icon-upload"></i>
                                                <span>Upload Bill</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Incident Photo (JPG/PNG, max 2MB)</label>
                                <div className="file-upload-card">
                                    <input 
                                        type="file" 
                                        name="incidentFile" 
                                        accept=".jpg,.jpeg,.png" 
                                        onChange={handleFileChange} 
                                        required
                                    />
                                    <div className="file-preview">
                                        {formData.incidentFileUrl ? (
                                            <>
                                                <i className="icon-image"></i>
                                                <span>Incident.jpg</span>
                                                <a href={formData.incidentFileUrl} target="_blank" rel="noopener noreferrer">
                                                    View
                                                </a>
                                            </>
                                        ) : (
                                            <>
                                                <i className="icon-upload"></i>
                                                <span>Upload Photo</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="terms-agreement">
                            <input 
                                type="checkbox" 
                                id="termsAgree" 
                                checked={termsAgreed}
                                onChange={() => setTermsAgreed(!termsAgreed)}
                                required
                            />
                            <label htmlFor="termsAgree">
                                I confirm all information is accurate and agree to the terms
                            </label>
                        </div>
                        <div className="section-navigation">
                            <button 
                                type="button" 
                                className="back-btn"
                                onClick={() => setActiveSection("bank")}
                            >
                                ← Back
                            </button>
                            <button 
                                type="submit" 
                                className="submit-btn"
                                disabled={loading || !termsAgreed}
                            >
                                {loading ? (
                                    <span className="loading-spinner"></span>
                                ) : (
                                    "Submit Application"
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default BeneficiaryForm;



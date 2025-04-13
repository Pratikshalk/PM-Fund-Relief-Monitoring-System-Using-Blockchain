export default function DocumentsSection({ formData, setFormData }) {
    const handleIPFSSubmit = async (file, field) => {
      // Your existing IPFS upload logic
      const ipfsHash = await uploadToIPFS(file);
      setFormData(prev => ({
        ...prev,
        [field]: ipfsHash
      }));
    };
  
    return (
      <div className="form-section">
        <h3>Document Verification</h3>
        
        <DocumentUpload
          label="Aadhaar Card"
          acceptedTypes=".pdf"
          onUpload={(file) => handleIPFSSubmit(file, 'aadhaarIPFS')}
          currentFile={formData.aadhaarIPFS}
        />
        
        <DocumentUpload
          label="Light Bill"
          acceptedTypes=".pdf,.jpg,.png"
          onUpload={(file) => handleIPFSSubmit(file, 'lightBillIPFS')}
          currentFile={formData.lightBillIPFS}
        />
        
        <DocumentUpload
          label="Incident Photos"
          acceptedTypes=".jpg,.png"
          onUpload={(file) => handleIPFSSubmit(file, 'incidentIPFS')}
          currentFile={formData.incidentIPFS}
        />
      </div>
    );
  }
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import '../assets/AdminDashboard.css';

const IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('beneficiaries');
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'beneficiaries'));
        setBeneficiaries(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching beneficiaries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBeneficiaries();
  }, []);

  const handleApprove = async (beneficiaryId) => {
    try {
      await updateDoc(doc(db, 'beneficiaries', beneficiaryId), {
        status: 'approved',
        approvedAt: new Date()
      });
      setBeneficiaries(beneficiaries.map(b => 
        b.id === beneficiaryId ? { ...b, status: 'approved' } : b
      ));
    } catch (error) {
      console.error("Error approving beneficiary:", error);
    }
  };

  const handleViewDocuments = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    
    // Get all document URLs (support both old single URL and new array format)
    const docs = beneficiary.documents || 
                 (beneficiary.aadharFileUrl ? [beneficiary.aadharFileUrl] : []);
    
    if (docs.length === 0) {
      alert('No documents available for this beneficiary');
      return;
    }

    // Open each document in new tab
    docs.forEach(document => {
      let url;
      if (document.startsWith('Qm') || document.startsWith('baf')) {
        // IPFS CID
        url = `https://ipfs.io/ipfs/${document}`;
      } else if (document.startsWith('http')) {
        // Regular URL
        url = document;
      } else {
        console.warn('Unknown document format:', document);
        return;
      }
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  };

  const closeModal = () => {
    setSelectedBeneficiary(null);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>PM CARES</h1>
      </div>

      <div className="dashboard-tabs-container">
        <div className="dashboard-tabs">
          <button 
            className={activeTab === 'beneficiaries' ? 'active' : ''}
            onClick={() => setActiveTab('beneficiaries')}
          >
            Beneficiary Verification
          </button>
          <button 
            className={activeTab === 'donations' ? 'active' : ''}
            onClick={() => setActiveTab('donations')}
          >
            Donation Monitoring
          </button>
          <button 
            className={activeTab === 'analytics' ? 'active' : ''}
            onClick={() => setActiveTab('analytics')}
          >
            System Analytics
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : activeTab === 'beneficiaries' ? (
          <div className="beneficiary-section">
            <h2>Beneficiary Verification ({beneficiaries.length})</h2>
            
            {beneficiaries.length === 0 ? (
              <p className="no-pending">No pending verifications</p>
            ) : (
              <div className="beneficiary-list">
                {beneficiaries.map(beneficiary => (
                  <div key={beneficiary.id} className="beneficiary-card">
                    <h3>{beneficiary.fullName}</h3>
                    <p><strong>Aadhaar:</strong> {beneficiary.aadharNumber}</p>
                    {beneficiary.status === 'approved' && (
                      <p className="approved-badge">✓ Approved</p>
                    )}
                    
                    <div className="beneficiary-actions">
                      {beneficiary.status !== 'approved' && (
                        <button 
                          className="approve-btn"
                          onClick={() => handleApprove(beneficiary.id)}
                        >
                          Approve
                        </button>
                      )}
                      <button 
                        className="view-docs-btn"
                        onClick={() => handleViewDocuments(beneficiary)}
                      >
                        View Documents
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'donations' ? (
          <div className="tab-content">
            <h2>Donation Monitoring</h2>
            <p className="coming-soon">Feature coming soon</p>
          </div>
        ) : (
          <div className="tab-content">
            <h2>System Analytics</h2>
            <p className="coming-soon">Feature coming soon</p>
          </div>
        )}
      </div>

      {/* Document Viewer Modal */}
      {selectedBeneficiary && (
        <div className="modal-overlay">
          <div className="document-modal">
            <button className="close-modal" onClick={closeModal}>×</button>
            <h3>{selectedBeneficiary.fullName}'s Documents</h3>
            <div className="document-list">
              {(selectedBeneficiary.documents || 
                (selectedBeneficiary.aadharFileUrl ? [selectedBeneficiary.aadharFileUrl] : [])
              ).map((doc, index) => (
                <div key={index} className="document-item">
                  <p>Document {index + 1}</p>
                  <button 
                    onClick={() => {
                      let url;
                      if (doc.startsWith('Qm') || doc.startsWith('baf')) {
                        url = `https://ipfs.io/ipfs/${doc}`;
                      } else {
                        url = doc;
                      }
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
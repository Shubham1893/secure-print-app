import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { printApi } from '../api/axios';

const PrintPage = () => {
  const { token } = useParams();
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState('Please enter the OTP provided by the customer.');
  const [error, setError] = useState('');
  const [printMessage, setPrintMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await axios.post('/api/print/verify-otp', { token, otp });
      localStorage.setItem('printSessionToken', data.sessionToken);
      setIsVerified(true);
      setMessage('Verification successful. Loading documents...');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed.');
      localStorage.removeItem('printSessionToken');
    }
  };
  
  const fetchPrintDocs = useCallback(async () => {
    try {
        const { data } = await printApi.get('/print/documents');
        setDocuments(data);
        setMessage('');
    } catch (err) {
        setError('Session expired or invalid. Please ask the customer for a new link and OTP.');
        setIsVerified(false);
        localStorage.removeItem('printSessionToken');
    }
  }, []);

  useEffect(() => {
    if (isVerified) {
      fetchPrintDocs();
    }
  }, [isVerified, fetchPrintDocs]);
  
  // RESTORED: This is the direct-to-print logic using a hidden iframe
  const handlePrint = async (docId, docName) => {
    setPrintMessage(`Preparing "${docName}" for printing...`);
    setError('');
    try {
      const response = await printApi.get(`/print/stream/${docId}`, {
        responseType: 'blob',
      });
      
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = fileURL;
      document.body.appendChild(iframe);
      
      iframe.onload = () => {
        setTimeout(() => {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          setPrintMessage(`"${docName}" has been sent to the print dialog.`);
          // Clean up the iframe after printing
          document.body.removeChild(iframe);
        }, 1);
      };
      
    } catch (err) {
      setError('Could not prepare the document for printing. The session may have expired.');
      setPrintMessage('');
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.originalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isVerified) {
    return (
        <div className="flex items-center justify-center mt-20">
          <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-center text-cyan-400">Secure Print Session</h1>
            <p className="text-center text-gray-300">{message}</p>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium">Enter 6-Digit OTP</label>
                <input type="text" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)} required className="w-full px-3 py-2 mt-1 text-center text-2xl tracking-widest font-mono text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
              <button type="submit" className="w-full py-2 px-4 font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition duration-300">Verify & Access Documents</button>
            </form>
          </div>
        </div>
    );
  }

  return (
     <div className="p-6 bg-gray-800 rounded-lg max-w-4xl mx-auto mt-10">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-cyan-400">Documents to Print</h1>
            <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
        </div>
        <p className="mb-4 text-yellow-400 bg-yellow-900/50 p-3 rounded">This session is temporary. Please print the required documents.</p>
        {error && <p className="text-red-500 text-center p-3 bg-red-900/50 rounded">{error}</p>}
        {printMessage && <p className="text-green-400 text-center p-3 bg-green-900/50 rounded">{printMessage}</p>}
        <div className="space-y-3 mt-4">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc) => (
              <div key={doc._id} className="flex justify-between items-center p-4 bg-gray-700 rounded-md">
                <p className="font-semibold text-lg">{doc.originalName}</p>
                <button onClick={() => handlePrint(doc._id, doc.originalName)} className="px-5 py-2 text-base font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition">
                  Print
                </button>
              </div>
            ))
          ) : (
            <p>No documents found.</p>
          )}
        </div>
      </div>
  );
};

export default PrintPage;
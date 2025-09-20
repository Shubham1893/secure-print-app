import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
// The corrected import statement is here:
import api, { printApi } from '../api/axios'; 

const PrintPage = () => {
  const { token } = useParams();
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState('Please enter the OTP provided by the customer.');
  const [error, setError] = useState('');
  const [printMessage, setPrintMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [cooldown, setCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResendMessage('');
    try {
      const { data } = await api.post('/print/verify-otp', { token, otp });
      localStorage.setItem('printSessionToken', data.sessionToken);
      setIsVerified(true);
      setMessage('Verification successful. Loading documents...');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed.');
      localStorage.removeItem('printSessionToken');
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setError('');
    setResendMessage('Sending...');
    try {
      const { data } = await api.post('/print/resend-otp', { token });
      setResendMessage(data.message);
      setCooldown(30);
    } catch (err) {
      setResendMessage('');
      setError(err.response?.data?.message || 'Failed to resend OTP.');
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
  
  // THIS IS THE DIRECT PRINT LOGIC YOU PREFER - NOW MORE RELIABLE
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
      // Make the iframe completely invisible and non-disruptive
      iframe.style.position = 'fixed';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      iframe.style.top = '-10px';
      iframe.style.left = '-10px';
      iframe.src = fileURL;
      
      document.body.appendChild(iframe);
      
      iframe.onload = () => {
        const iframeWindow = iframe.contentWindow;

        // This function will handle cleaning up the iframe from the page
        const cleanup = () => {
          // Check if the iframe still exists before trying to remove it
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
          URL.revokeObjectURL(fileURL);
        };

        // This event fires AFTER the user has closed the print dialog (either by printing or canceling)
        iframeWindow.onafterprint = cleanup;

        // Trigger the OS print dialog
        iframeWindow.focus();
        iframeWindow.print();
        setPrintMessage(`"${docName}" has been sent to the print dialog.`);
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
            {error && <p className="text-red-500 text-center py-2">{error}</p>}
            {resendMessage && <p className="text-green-400 text-center py-2">{resendMessage}</p>}
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium">Enter 6-Digit OTP</label>
                <input type="text" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)} required className="w-full px-3 py-2 mt-1 text-center text-2xl tracking-widest font-mono text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
              <button type="submit" className="w-full py-2 px-4 font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition duration-300">Verify & Access Documents</button>
            </form>
            <div className="text-center">
              <button 
                onClick={handleResendOtp} 
                disabled={cooldown > 0}
                className="text-sm text-cyan-400 hover:underline disabled:text-gray-500 disabled:no-underline disabled:cursor-not-allowed"
              >
                {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Did not receive an OTP? Resend.'}
              </button>
            </div>
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
        <p className="mb-4 text-yellow-400 bg-yellow-900/50 p-3 rounded">This session is temporary and will expire in 2 minutes.</p>
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


import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const DashboardPage = () => {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [shareableLink, setShareableLink] = useState('');
  
  // 1. Add new state for the search term
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDocuments = useCallback(async () => {
    try {
      const { data } = await api.get('/documents');
      setDocuments(data);
    } catch (error) {
      console.error('Failed to fetch documents', error);
      setMessage('Error: Could not fetch documents.');
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('document', file);
    try {
      await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('File uploaded successfully!');
      setFile(null);
      document.getElementById('file-input').value = null;
      fetchDocuments();
    } catch (error) {
      setMessage('Error: File upload failed.');
      console.error('Upload error', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await api.delete(`/documents/${id}`);
        setMessage('Document deleted successfully.');
        fetchDocuments();
      } catch (error) {
        setMessage('Error: Could not delete document.');
        console.error('Delete error', error);
      }
    }
  };

  const handleGenerateLink = async () => {
    try {
      const { data } = await api.post('/print/generate-link');
      setShareableLink(data.shareableLink);
      setMessage(data.message);
    } catch (error) {
      setMessage('Error: Could not generate print link.');
      console.error('Generate link error', error);
    }
  };
  
  // 2. Filter documents based on the search term
  const filteredDocuments = documents.filter(doc =>
    doc.originalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="p-6 bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-cyan-400">Upload New Document</h2>
        <form onSubmit={handleUpload} className="flex items-center space-x-4">
          <input id="file-input" type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100" />
          <button type="submit" className="px-6 py-2 font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 transition">Upload</button>
        </form>
      </div>

      {/* Print Purpose Link Section */}
      <div className="p-6 bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-cyan-400">Generate Print Link</h2>
        <button onClick={handleGenerateLink} className="px-6 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition">Generate Link & Send OTP</button>
        {shareableLink && (
          <div className="mt-4 p-4 bg-gray-700 rounded">
            <p className="font-semibold">Share this link with the print shop:</p>
            <input type="text" readOnly value={shareableLink} className="w-full p-2 mt-2 bg-gray-800 border border-gray-600 rounded" onClick={(e) => e.target.select()} />
          </div>
        )}
      </div>

      {message && <p className="text-center p-3 bg-gray-700 rounded">{message}</p>}

      {/* My Documents Section */}
      <div className="p-6 bg-gray-800 rounded-lg">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-cyan-400">My Documents</h2>
            {/* 3. Add the search bar input field */}
            <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
        </div>
        <div className="space-y-3">
          {/* 4. Map over the filtered list */}
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc) => (
              <div key={doc._id} className="flex justify-between items-center p-3 bg-gray-700 rounded-md">
                <p>{doc.originalName}</p>
                <button onClick={() => handleDelete(doc._id)} className="px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition">Delete</button>
              </div>
            ))
          ) : (
            <p>No documents found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

function UploadComponent({ onUploadSuccess }) {
  const [folderName, setFolderName] = useState('');
  const [files, setFiles] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFolderNameChange = (e) => {
    setFolderName(e.target.value);
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!folderName || !files) {
      alert('Please enter a folder name and select files to upload.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('folderName', folderName);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const relativePath = file.webkitRelativePath || file.name;
      formData.append(`files/${relativePath}`, file);
    }

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      alert(response.data.message);
      setFolderName('');
      setFiles(null);
      setUploadProgress(0);
      onUploadSuccess();
    } catch (error) {
      console.error('Error uploading folder:', error.response?.data || error.message);
      alert(`Error uploading folder: ${error.response?.data?.details || error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="folderName" className="block text-sm font-medium text-gray-700 mb-1">
          Folder Name
        </label>
        <input
          type="text"
          id="folderName"
          placeholder="Enter folder name"
          value={folderName}
          onChange={handleFolderNameChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="fileInput" className="block text-sm font-medium text-gray-700 mb-1">
          Choose Files
        </label>
        <input
          type="file"
          id="fileInput"
          webkitdirectory="true"
          directory="true"
          multiple
          onChange={handleFileChange}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      <button
        onClick={handleUpload}
        disabled={isUploading}
        className={`w-full ${
          isUploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
        } text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
      {isUploading && (
        <div className="mt-4">
          <div className="bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-center mt-2">{uploadProgress}% Uploaded</p>
        </div>
      )}
    </div>
  );
}

export default UploadComponent;
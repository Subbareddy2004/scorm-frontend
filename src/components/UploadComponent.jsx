import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const MAX_FILE_SIZE = 150 * 1024 * 1024; // 150MB

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks

const uploadChunk = async (chunk, fileName, chunkIndex, totalChunks) => {
  const formData = new FormData();
  formData.append('file', chunk, fileName);
  formData.append('chunkIndex', chunkIndex);
  formData.append('totalChunks', totalChunks);

  try {
    await axios.post(`${API_URL}/upload-chunk`, formData);
  } catch (error) {
    console.error('Error uploading chunk:', error);
    throw error;
  }
};

function UploadComponent({ onUploadSuccess }) {
  const [folderName, setFolderName] = useState('');
  const [files, setFiles] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFolderNameChange = (e) => {
    setFolderName(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    let totalSize = 0;
    
    for (let i = 0; i < selectedFiles.length; i++) {
      totalSize += selectedFiles[i].size;
    }
    
    if (totalSize > MAX_FILE_SIZE) {
      alert(`Total file size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit. Please select smaller files.`);
      e.target.value = null; // Clear the file input
      return;
    }
    
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      alert('Please select files to upload');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (let file of files) {
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        
        for (let i = 0; i < totalChunks; i++) {
          const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
          await uploadChunk(chunk, file.name, i, totalChunks);
          setUploadProgress(Math.round(((i + 1) / totalChunks) * 100));
        }
      }

      // Notify server that all chunks have been uploaded
      await axios.post(`${API_URL}/complete-upload`, { fileName: files[0].name });
      
      alert('Upload completed successfully');
      onUploadSuccess();
    } catch (error) {
      console.error('Error during upload:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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
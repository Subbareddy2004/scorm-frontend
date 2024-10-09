import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

function FolderList({ updateTrigger }) {
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    fetchFolders();
  }, [updateTrigger]);

  const fetchFolders = async () => {
    try {
      console.log('Fetching folders...');
      const response = await axios.get(`${API_URL}/folders`);
      console.log('Folders response:', response.data);
      setFolders(response.data);
    } catch (error) {
      console.error('Error fetching folders:', error);
      alert(`Error fetching folders: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleDelete = async (folderName) => {
    try {
      await axios.delete(`${API_URL}/folders/${folderName}`);
      alert(`Folder "${folderName}" deleted successfully`);
      fetchFolders(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting folder:', error);
      alert(`Error deleting folder: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Uploaded Folders Links</h2>
      {folders.length === 0 ? (
        <p className="text-gray-500">No folders uploaded yet.</p>
      ) : (
        <ul className="space-y-2">
          {folders.map((folder, index) => (
            <li key={index} className="bg-gray-50 rounded-md p-3 hover:bg-gray-100 transition-colors flex justify-between items-center">
              <a
                href={`${API_URL}${folder.link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {folder.name}
              </a>
              <button
                onClick={() => handleDelete(folder.name)}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FolderList;
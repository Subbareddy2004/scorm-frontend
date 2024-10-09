import React, { useState } from 'react';
import Header from './components/Header';
import UploadComponent from './components/UploadComponent';
import FolderList from './components/FolderList';

function App() {
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const triggerUpdate = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Upload New Folder</h2>
          <UploadComponent onUploadSuccess={triggerUpdate} />
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <FolderList updateTrigger={updateTrigger} />
        </div>
      </main>
    </div>
  );
}

export default App;
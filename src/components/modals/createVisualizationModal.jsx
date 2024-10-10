'use client';

import React, { useState } from 'react';

const CreateVisualizationModal = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDashboard, setSelectedDashboard] = useState('');
  const [isNewDashboard, setIsNewDashboard] = useState(false);
  const [isAddToLibrary, setIsAddToLibrary] = useState(false);

  const handleSave = () => {
    const chartData = {
      title,
      description,
      dashboard: isNewDashboard ? 'New Dashboard' : selectedDashboard,
      addToLibrary: isAddToLibrary,
    };
    
    onSave(chartData); // 차트 데이터 저장
    onClose(); // 모달 닫기
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded shadow-lg p-4 w-1/3">
        <h2 className="text-lg font-bold">Create Visualization</h2>

        <div className="mt-4">
          <label htmlFor="title" className="block">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded p-2 w-full"
            placeholder="Enter title"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="description" className="block">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded p-2 w-full"
            placeholder="Enter description"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="dashboard" className="block">Add to Dashboard</label>
          <select
            id="dashboard"
            value={selectedDashboard}
            onChange={(e) => setSelectedDashboard(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="">Select Existing Dashboard</option>
            {/* 여기에 대시보드 목록을 추가합니다 */}
            <option value="dashboard1">Dashboard 1</option>
            <option value="dashboard2">Dashboard 2</option>
          </select>
          <div className="mt-2">
            <label>
              <input
                type="checkbox"
                checked={isNewDashboard}
                onChange={() => setIsNewDashboard(!isNewDashboard)}
              />
              Create New Dashboard
            </label>
          </div>
        </div>

        <div className="mt-4">
          <label>
            <input
              type="checkbox"
              checked={isAddToLibrary}
              onChange={() => setIsAddToLibrary(!isAddToLibrary)}
            />
            Add to Library
          </label>
        </div>

        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="mr-2 text-gray-500">Cancel</button>
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

export default CreateVisualizationModal;

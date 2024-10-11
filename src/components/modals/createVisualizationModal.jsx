import React, { useState, useEffect } from 'react';

const CreateVisualizationModal = ({ onClose, onSave, fetchDashboards }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDashboard, setSelectedDashboard] = useState('');
  const [isNewDashboard, setIsNewDashboard] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState('');
  const [isAddToLibrary, setIsAddToLibrary] = useState(false);
  const [existingDashboards, setExistingDashboards] = useState([]);

  useEffect(() => {
    // 기존 대시보드를 가져오는 API 호출
    const fetchDashboards = async () => {
      const response = await fetch('/api/dashboards');
      if (response.ok) {
        const data = await response.json();
        setExistingDashboards(data);
      }
    };

    fetchDashboards();
  }, []);

  const handleSave = async () => {
    let dashboardId = selectedDashboard;

    // 새 대시보드를 생성하는 경우
    if (isNewDashboard) {
      const response = await fetch('/api/dashboards/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newDashboardName }),
      });

      if (response.ok) {
        const newDashboard = await response.json();
        dashboardId = newDashboard.id;

        // 새 대시보드가 생성된 후 대시보드 목록을 다시 가져옴
        if (fetchDashboards) {
          await fetchDashboards();
        }
      } else {
        console.error('대시보드 생성 실패');
        return;
      }
    }

    // 차트 데이터
    const chartData = {
      title,
      description,
      addToLibrary: isAddToLibrary,
      chartType: 'bar', // 차트 타입을 동적으로 설정할 필요가 있다면 여기를 수정
      xAxis: 'x-axis', // 임시 값
      yAxes: ['y-axis'], // 임시 값
      data: [{ x: '1', y: 100 }, { x: '2', y: 200 }],
    };

    // 대시보드에 차트 추가
    const updateDashboardResponse = await fetch(`/api/dashboards/${dashboardId}/addChart`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chartData),
    });

    if (!updateDashboardResponse.ok) {
      console.error('차트를 대시보드에 저장하는 데 실패했습니다.');
      return;
    }

    onSave(chartData);
    onClose();
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
            disabled={isNewDashboard}
          >
            <option value="">Select Existing Dashboard</option>
            {existingDashboards.map((dashboard) => (
              <option key={dashboard.id} value={dashboard.id}>
                {dashboard.name}
              </option>
            ))}
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

          {isNewDashboard && (
            <div className="mt-4">
              <label htmlFor="newDashboardName" className="block">New Dashboard Name</label>
              <input
                type="text"
                id="newDashboardName"
                value={newDashboardName}
                onChange={(e) => setNewDashboardName(e.target.value)}
                className="border rounded p-2 w-full"
                placeholder="Enter new dashboard name"
              />
            </div>
          )}
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
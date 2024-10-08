import React, { useState } from 'react';

const ChartSaveModal = ({ isOpen, onClose, onSave }) => {
  const [chartName, setChartName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(chartName);
    onClose(); // 모달 닫기
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-lg font-bold mb-4">차트 제목 입력</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={chartName}
            onChange={(e) => setChartName(e.target.value)}
            placeholder="차트 제목을 입력하세요"
            className="border p-2 mb-4 w-full"
            required
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-gray-300 px-4 py-2 rounded"
            >
              취소
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChartSaveModal;

// src/components/modals/ChartsInfoModal.jsx
'use client';

import React, { useEffect, useState } from 'react';

const ChartsInfoModal = ({ chartId, onClose, onUpdate }) => {
  const [chart, setChart] = useState(null); // 초기 상태를 null로 설정
  const [title, setTitle] = useState(''); // 초기 제목 상태
  const [description, setDescription] = useState(''); // 초기 설명 상태
  const [error, setError] = useState(''); // 오류 메시지 상태

  // 차트 정보를 가져오는 API 호출
  useEffect(() => {
    if (chartId) {  // chartId가 존재할 때만 API 호출
      const fetchChart = async () => {
        try {
          const encodedChartId = encodeURIComponent(chartId);
          const response = await fetch(`/api/chartsInfo/get/${encodedChartId}`);
          if (!response.ok) {
            throw new Error('차트를 불러오는 데 실패했습니다.');
          }
          const result = await response.json();
          setChart(result);
        } catch (error) {
          console.error(error);
          setError(error.message);
        }
      };
  
      fetchChart();
    }
  }, [chartId]);

  // 차트 정보를 가져온 후 title과 description 초기화
  useEffect(() => {
    if (chart) {
      setTitle(chart.title || ''); // 차트 제목 초기화
      setDescription(chart.description || ''); // 차트 설명 초기화
    }
  }, [chart]);

  const handleSave = async () => {
    if (chart) {
      const updatedChart = { ...chart, title, description };
  
      try {
        const encodedChartId = encodeURIComponent(chartId); // chartId를 URL에 맞게 인코딩
        const response = await fetch(`/api/chartsInfo/put/${encodedChartId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedChart),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '차트 정보 업데이트에 실패했습니다.');
        }
  
        onUpdate(updatedChart);
        onClose();
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded shadow-lg p-4 w-1/3">
        <h2 className="text-lg font-bold">차트 정보</h2>

        {error && <p className="text-red-500">{error}</p>} {/* 오류 메시지 출력 */}

        <div className="mt-4">
          <label htmlFor="title" className="block">제목</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded p-2 w-full"
            placeholder="제목 입력"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="description" className="block">설명</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded p-2 w-full"
            placeholder="설명 입력"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="mr-2 text-gray-500">취소</button>
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">저장</button>
        </div>
      </div>
    </div>
  );
};

export default ChartsInfoModal;

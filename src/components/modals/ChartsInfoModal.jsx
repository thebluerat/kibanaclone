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
    const fetchChart = async (chartId) => {
        try {
          const encodedChartId = encodeURIComponent(chartId); // 차트 ID 인코딩
          const response = await fetch(`/api/chartsInfo/get/${encodedChartId}`); // 인코딩된 ID 사용
          if (!response.ok) {
            throw new Error('차트를 불러오는 데 실패했습니다.'); 
          }
          const result = await response.json();
          // ...
        } catch (error) {
          console.error(error);
          setError(error.message);
        }
      };

    fetchChart();
  }, [chartId]);

  // 차트 정보를 가져온 후 title과 description 초기화
  useEffect(() => {
    if (chart) {
      setTitle(chart.title || ''); // 차트 제목 초기화
      setDescription(chart.description || ''); // 차트 설명 초기화
    }
  }, [chart]);

  const handleSave = async () => {
    if (chart) { // chart가 존재하는 경우에만 업데이트
      const updatedChart = { ...chart, title, description }; // 업데이트된 차트 정보 생성

      try {
        const response = await fetch(`/api/chartsInfo/update/${chartId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedChart), // 업데이트할 데이터
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '차트 정보 업데이트에 실패했습니다.'); // 오류 처리
        }

        onUpdate(updatedChart); // 부모 컴포넌트로 업데이트된 차트 정보 전달
        onClose(); // 모달 닫기
      } catch (error) {
        console.error(error);
        setError(error.message); // 오류 메시지 설정
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

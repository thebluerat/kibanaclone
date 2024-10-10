'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ChartsInfoModal from '../../../components/modals/chartsInfoModal';

const VisualizationLibrary = () => {
  const [charts, setCharts] = useState([]); // 차트 목록 상태
  const [error, setError] = useState(null); // 오류 상태
  const [selectedChart, setSelectedChart] = useState(null); // 선택된 차트 정보
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태
  const router = useRouter();

  // 차트 목록을 불러오는 API 호출
  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const response = await fetch('/api/charts/get'); // 저장된 차트 목록을 가져오는 API 호출
        if (!response.ok) {
          throw new Error('차트를 불러오는 데 실패했습니다.'); // 응답이 실패한 경우
        }
        const result = await response.json();
        console.log('Fetched charts:', result.charts);
        setCharts(result.charts || []); // 차트 목록 상태 업데이트
      } catch (error) {
        console.error(error);
        setError(error.message); // 오류 메시지 설정
      }
    };

    fetchCharts();
  }, []);

  // 차트를 선택했을 때 해당 차트를 보여주는 함수
  const handleChartSelect = (chartId) => {
    const encodedChartId = encodeURIComponent(chartId); // 차트 이름을 URL-safe하게 변환
    router.push(`/charts/${encodedChartId}`); // 변환된 차트 이름으로 페이지 이동
  };
  
  // 차트 편집 페이지로 이동
  const handleEditChart = (chartId) => {
    router.push(`/edit-chart/${chartId}`); // 차트 편집 페이지로 이동
  };

  // 차트 정보 모달 열기
  const handleInfoClick = (chartId) => {
    setSelectedChart(chartId); // 선택된 차트 ID 설정
    setIsModalOpen(true); // 모달 열기
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedChart(null);
  };

  // 차트 정보 업데이트 핸들러
  const handleUpdate = async (chartId, updatedInfo) => {
    try {
      const response = await fetch(`/api/chartsInfo/put/${chartId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedInfo),
      });

      if (!response.ok) {
        throw new Error('차트 정보를 업데이트하는 데 실패했습니다.');
      }

      const result = await response.json();
      console.log(result.message);

      // 차트 목록을 다시 불러오기
      await fetchCharts();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">시각화 라이브러리</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>} {/* 오류 메시지 표시 */}
      <ul>
        {charts.map((chart) => (
          <li key={chart.title} className="flex justify-between items-center mb-2 p-2 border rounded">
            <span 
              onClick={() => handleChartSelect(chart.title)} 
              className="cursor-pointer text-blue-600"
            >
              {chart.title || '차트 이름 없음'} {/* 차트 제목, 없을 경우 기본 텍스트 표시 */}
            </span>
            <div>
              <button 
                onClick={() => handleEditChart(chart.title)} 
                className="bg-blue-500 text-white rounded px-2 py-1 mr-2"
              >
                편집
              </button>
              <button 
                onClick={() => handleInfoClick(chart.title)} 
                className="bg-green-500 text-white rounded px-2 py-1"
              >
                정보
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* 차트 정보 모달 */}
      {isModalOpen && selectedChart && ( // selectedChart가 있을 때만 모달을 열기
        <ChartsInfoModal 
          chartId={selectedChart} // 선택된 차트 ID 전달
          onClose={closeModal} 
          onUpdate={handleUpdate} // 업데이트 핸들러 추가
        />
      )}
    </div>
  );
};

export default VisualizationLibrary;

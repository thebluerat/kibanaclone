'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const VisualizationLibrary = () => {
  const [charts, setCharts] = useState([]); // 차트 목록 상태
  const [error, setError] = useState(null); // 오류 상태
  const router = useRouter();

  // 차트 목록을 불러오는 API 호출
  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const response = await fetch('/api/charts'); // 저장된 차트 목록을 가져오는 API 호출
        if (!response.ok) {
          throw new Error('차트를 불러오는 데 실패했습니다.'); // 응답이 실패한 경우
        }
        const result = await response.json();
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
    router.push(`/charts/${chartId}`); // 해당 차트 페이지로 이동
  };

  // 차트 편집 페이지로 이동
  const handleEditChart = (chartId) => {
    router.push(`/edit-chart/${chartId}`); // 차트 편집 페이지로 이동
  };

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">시각화 라이브러리</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>} {/* 오류 메시지 표시 */}
      <ul>
        {charts.map((chart) => (
          <li key={chart.name} className="flex justify-between items-center mb-2 p-2 border rounded">
            <span onClick={() => handleChartSelect(chart.name)} className="cursor-pointer text-blue-600">
              {chart.name} {/* 차트 이름 */}
            </span>
            <button 
              onClick={() => handleEditChart(chart.name)} 
              className="bg-blue-500 text-white rounded px-2 py-1"
            >
              편집
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VisualizationLibrary;

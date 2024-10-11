// src/app/dashboard/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AddFromLibrary from '../addFromLibrary/page';
import DraggableGrid from '../../../components/DraggableGrid';
import Chart from '../../../components/Chart';

const DashboardItem = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    // 대시보드 데이터를 가져오는 로직
    const fetchDashboard = async () => {
      const response = await fetch(`/api/dashboards/${id}`);
      if (response.ok) {
        const data = await response.json();
        setDashboard(data);
      }
    };

    fetchDashboard();
  }, [id]);

  const handleAddChartFromLibrary = async (chartId) => {
    try {
      const response = await fetch(`/api/charts/get/${chartId}`);
      if (!response.ok) {
        throw new Error('차트 데이터를 가져오는 데 실패했습니다.');
      }
      const chartData = await response.json();

      // 대시보드에 차트를 추가합니다.
      setDashboard((prev) => ({
        ...prev,
        charts: [...prev.charts, chartData],
      }));
      setShowLibraryModal(false);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-4">
      <h1 className="text-2xl font-bold">{dashboard?.name || '대시보드'}</h1>
      <button onClick={() => setShowLibraryModal(true)} className="mt-4 bg-blue-500 text-white p-2 rounded">
        라이브러리에서 차트 추가
      </button>

      <DraggableGrid>
        {dashboard?.charts?.map((chart, index) => (
          <Chart 
            key={chart.id || index} // 고유 ID가 없는 경우 인덱스를 사용
            data={chart.data} 
            xAxis={chart.xAxis} 
            yAxes={chart.yAxes} 
            chartType={chart.chartType} 
            yAxisSettings={chart.yAxisSettings} 
            pieSettings={chart.pieSettings} 
          />
        ))}
      </DraggableGrid>

      {showLibraryModal && (
        <AddFromLibrary onClose={() => setShowLibraryModal(false)} onAddChart={handleAddChartFromLibrary} />
      )}
    </div>
  );
};

export default DashboardItem;

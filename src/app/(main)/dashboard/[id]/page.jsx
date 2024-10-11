'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DraggableGrid from '../../../../components/DraggableGrid';
import Chart from '../../../../components/Chart';

const DashboardItem = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [charts, setCharts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        console.log(`Fetching dashboard data for ID: ${id}`); // 요청 시작 로그
  
        const response = await fetch(`/api/dashboards/get/${id}`);
        
        if (!response.ok) {
          throw new Error('대시보드를 불러오는 데 실패했습니다.');
        }
  
        const data = await response.json();
        console.log('Fetched dashboard data:', data); // 응답 로그
  
        setDashboardData(data);
        setCharts(data.charts || []); // 대시보드에 저장된 차트 설정
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
  
    fetchDashboard();
  }, [id]);
  

  // 데이터가 로딩 중일 때
  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  // 대시보드가 없거나 차트가 없는 경우
  if (!dashboardData || charts.length === 0) {
    return <div>저장된 차트가 없습니다.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen p-4">
      <h1 className="text-2xl font-bold">{dashboardData?.name || '대시보드'}</h1>

      <DraggableGrid>
        {charts.map((chart, index) => (
          <Chart
            key={index} // 고유 ID를 사용해야 하지만 예시로 index 사용
            data={chart.data}
            xAxis={chart.xAxis}
            yAxes={chart.yAxes}
            chartType={chart.chartType || 'bar'}
            yAxisSettings={chart.yAxisSettings}
            pieSettings={chart.pieSettings}
          />
        ))}
      </DraggableGrid>
    </div>
  );
};

export default DashboardItem;

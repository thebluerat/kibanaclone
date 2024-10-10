'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Chart from '../../../../components/Chart';

const ChartDetailPage = ({ params }) => {
    const { chartId } = params;  // URL에서 차트 ID 가져오기
    const decodedChartId = decodeURIComponent(chartId); // URL에서 인코딩된 차트 이름을 디코딩
    const [chartData, setChartData] = useState(null);
  
    useEffect(() => {
      const fetchChart = async () => {
        try {
          const response = await fetch(`/api/charts/get/${decodedChartId}`); // API 호출
          if (!response.ok) {
            throw new Error('차트를 불러오는 데 실패했습니다.');
          }
          const data = await response.json(); // JSON으로 변환
  
          setChartData(data); // 차트 데이터 설정
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchChart();
    }, [decodedChartId]);
  
    if (!chartData) {
      return <div>로딩 중...</div>; // 데이터가 로딩 중일 때
    }

  // Chart 컴포넌트에 필요한 데이터 및 설정을 전달
  return (
    <div>
      <h1>{decodedChartId}</h1>
      <Chart
        data={chartData.data} // 실제 데이터
        xAxis={chartData.xAxis} // X축 데이터
        yAxes={chartData.yAxes} // Y축 데이터
        chartType={chartData.chartType} // 차트 타입
        yAxisSettings={chartData.yAxisSettings} // Y축 설정
        pieSettings={chartData.pieSettings} // 파이 차트 설정 (있다면)
      />
    </div>
  );
};

export default ChartDetailPage;

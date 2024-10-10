'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Chart from '../../../../components/Chart';

const ChartDetailPage = ({ params }) => {
  const { chartId } = params;
  const decodedChartId = decodeURIComponent(chartId); // URL에서 인코딩된 차트 이름을 디코딩
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const response = await fetch(`/charts/${decodedChartId}.json`);
        if (!response.ok) {
          throw new Error('차트를 불러오는 데 실패했습니다.');
        }
        let data = await response.json();
  
        // 이중 따옴표 제거 처리
        data = JSON.parse(JSON.stringify(data, (key, value) => {
          if (typeof value === 'string') {
            return value.replace(/"{2}/g, '"');  // 이중 따옴표를 제거
          }
          return value;
        }));
  
        setChartData(data);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchChart();
  }, [decodedChartId]);
  

  if (!chartData) {
    return <div>로딩 중...</div>;
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

import { useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';

const Chart = ({ data, xAxis, yAxes, chartType }) => {
  const chartRef = useRef(null);

  // CSV 데이터의 첫 번째 객체에서 헤더를 추출
  const headers = useMemo(() => (data.length > 0 ? Object.keys(data[0]) : []), [data]);

  // xData와 yData들을 메모이제이션
  const xData = useMemo(() => data.map((row) => row[xAxis]), [data, xAxis]);
  const yDataSeries = useMemo(() => {
    return yAxes.map((yAxis) => {
      return {
        name: yAxis,
        type: chartType,
        data: data.map((row) => {
          const cleanedValue = row[yAxis]?.replace(/[^0-9.]/g, ''); // 숫자와 소수점만 남김
          const value = parseFloat(cleanedValue);
          return isNaN(value) ? 0 : value; // NaN 값이 있으면 0으로 설정
        }),
      };
    });
  }, [data, yAxes, chartType]);

  useEffect(() => {
    if (!xAxis || yAxes.length === 0 || data.length === 0) return;

    const chartDom = document.getElementById('chart');
    if (!chartDom) {
      console.error("chartDom not found");
      return;
    }

    const myChart = echarts.init(chartDom);
    chartRef.current = myChart;

    const option = {
      xAxis: {
        type: 'category',
        data: xData,
        axisLabel: {
          interval: Math.ceil(xData.length / 9) - 1, // 최대 9개로 간격 조정
          rotate: 45, // 라벨이 겹치지 않도록 회전
        },
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: 'value',
        min: 0,
      },
      series: yDataSeries, // 여러 Y축 시리즈를 추가
    };

    myChart.setOption(option);

    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [xAxis, yDataSeries, data.length]);

  return <div id="chart" className="w-full h-full" style={{ minHeight: '500px' }}></div>;
};

export default Chart;

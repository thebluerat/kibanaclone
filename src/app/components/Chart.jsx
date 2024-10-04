import { useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';

const Chart = ({ data, xAxis, yAxes, chartType, yAxisSettings }) => {
  const chartRef = useRef(null);

  // xData와 yData 시리즈들 생성
  const xData = useMemo(() => data.map((row) => row[xAxis]), [data, xAxis]);

  const yDataSeries = useMemo(() => {
    return yAxes.map((yAxis) => {
      // 기본 설정 적용
      const settings = yAxisSettings?.[yAxis] || {
        function: 'Median',
        color: '#6092C0',
        format: 'Default',
        side: 'Auto',
      };

      // 데이터 정리 (숫자 형식으로 변환)
      const yData = data.map((row) => {
        const cleanedValue = row[yAxis]?.replace(/[^0-9.]/g, ''); // 숫자와 소수점만 남김
        const value = parseFloat(cleanedValue);
        return isNaN(value) ? 0 : value; // NaN이면 0 처리
      });

      // 시리즈 설정
      return {
        name: `${settings.function} of ${yAxis}`, // 커스텀 이름
        type: chartType,
        data: yData,
        yAxisIndex: settings.side === 'Right' ? 1 : 0, // Y축이 오른쪽인지 왼쪽인지 설정
        itemStyle: { color: settings.color || '#6092C0' }, // 시리즈 색상
        label: {
          formatter: (val) => formatValue(val, settings.format), // 값 형식 반영
        },
      };
    });
  }, [data, yAxes, yAxisSettings, chartType]);

  // Value Format을 처리하는 함수
  const formatValue = (val, format) => {
    switch (format) {
      case 'Percent':
        return `${val}%`;
      case 'Bits':
        return `${val} bits`;
      case 'Bytes':
        return `${val} bytes`;
      case 'Duration':
        return `${val} sec`;
      case 'Number':
        return val.toLocaleString();
      default:
        return val;
    }
  };

  useEffect(() => {
    if (!xAxis || yAxes.length === 0 || data.length === 0) return;

    const chartDom = document.getElementById('chart');
    if (!chartDom) {
      console.error('chartDom not found');
      return;
    }

    const myChart = echarts.init(chartDom);
    chartRef.current = myChart;

    // 차트 옵션 설정
    const option = {
      xAxis: {
        type: 'category',
        data: xData,
        axisLabel: {
          interval: Math.ceil(xData.length / 9) - 1, // 최대 9개의 라벨만 표시
          rotate: 45, // 라벨 회전
        },
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: [
        { type: 'value', name: 'Left Axis' }, // 왼쪽 Y축
        { type: 'value', name: 'Right Axis', position: 'right' }, // 오른쪽 Y축
      ],
      series: yDataSeries, // 여러 Y축 시리즈
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

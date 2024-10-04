import { useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';

const Chart = ({ data, xAxis, yAxes, chartType, yAxisSettings, pieSettings }) => {
  const chartRef = useRef(null);

  const xData = useMemo(() => data.map((row) => row[xAxis]), [data, xAxis]);

  const yDataSeries = useMemo(() => {
    if (chartType === 'pie') {
      return [
        {
          type: 'pie',
          data: yAxes.map((yAxis) => ({
            name: yAxis,
            value: data.reduce((sum, row) => sum + (parseFloat(row[yAxis]) || 0), 0),
          })),
          radius: '50%', 
          label: {
            show: true,
            formatter: '{b}: {c}', // Pie 차트 라벨 설정
            fontSize: 12,
            position: pieSettings.labelPosition || 'outside',
          },
        },
      ];
    }

    return yAxes.map((yAxis) => {
      const settings = yAxisSettings?.[yAxis] || {
        function: 'Median',
        color: '#6092C0',
        format: 'Default',
        side: 'Auto',
      };

      const yData = data.map((row) => {
        const cleanedValue = row[yAxis]?.replace(/[^0-9.]/g, '');
        const value = parseFloat(cleanedValue);
        return isNaN(value) ? 0 : value;
      });

      return {
        name: `${settings.function} of ${yAxis}`,
        type: chartType,
        data: yData,
        yAxisIndex: settings.side === 'Right' ? 1 : 0,
        itemStyle: { color: settings.color || '#6092C0' },
        label: {
          show: true,
          fontSize: 10,
          position: 'top',
          formatter: (params) => formatValue(params.value, settings.format), // 변경된 formatter
        },
      };
    });
  }, [data, yAxes, yAxisSettings, chartType, pieSettings]);

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
    if (!data.length || (chartType !== 'pie' && (!xAxis || !yAxes.length))) return;

    const chartDom = document.getElementById('chart');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);
    chartRef.current = myChart;

    const option = {
      xAxis: chartType !== 'pie' ? {
        type: 'category',
        data: xData,
        axisLabel: {
          interval: Math.ceil(xData.length / 9) - 1,
          rotate: 45,
        },
        axisTick: {
          alignWithLabel: true,
        },
      } : undefined,
      yAxis: chartType !== 'pie' ? [
        { type: 'value', name: 'Left Axis' },
        { type: 'value', name: 'Right Axis', position: 'right' },
      ] : undefined,
      series: yDataSeries,
    };

    myChart.setOption(option);

    const handleResize = () => {
      if (chartRef.current) chartRef.current.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [xAxis, yDataSeries, data.length, chartType]);

  return <div id="chart" className="w-full h-full" style={{ minHeight: '500px' }}></div>;
};

export default Chart;

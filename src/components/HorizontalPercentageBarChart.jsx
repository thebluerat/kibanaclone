import React, { useMemo, useEffect } from 'react';
import * as echarts from 'echarts';

const HorizontalPercentageBarChart = ({ data = [], xAxis, yAxes, yAxisSettings }) => {
  const xData = useMemo(() => {
    return data && xAxis ? data.map((row) => row[xAxis]) : [];
  }, [data, xAxis]);

  const yDataSeries = useMemo(() => {
    if (!data || !yAxes) return [];

    const totalSums = yAxes.map((yAxis) =>
      data.reduce((sum, row) => sum + (parseFloat(row[yAxis]) || 0), 0)
    );

    return yAxes.map((yAxis, index) => {
      const yData = data.map((row) => {
        const value = parseFloat(row[yAxis]) || 0;
        return (totalSums[index] > 0) ? (value / totalSums[index]) * 100 : 0;
      });

      const settings = yAxisSettings?.[yAxis] || { color: '#6092C0' };

      return {
        name: yAxis,
        type: 'bar',
        stack: 'total',
        data: yData,
        label: {
          show: true,
          position: 'insideRight',
          formatter: '{c}%', // 퍼센트로 표시
        },
        itemStyle: { color: settings.color },
      };
    });
  }, [data, yAxes, yAxisSettings]);

  useEffect(() => {
    if (xData.length && yDataSeries.length) {
      const chartDom = document.getElementById('horizontal-percentage-bar-chart');
      const myChart = echarts.init(chartDom);

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          top: 'bottom',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'category',
          data: xData,
        },
        series: yDataSeries,
      };

      myChart.setOption(option);

      // resize event 처리
      window.addEventListener('resize', myChart.resize);

      return () => {
        window.removeEventListener('resize', myChart.resize);
        myChart.dispose();
      };
    }
  }, [xData, yDataSeries]);

  return <div id="horizontal-percentage-bar-chart" style={{ width: '100%', height: '400px' }} />;
};

export default HorizontalPercentageBarChart;

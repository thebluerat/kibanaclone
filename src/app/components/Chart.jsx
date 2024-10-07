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
            formatter: '{b}: {c}',
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

      const yData = data.map((row) => parseFloat(row[yAxis]?.replace(/[^0-9.]/g, '') || 0));

      return {
        name: `${settings.function} of ${yAxis}`,
        type: chartType === 'bar-horizontal' ? 'bar' : chartType,
        data: yData,
        itemStyle: { color: settings.color || '#6092C0' },
        label: {
          show: true,
          fontSize: 10,
          position: chartType === 'bar-horizontal' ? 'right' : 'top',
          formatter: (params) => formatValue(params.value, settings.format),
        },
      };
    });
  }, [data, yAxes, yAxisSettings, chartType, pieSettings]);

  const formatValue = (val, format) => {
    switch (format) {
      case 'Percent': return `${val}%`;
      case 'Bits': return `${val} bits`;
      case 'Bytes': return `${val} bytes`;
      case 'Duration': return `${val} sec`;
      case 'Number': return val.toLocaleString();
      default: return val;
    }
  };

  const renderTable = () => (
    <table className="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr>
          <th className="border px-4 py-2">Index</th>
          <th className="border px-4 py-2">{xAxis}</th>
          {yAxes.map((yAxis) => (
            <th key={yAxis} className="border px-4 py-2">{yAxis}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td className="border px-4 py-2">{index + 1}</td>
            <td className="border px-4 py-2">{row[xAxis]}</td>
            {yAxes.map((yAxis) => (
              <td key={yAxis} className="border px-4 py-2">{row[yAxis]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const chartOptions = useMemo(() => {
    return {
      tooltip: {},
      xAxis: {
        type: chartType === 'bar-horizontal' ? 'value' : 'category', // X-axis as value for horizontal bar chart
        boundaryGap: chartType === 'bar-horizontal', // Allow for gap in horizontal bar chart
      },
      yAxis: {
        type: chartType === 'bar-horizontal' ? 'category' : 'value', // Y-axis as category for horizontal bar chart
        data: chartType === 'bar-horizontal' ? xData : undefined, // Set y-axis categories
      },
      series: yDataSeries,
    };
  }, [yDataSeries, xData, chartType]);

  useEffect(() => {
    if (chartRef.current) {
      const chartDom = chartRef.current;
      const myChart = echarts.init(chartDom);
      myChart.setOption(chartOptions);

      // Cleanup function to dispose chart instance
      return () => {
        myChart.dispose();
      };
    }
  }, [chartOptions]);

  return (
    <div>
      {chartType === 'table' ? renderTable() : <div ref={chartRef} id="chart" style={{ width: '100%', height: '400px' }} />}
    </div>
  );
};

export default Chart;

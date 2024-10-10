import { useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';

const Chart = ({ data = [], xAxis, yAxes = [], chartType, yAxisSettings, pieSettings, settings = {} }) => {
  const chartRef = useRef(null);

  // Get x-axis data
  const xData = useMemo(() => data.map((row) => row[xAxis]), [data, xAxis]);

  // Handle series data with dynamic calculation
  const yDataSeries = useMemo(() => {
    if (chartType === 'pie') {
      // Calculate total sum for percentage calculation
      const totalSum = yAxes.reduce((acc, yAxis) => {
        return acc + data.reduce((sum, row) => {
          const val = parseFloat(row[yAxis]?.replace(/[^0-9.-]/g, '') || 0);
          return sum + (isNaN(val) ? 0 : val);
        }, 0);
      }, 0);

      return [
        {
          type: 'pie',
          data: yAxes.map((yAxis) => {
            // Calculate sum for each yAxis
            const total = data.reduce((sum, row) => {
              const val = parseFloat(row[yAxis]?.replace(/[^0-9.-]/g, '') || 0);
              return sum + (isNaN(val) ? 0 : val);
            }, 0);

            // Calculation methods: Sum, Average, Count, Percentage
            const count = data.length;
            const average = count > 0 ? total / count : 0;

            const calculationMethod = settings.dataCalculation || 'sum';

            let value;
            switch (calculationMethod) {
              case 'average':
                value = average;
                break;
              case 'count':
                value = count;
                break;
              case 'percentage':
                value = (total / totalSum) * 100;
                break;
              case 'sum':
              default:
                value = total;
            }

            return {
              name: yAxis,
              value: value,
            };
          }),
          radius: '50%',
          label: {
            show: true,
            formatter: '{b}: {c} ({d}%)', // Adds percentage to pie chart labels
            fontSize: 12,
            position: pieSettings.labelPosition || 'outside',
          },
        },
      ];
    }

    // For other chart types (bar, line, etc.)
    return yAxes.map((yAxis) => {
      const settingsForYAxis = yAxisSettings?.[yAxis] || {
        function: 'Median',
        color: '#6092C0',
        format: 'Default',
        side: 'Auto',
      };

      const yData = data.map((row) => parseFloat(row[yAxis]?.replace(/[^0-9.]/g, '') || 0));

      return {
        name: `${settingsForYAxis.function} of ${yAxis}`,
        type: chartType === 'bar-horizontal' ? 'bar' : chartType,
        data: yData,
        itemStyle: { color: settingsForYAxis.color || '#6092C0' },
        label: {
          show: true,
          fontSize: 10,
          position: chartType === 'bar-horizontal' ? 'right' : 'top',
          formatter: (params) => formatValue(params.value, settingsForYAxis.format),
        },
      };
    });
  }, [data, yAxes, yAxisSettings, chartType, pieSettings, settings.dataCalculation]);

  // ECharts options
  const chartOptions = useMemo(() => {
    return {
      tooltip: {},
      xAxis: {
        type: chartType === 'bar-horizontal' ? 'value' : 'category', // X축이 값으로 설정
        data: chartType === 'pie' ? undefined : xData,
      },
      yAxis: {
        type: chartType === 'bar-horizontal' ? 'category' : 'value', // Y축을 category로 수정
        data: chartType === 'bar-horizontal' ? xData : undefined, // Y축에 도시 이름 (xData)
      },
      series: yDataSeries,
    };
  }, [xData, yDataSeries, chartType]);
  
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
            <th key={yAxis} className="border px-4 py-2">
              {yAxis}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td className="border px-4 py-2">{index + 1}</td>
            <td className="border px-4 py-2">{row[xAxis]}</td>
            {yAxes.map((yAxis) => (
              <td key={yAxis} className="border px-4 py-2">
                {row[yAxis]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Initialize or update chart
  useEffect(() => {
    const chartDom = document.getElementById('chart');
    if (chartDom) {
      const myChart = echarts.init(chartDom);
      myChart.setOption(chartOptions);

      return () => {
        myChart.dispose();
      };
    }
  }, [chartOptions]);

  return (
    <div>
      {chartType === 'table' ? (
        renderTable()
      ) : (
        <div id="chart" ref={chartRef} style={{ width: '100%', height: '400px' }} />
      )}
    </div>
  );
};

export default Chart;

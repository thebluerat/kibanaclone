'use client';

import React, { useState, useMemo } from 'react';
import DataTable from '../components/DataTable';
import UploadButton from '../components/UploadButton';
import Chart from '../components/Chart';
import ChartEditor from '../components/ChartEditor';
import { parseCSV } from '../utils/csvParser';
import PieChartSettings from '../components/PieChartSettings';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [xAxis, setXAxis] = useState('');
  const [yAxes, setYAxes] = useState([]);
  const [chartType, setChartType] = useState('bar');
  const [yAxisSettings, setYAxisSettings] = useState({});
  const [pieSettings, setPieSettings] = useState({ labelPosition: 'outside' });

  const handleUpload = (csvData) => {
    const parsedData = parseCSV(csvData);
    setData(parsedData);
  };

  const headers = useMemo(() => (data.length > 0 ? Object.keys(data[0]) : []), [data]);

  const handleFieldDropToChart = (field) => {
    if (!yAxes.includes(field)) {
      setYAxes([...yAxes, field]);
    }
  };

  const handleFieldDropWithinEditor = (axis, field) => {
    if (axis === 'x') {
      setXAxis(field);
    } else if (axis === 'y' && !yAxes.includes(field)) {
      setYAxes([...yAxes, field]);
    }
  };

  const handleRemoveYAxis = (field) => {
    setYAxes(yAxes.filter((f) => f !== field));
  };

  const handleYAxisSettingsChange = (newSettings) => {
    setYAxisSettings(newSettings);
  };

  const handlePieSettingsChange = (newSettings) => {
    setPieSettings((prevSettings) => ({ ...prevSettings, ...newSettings }));
  };

  return (
    <div className="flex h-full">
      <div className="w-1/4 bg-gray-100 p-4 overflow-scroll">
        <h1 className="text-lg font-bold mb-4">데이터 필드</h1>
        <UploadButton onUpload={handleUpload} />
        {data.length > 0 && <DataTable headers={headers} onFieldDrop={handleFieldDropToChart} />}
      </div>

      <div className="w-3/4 p-4 flex">
        <div
          className="w-2/3 p-4 border"
          onDrop={(e) => {
            e.preventDefault();
            const field = e.dataTransfer.getData('field');
            handleFieldDropToChart(field);
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <Chart
            data={data}
            xAxis={xAxis}
            yAxes={yAxes}
            chartType={chartType}
            yAxisSettings={yAxisSettings}
            pieSettings={pieSettings}
          />
        </div>

        <div className="w-1/3 p-4">
          <ChartEditor
            xAxis={xAxis}
            yAxes={yAxes}
            onFieldDrop={handleFieldDropWithinEditor}
            onRemoveYAxis={handleRemoveYAxis}
            chartType={chartType}
            onChartTypeChange={setChartType}
            onYAxisSettingsChange={handleYAxisSettingsChange}
            yAxisSettings={yAxisSettings}
            pieSettings={pieSettings}
            onPieSettingsChange={handlePieSettingsChange}
          />
          {chartType === 'pie' && (
            <PieChartSettings
              settings={pieSettings}
              onSettingsChange={handlePieSettingsChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import DataTable from '../../../components/DataTable';
import Chart from '../../../components/Chart';
import ChartEditor from '../../../components/ChartEditor';
import { parseCSV } from '../../../utils/csvParser';
import PieChartSettings from '../../../components/PieChartSettings';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [xAxis, setXAxis] = useState('');
  const [yAxes, setYAxes] = useState([]);
  const [chartType, setChartType] = useState('bar');
  const [yAxisSettings, setYAxisSettings] = useState({});
  const [pieSettings, setPieSettings] = useState({ labelPosition: 'outside' });
  const [files, setFiles] = useState([]); // 업로드된 파일 목록
  const [chartName, setChartName] = useState(''); // 차트 이름
  const [selectedFile, setSelectedFile] = useState(null); // 선택된 파일

  // 업로드된 파일 목록 가져오기
  useEffect(() => {
    const fetchFiles = async () => {
      const response = await fetch('/api/upload'); // 업로드된 파일 목록을 가져오는 API 호출
      const result = await response.json();
      setFiles(result.files); // 파일 목록 저장
    };

    fetchFiles();
  }, []);

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

  // 선택된 파일의 CSV 데이터 읽기
  const handleFileSelect = async (fileName) => {
    const file = files.find((f) => f.fileName === fileName);
    const response = await fetch(file.filePath);
    const csvData = await response.text();
    handleUpload(csvData); // 선택한 파일의 데이터를 업로드
  };

  // 차트를 저장하는 함수
  const saveChart = async () => {
    if (!chartName) {
      alert('차트 이름을 입력해주세요.');
      return;
    }
  
    const chartData = {
      name: chartName,
      data: {
        xAxis, // xAxis 그대로 사용
        yAxes, // yAxes 그대로 사용
        chartType,
        yAxisSettings,
        pieSettings,
        data: data.map(item => {
          // item의 키와 값들을 그대로 사용
          return { ...item }; 
        }),
      },
    };
  
    try {
      const response = await fetch('/api/charts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chartData),
      });
  
      if (!response.ok) {
        throw new Error(`차트 저장에 실패했습니다: ${response.statusText}`);
      }
  
      alert('차트가 저장되었습니다!');
      setChartName('');
    } catch (error) {
      alert(error.message);
      console.error('Error:', error);
    }
  };
  

  return (
    <div className="flex h-full">
      <div className="w-1/4 bg-gray-100 p-4 min-h-screen overflow-scroll">
        <h1 className="text-lg font-bold mb-4">데이터 필드</h1>
        
        {/* 업로드된 파일 선택 */}
        <label htmlFor="fileSelect">업로드된 CSV 파일 선택:</label>
        <select id="fileSelect" onChange={(e) => handleFileSelect(e.target.value)}>
          <option value="">파일 선택</option>
          {files.map((file) => (
            <option key={file.fileName} value={file.fileName}>
              {file.fileName}
            </option>
          ))}
        </select>

        {data.length > 0 && <DataTable headers={headers} onFieldDrop={handleFieldDropToChart} />}
      </div>

      <div className="flex-1 p-4 flex min-h-screen">
        <div
          className="w-2/3 p-4 border"
          onDrop={(e) => {
            e.preventDefault();
            const field = e.dataTransfer.getData('field');
            if (field) {
              handleFieldDropToChart(field);
            }
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

          {/* 차트 이름 입력 필드 추가 */}
          <div className="mt-4">
            <label htmlFor="chartName">차트 이름:</label>
            <input
              id="chartName"
              type="text"
              value={chartName}
              onChange={(e) => setChartName(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 w-full"
              placeholder="차트 이름 입력"
            />
            <button
              onClick={saveChart}
              className="mt-2 bg-blue-500 text-white rounded px-4 py-1"
            >
              차트 저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

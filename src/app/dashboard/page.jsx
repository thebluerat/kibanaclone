'use client';

import { useState } from 'react';
import DataTable from '../components/DataTable';
import UploadButton from '../components/UploadButton';
import Chart from '../components/Chart';
import ChartEditor from '../components/ChartEditor';
import { parseCSV } from '../utils/csvParser';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [xAxis, setXAxis] = useState('');
  const [yAxes, setYAxes] = useState([]);  // Y축을 여러 개로 설정
  const [chartType, setChartType] = useState('bar');
  const [yAxisSettings, setYAxisSettings] = useState({}); // Y축 설정 저장

  // CSV 데이터 업로드 핸들러
  const handleUpload = (csvData) => {
    const parsedData = parseCSV(csvData);
    setData(parsedData);
  };

  // DataTable에서 필드가 차트 영역으로 드롭되었을 때 Y축에 추가
  const handleFieldDropToChart = (field) => {
    if (!yAxes.includes(field)) {
      setYAxes([...yAxes, field]);  // 드롭된 필드를 Y축에 추가
    }
  };

  // ChartEditor 내부에서 필드를 드래그 앤 드롭하여 축 변경
  const handleFieldDropWithinEditor = (axis, field) => {
    if (axis === 'x') {
      setXAxis(field);
    } else if (axis === 'y' && !yAxes.includes(field)) {
      setYAxes([...yAxes, field]);
    }
  };

  // Y축에서 필드를 제거하는 함수
  const handleRemoveYAxis = (field) => {
    setYAxes(yAxes.filter((f) => f !== field));
  };

  // Y축 필드 설정 변경 핸들러
  const handleYAxisSettingsChange = (newSettings) => {
    setYAxisSettings(newSettings); // Y축 설정을 업데이트
  };

  // CSV 데이터의 첫 번째 객체에서 헤더를 추출
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="flex h-full">
      {/* 왼쪽: 데이터 업로드 및 필드 목록 */}
      <div className="w-1/4 bg-gray-100 p-4 overflow-scroll">
        <h1 className="text-lg font-bold mb-4">데이터 필드</h1>
        <UploadButton onUpload={handleUpload} />
        {data.length > 0 && <DataTable headers={headers} onFieldDrop={handleFieldDropToChart} />}
      </div>

      {/* 오른쪽: 차트와 차트 편집기 */}
      <div className="w-3/4 p-4 flex">
        <div
          className="w-2/3 p-4 border"
          onDrop={(e) => {
            e.preventDefault();
            const field = e.dataTransfer.getData('field');
            handleFieldDropToChart(field); // 필드가 차트 영역에 드롭되었을 때 처리
          }}
          onDragOver={(e) => e.preventDefault()} // 드롭 가능하도록 설정
        >
          <Chart
            data={data}
            xAxis={xAxis}
            yAxes={yAxes}
            chartType={chartType}
            yAxisSettings={yAxisSettings} // 차트에 Y축 설정 전달
          />
        </div>

        <div className="w-1/3 p-4">
          <ChartEditor
            xAxis={xAxis}
            yAxes={yAxes}
            onFieldDrop={handleFieldDropWithinEditor} // ChartEditor 안에서 필드 이동 처리
            onRemoveYAxis={handleRemoveYAxis}  // Y축에서 필드 제거
            chartType={chartType}
            onChartTypeChange={setChartType}
            onYAxisSettingsChange={handleYAxisSettingsChange} // Y축 설정 변경 전달
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

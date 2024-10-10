'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '../../../../../components/DataTable';
import Chart from '../../../../../components/Chart';
import ChartEditor from '../../../../../components/ChartEditor';
import CreateVisualizationModal from '../../../../../components/modals/createVisualizationModal';

const EditChart = ({ params }) => {
  const router = useRouter();
  const { chartId } = params;
  const decodedChartId = decodeURIComponent(chartId);
  const [chartData, setChartData] = useState(null);
  const [xAxis, setXAxis] = useState('');
  const [yAxes, setYAxes] = useState([]);
  const [chartType, setChartType] = useState('bar-horizontal'); // 기본 차트 타입
  const [yAxisSettings, setYAxisSettings] = useState({});
  const [pieSettings, setPieSettings] = useState({ labelPosition: 'outside' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const response = await fetch(`/api/charts/get/${decodedChartId}`);
        if (!response.ok) {
          throw new Error('차트를 불러오는 데 실패했습니다.');
        }
        const data = await response.json();
        setChartData(data);

        // 안전하게 데이터 설정
        setXAxis(data.xAxis); // X축 설정
        setYAxes(data.yAxes); // Y축 설정
        setChartType(data.chartType || 'bar-horizontal');
        setYAxisSettings(data.yAxisSettings || {});
        setPieSettings(data.pieSettings || { labelPosition: 'outside' });
        
        console.log(data); // 데이터 확인
      } catch (error) {
        console.error(error);
      }
    };

    fetchChart();
  }, [decodedChartId]);

  // 데이터가 로딩 중일 때 표시할 부분
  if (!chartData || !chartData.data) {
    return <div>로딩 중...</div>;
  }

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

  // 차트 타입 변경 핸들러
  const handleChartTypeChange = (newType) => {
    setChartType(newType);
  };

  const saveChart = async ({ title, description, dashboard, addToLibrary }) => {
    const chartDataToSave = {
      name: title,
      description,
      dashboard,
      addToLibrary,
      data: {
        xAxis: xAxis.replace(/"/g, ''), // X축에서 불필요한 따옴표 제거
        yAxes: yAxes.map(axis => axis.replace(/"/g, '')), // Y축에서 불필요한 따옴표 제거
        chartType,
        yAxisSettings,
        pieSettings,
        data: chartData.data.map(item => {
          return Object.fromEntries(
            Object.entries(item).map(([key, value]) => [key.replace(/"/g, ''), value])
          );
        }),
      },
    };

    try {
      const response = await fetch(`/api/charts/put/${decodedChartId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chartDataToSave),
      });

      if (!response.ok) {
        throw new Error(`차트 저장에 실패했습니다: ${response.statusText}`);
      }

      alert('차트가 저장되었습니다!');
      router.push('/dashboard'); // 저장 후 대시보드로 리디렉션
    } catch (error) {
      alert(error.message);
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-1/4 bg-gray-100 p-4 min-h-screen overflow-scroll">
        <h1 className="text-lg font-bold mb-4">데이터 필드</h1>
        {chartData.data.length > 0 && (
          <DataTable headers={Object.keys(chartData.data[0] || {})} />
        )}
      </div>
  
      <div className="flex-1 p-4 flex min-h-screen">
        <div className="w-2/3 p-4 border">
          {chartData && chartData.data.length > 0 ? (
            <Chart
              data={chartData.data} // 실제 데이터
              xAxis={xAxis} // X축 데이터로 변경
              yAxes={yAxes} // Y축 데이터로 변경
              chartType={chartType} // 상태에서 직접 읽음
              yAxisSettings={yAxisSettings} // 상태에서 직접 읽음
              pieSettings={pieSettings} // 상태에서 직접 읽음
            />
          ) : (
            <div>로딩 중...</div> // 데이터가 없을 때 표시
          )}
        </div>
  
        <div className="w-1/3 p-4">
          <ChartEditor
            xAxis={xAxis}
            yAxes={yAxes}
            onFieldDrop={handleFieldDropWithinEditor}
            onRemoveYAxis={handleRemoveYAxis}
            onYAxisSettingsChange={handleYAxisSettingsChange}
            yAxisSettings={yAxisSettings}
            pieSettings={pieSettings}
            onPieSettingsChange={handlePieSettingsChange}
            onChartTypeChange={handleChartTypeChange} // 차트 타입 변경 핸들러 전달
            chartType={chartType} // 현재 차트 타입 상태
          />
          <button onClick={openModal}>차트 저장</button>
        </div>
      </div>
  
      {isModalOpen && (
        <CreateVisualizationModal
          onClose={closeModal}
          onSave={saveChart}
        />
      )}
    </div>
  );
};

export default EditChart;

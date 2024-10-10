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
  const [chartType, setChartType] = useState('bar');
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
        setXAxis(data.data?.xAxis || '');
        setYAxes(data.data?.yAxes || []);
        setChartType(data.data?.chartType || 'bar');
        setYAxisSettings(data.data?.yAxisSettings || {});
        setPieSettings(data.data?.pieSettings || { labelPosition: 'outside' });

        console.log(data.data); // 데이터 확인

      } catch (error) {
        console.error(error);
      }
    };

    fetchChart();
  }, [decodedChartId]);

  if (!chartData || !chartData.data) {
    return <div>로딩 중...</div>; // 데이터가 로딩 중일 때
  }

  const handleYAxisSettingsChange = (newSettings) => {
    setYAxisSettings(newSettings);
  };

  const handlePieSettingsChange = (newSettings) => {
    setPieSettings((prevSettings) => ({ ...prevSettings, ...newSettings }));
  };

  const saveChart = async ({ title, description, dashboard, addToLibrary }) => {
    const chartDataToSave = {
      name: title,
      description,
      dashboard,
      addToLibrary,
      data: {
        xAxis,
        yAxes,
        chartType,
        yAxisSettings,
        pieSettings,
        data: chartData.data.data.map((item) => ({ ...item })), // chartData에서 데이터를 추출
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
    } catch (error) {
      alert(error.message);
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-1/4 bg-gray-100 p-4 min-h-screen overflow-scroll">
        <h1 className="text-lg font-bold mb-4">데이터 필드</h1>

        {/* 데이터 테이블 */}
        {chartData.data.data && chartData.data.data.length > 0 && (
          <DataTable headers={Object.keys(chartData.data.data[0] || {})} />
        )}
      </div>

      <div className="flex-1 p-4 flex min-h-screen">
        <div className="w-2/3 p-4 border">
          <Chart
            data={chartData.data} // 실제 데이터
            xAxis={chartData.xAxis} // X축 데이터
            yAxes={chartData.yAxes} // Y축 데이터
            chartType={chartData.chartType} // 차트 타입
            yAxisSettings={chartData.yAxisSettings} // Y축 설정
            pieSettings={chartData.pieSettings} // 파이 차트 설정 (있다면)
          />
        </div>

        <div className="w-1/3 p-4">
          <ChartEditor
            xAxis={xAxis}
            yAxes={yAxes}
            onYAxisSettingsChange={handleYAxisSettingsChange}
            yAxisSettings={yAxisSettings}
            pieSettings={pieSettings}
            onPieSettingsChange={handlePieSettingsChange}
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

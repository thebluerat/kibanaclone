import React, { useState } from 'react';
import YAxisSettings from './YAxisSettings';
import PieChartSettings from './PieChartSettings';

const ChartEditor = ({
  xAxis,
  yAxes,
  onFieldDrop,
  onRemoveYAxis,
  chartType,
  onChartTypeChange,
  onYAxisSettingsChange,
  yAxisSettings,
  pieSettings,
  onPieSettingsChange,
}) => {
  const [settingsField, setSettingsField] = useState(null);
  const [settingsForEdit, setSettingsForEdit] = useState(null);

  const handleDrop = (e, axis) => {
    e.preventDefault(); // 기본 드롭 동작 방지
    const field = e.dataTransfer.getData('field'); // 드래그된 필드 가져오기
    if (field) {
      onFieldDrop(axis, field); // 필드 드롭 처리

      if (axis === 'y' && !yAxisSettings[field]) {
        const defaultSettings = {
          field,
          function: 'Median',
          format: 'Default',
          color: '#6092C0',
          side: 'Auto',
        };
        onYAxisSettingsChange((prevSettings) => ({
          ...prevSettings,
          [field]: defaultSettings,
        }));
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // 드래그 오버 시 기본 동작 방지
  };

  const handleDragStart = (e, field) => {
    e.dataTransfer.setData('field', field); // 드래그 시작 시 필드 저장
  };

  const handleDoubleClick = (yAxis) => {
    setSettingsField(yAxis);
    setSettingsForEdit(yAxisSettings[yAxis] || {});
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="mb-4">
        <label className="block mb-2">차트 유형 선택</label>
        <select
          value={chartType}
          onChange={(e) => onChartTypeChange(e.target.value)}
          className="p-2 border"
        >
          <option value="bar">Bar Chart</option>
          <option value="bar-horizontal">Bar Horizontal Chart</option>
          <option value="line">Line Chart</option>
          <option value="pie">Pie Chart</option>
          <option value="table">Table</option>
        </select>
      </div>

      {chartType === 'pie' ? (
        <PieChartSettings
          settings={pieSettings}
          onSettingsChange={onPieSettingsChange}
        />
      ) : (
        <>
          <div className="mb-4">
            <label className="block mb-2">X축 선택</label>
            <div
              className="p-4 border h-12 flex items-center justify-center"
              onDrop={(e) => handleDrop(e, 'x')}
              onDragOver={handleDragOver}
              draggable
              onDragStart={(e) => handleDragStart(e, xAxis)}
            >
              {xAxis || 'X축에 필드를 드래그 앤 드롭하세요'}
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Y축 선택 (여러 필드 가능)</label>
            {yAxes.map((yAxis) => (
              <div
                key={yAxis}
                className="p-4 border h-12 flex items-center justify-between"
                onDrop={(e) => handleDrop(e, 'y')}
                onDragOver={handleDragOver}
                draggable
                onDragStart={(e) => handleDragStart(e, yAxis)}
                onDoubleClick={() => handleDoubleClick(yAxis)}
              >
                {yAxis}
                <button
                  onClick={() => onRemoveYAxis(yAxis)}
                  className="ml-4 p-2 bg-red-500 text-white"
                >
                  삭제
                </button>
              </div>
            ))}
            <div
              className="p-4 border h-12 flex items-center justify-center mt-4"
              onDrop={(e) => handleDrop(e, 'y')}
              onDragOver={handleDragOver}
            >
              Y축에 필드를 드래그 앤 드롭하세요
            </div>
          </div>
        </>
      )}

      {settingsField && (
        <YAxisSettings
          field={settingsField}
          settings={settingsForEdit}
          onClose={() => setSettingsField(null)}
          onSettingsChange={(settings) =>
            onYAxisSettingsChange({ ...yAxisSettings, [settingsField]: settings })
          }
        />
      )}
    </div>
  );
};

export default ChartEditor;

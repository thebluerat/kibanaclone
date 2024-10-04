import { useState } from 'react';
import YAxisSettings from './YAxisSettings';

const ChartEditor = ({ xAxis, yAxes, onFieldDrop, onRemoveYAxis, chartType, onChartTypeChange, onYAxisSettingsChange, yAxisSettings = {} }) => {
  const [settingsField, setSettingsField] = useState(null); // Y축 필드 설정 팝업 상태 관리
  const [settingsForEdit, setSettingsForEdit] = useState(null); // 설정할 필드의 현재 설정

  // 필드를 드래그 앤 드롭으로 축 변경
  const handleDrop = (e, axis) => {
    e.preventDefault();
    const field = e.dataTransfer.getData('field');
    if (field) {
      onFieldDrop(axis, field);

      // 새로운 Y축 필드를 드롭할 때 기존 설정을 유지하면서 새로운 필드를 추가
      if (axis === 'y' && !yAxisSettings[field]) {
        const defaultSettings = {
          field,
          function: 'Median',
          format: 'Default',
          color: '#6092C0',
          side: 'Auto',
        };
        // 기존 설정과 병합하여 새로운 필드를 추가
        onYAxisSettingsChange((prevSettings) => ({
          ...prevSettings, // 기존 설정 유지
          [field]: defaultSettings, // 새로운 필드 추가
        }));
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragStart = (e, field) => {
    e.dataTransfer.setData('field', field); // 필드 드래그 시작
  };

  // Y축 필드 설정 변경 핸들러
  const handleSettingsChange = (field, settings) => {
    // 현재 상태를 기반으로 새로운 설정 병합
    onYAxisSettingsChange((prevSettings) => ({
      ...prevSettings, // 이전 상태를 유지
      [field]: { ...prevSettings[field], ...settings }, // 새로운 필드 설정 병합
    }));
  };

  // Y축 필드 더블 클릭 시 팝업을 열고, 기존 설정 값을 로드
  const handleDoubleClick = (yAxis) => {
    setSettingsField(yAxis);
    setSettingsForEdit(yAxisSettings[yAxis] || {}); // 현재 설정을 로드
  };

  return (
    <div className="w-full h-screen flex-row">
      <div className="mb-4">
        <label className="block mb-2">차트 유형 선택</label>
        <select
          value={chartType}
          onChange={(e) => onChartTypeChange(e.target.value)}
          className="p-2 border"
        >
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
      </div>

      {/* Pie 차트가 아닌 경우에만 X축과 Y축 선택 가능 */}
      {chartType !== 'pie' && (
        <>
          <div className="mb-4">
            <label className="block mb-2">X축 선택</label>
            <div
              className="p-4 border h-12 flex items-center justify-center"
              onDrop={(e) => handleDrop(e, 'x')} // X축으로 드롭 가능
              onDragOver={handleDragOver}
              draggable
              onDragStart={(e) => handleDragStart(e, xAxis)} // X축 필드 드래그 시작
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
                onDrop={(e) => handleDrop(e, 'y')} // Y축으로 드롭 가능
                onDragOver={handleDragOver}
                draggable
                onDragStart={(e) => handleDragStart(e, yAxis)} // Y축 필드 드래그 시작
                onDoubleClick={() => handleDoubleClick(yAxis)} // Y축 필드 더블 클릭 시 설정창 열기
              >
                {yAxis}
                <button onClick={() => onRemoveYAxis(yAxis)} className="ml-4 p-2 bg-red-500 text-white">
                  삭제
                </button>
              </div>
            ))}

            <div
              className="p-4 border h-12 flex items-center justify-center mt-4"
              onDrop={(e) => handleDrop(e, 'y')} // Y축으로 드롭 가능
              onDragOver={handleDragOver}
            >
              Y축에 필드를 드래그 앤 드롭하세요
            </div>
          </div>
        </>
      )}

      {/* Y축 필드 설정을 위한 팝업 */}
      {settingsField && (
        <YAxisSettings
          field={settingsField}
          settings={settingsForEdit} // 기존 설정을 팝업으로 전달
          onClose={() => setSettingsField(null)} // 설정창 닫기
          onSettingsChange={(settings) => handleSettingsChange(settingsField, settings)} // 설정 변경
        />
      )}
    </div>
  );
};

export default ChartEditor;

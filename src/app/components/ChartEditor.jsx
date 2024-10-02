import { useCallback } from 'react';

const ChartEditor = ({ xAxis, yAxes, onFieldDrop, onRemoveYAxis, chartType, onChartTypeChange }) => {

  // ChartEditor 안에서 축을 드래그 앤 드롭으로 변경
  const handleDrop = (e, axis) => {
    const field = e.dataTransfer.getData('field');
    if (field) {
      onFieldDrop(axis, field); // 드롭된 필드를 X축 또는 Y축으로 설정
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragStart = (e, field) => {
    e.dataTransfer.setData('field', field); // X축 또는 Y축 필드를 드래그할 수 있게 함
  };

  return (
    <div className="w-full flex-row">
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

            {/* 여러 개의 Y축 필드를 표시 */}
            {yAxes.map((yAxis) => (
              <div
                key={yAxis}
                className="p-4 border h-12 flex items-center justify-between"
                onDrop={(e) => handleDrop(e, 'y')} // Y축으로 드롭 가능
                onDragOver={handleDragOver}
                draggable
                onDragStart={(e) => handleDragStart(e, yAxis)} // Y축 필드 드래그 시작
              >
                {yAxis}

                {/* Y축 필드를 제거하는 버튼 */}
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
    </div>
  );
};

export default ChartEditor;

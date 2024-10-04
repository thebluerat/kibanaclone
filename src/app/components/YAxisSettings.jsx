import { useState, useEffect } from 'react';

const YAxisSettings = ({ field, settings, onClose, onSettingsChange, availableFields = [] }) => {
  const [selectedFunction, setSelectedFunction] = useState('Median');
  const [selectedField, setSelectedField] = useState(field);
  const [customName, setCustomName] = useState(`Median of ${field}`);
  const [valueFormat, setValueFormat] = useState('Default');
  const [seriesColor, setSeriesColor] = useState('#6092C0');
  const [axisSide, setAxisSide] = useState('Auto');

  // 팝업이 열릴 때 전달된 설정 값을 반영
  useEffect(() => {
    if (settings) {
      setSelectedFunction(settings.function || 'Median');
      setSelectedField(settings.field || field);
      setCustomName(settings.customName || `Median of ${field}`);
      setValueFormat(settings.format || 'Default');
      setSeriesColor(settings.color || '#6092C0');
      setAxisSide(settings.side || 'Auto');
    }
  }, [settings, field]);

  // 설정 값이 변경될 때마다 부모로 전달
  const handleApply = () => {
    onSettingsChange({
      field: selectedField,
      function: selectedFunction,
      customName,
      format: valueFormat,
      color: seriesColor,
      side: axisSide,
    });
    onClose(); // 설정이 완료되면 창 닫기
  };

  return (
    <div className="absolute top-0 left-0 bg-white shadow-lg p-4 z-10">
      <h2 className="text-lg font-bold mb-2">Vertical Axis Settings</h2>

      {/* Functions */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Functions</label>
        <select
          value={selectedFunction}
          onChange={(e) => setSelectedFunction(e.target.value)}
          className="w-full p-2 border"
        >
          <option value="Average">Average</option>
          <option value="Count">Count</option>
          <option value="Last Value">Last value</option>
          <option value="Maximum">Maximum</option>
          <option value="Median">Median</option>
          <option value="Minimum">Minimum</option>
          <option value="Percentile">Percentile</option>
          <option value="Percentile Rank">Percentile Rank</option>
          <option value="Standard Deviation">Standard deviation</option>
          <option value="Sum">Sum</option>
          <option value="Unique Count">Unique count</option>
        </select>
      </div>

      {/* Field 선택 */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Field</label>
        <select
          value={selectedField}
          onChange={(e) => setSelectedField(e.target.value)}
          className="w-full p-2 border"
        >
          {availableFields.length > 0 ? (
            availableFields.map((fieldOption) => (
              <option key={fieldOption} value={fieldOption}>
                {fieldOption}
              </option>
            ))
          ) : (
            <option disabled>No fields available</option>
          )}
        </select>
      </div>

      {/* Appearance (Name) */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Name</label>
        <input
          type="text"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          className="w-full p-2 border"
        />
      </div>

      {/* Value Format */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Value Format</label>
        <select
          value={valueFormat}
          onChange={(e) => setValueFormat(e.target.value)}
          className="w-full p-2 border"
        >
          <option value="Default">Default</option>
          <option value="Number">Number</option>
          <option value="Percent">Percent</option>
          <option value="Bits">Bits (1000)</option>
          <option value="Bytes">Bytes (1024)</option>
          <option value="Duration">Duration</option>
          <option value="Custom">Custom Format</option>
        </select>
      </div>

      {/* Series Color */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Series Color</label>
        <input
          type="color"
          value={seriesColor}
          onChange={(e) => setSeriesColor(e.target.value)}
          className="w-full p-2 border"
        />
        <span className="block mt-2">{seriesColor}</span>
      </div>

      {/* Axis Side */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Axis Side</label>
        <select
          value={axisSide}
          onChange={(e) => setAxisSide(e.target.value)}
          className="w-full p-2 border"
        >
          <option value="Auto">Auto</option>
          <option value="Left">Left</option>
          <option value="Right">Right</option>
        </select>
      </div>

      {/* 적용 및 닫기 버튼 */}
      <div className="flex justify-end">
        <button
          onClick={handleApply}
          className="bg-blue-500 text-white p-2 mr-2 rounded"
        >
          Apply
        </button>
        <button onClick={onClose} className="bg-gray-300 p-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default YAxisSettings;

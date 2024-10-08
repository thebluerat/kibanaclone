import React from 'react';

const PieChartSettings = ({ settings = {}, onSettingsChange = () => {} }) => {
  return (
    <div>
      <h2>Pie Chart Settings</h2>
      <label>
        라벨 위치:
        <select
          value={settings.labelPosition || 'outside'}
          onChange={(e) => onSettingsChange({ labelPosition: e.target.value })}
        >
          <option value="inside">Inside</option>
          <option value="outside">Outside</option>
        </select>
      </label>
      <br />
      <label>
        데이터 계산 방법:
        <select
          value={settings.dataCalculation || 'sum'}
          onChange={(e) => onSettingsChange({ dataCalculation: e.target.value })}
        >
          <option value="sum">합계 (Sum)</option>
          <option value="average">평균 (Average)</option>
          <option value="count">개수 (Count)</option>
          <option value="percentage">비율 (Percentage)</option>
        </select>
      </label>
    </div>
  );
};

export default PieChartSettings;

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
    </div>
  );
};

export default PieChartSettings;

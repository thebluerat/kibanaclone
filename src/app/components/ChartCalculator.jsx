import React from 'react';

// 데이터 계산 함수들
const calculateAverage = (data) => {
  if (!Array.isArray(data) || data.length === 0) return 0;
  const sum = data.reduce((acc, num) => acc + num, 0);
  return sum / data.length;
};

const calculateMedian = (data) => {
  if (!Array.isArray(data) || data.length === 0) return 0;
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

const calculateMaximum = (data) => {
  return Array.isArray(data) && data.length > 0 ? Math.max(...data) : null;
};

const calculateMinimum = (data) => {
  return Array.isArray(data) && data.length > 0 ? Math.min(...data) : null;
};

const calculateCount = (data) => {
  return Array.isArray(data) ? data.length : 0;
};

const calculateSum = (data) => {
  return Array.isArray(data) ? data.reduce((acc, num) => acc + num, 0) : 0;
};

const calculateUniqueCount = (data) => {
  return Array.isArray(data) ? new Set(data).size : 0;
};


// ChartCalculator 컴포넌트
const ChartCalculator = ({ data, functionType }) => {
  const calculateResult = () => {
    switch (functionType) {
      case 'Average':
        return calculateAverage(data);
      case 'Median':
        return calculateMedian(data);
      case 'Maximum':
        return calculateMaximum(data);
      case 'Minimum':
        return calculateMinimum(data);
      case 'Count':
        return calculateCount(data);
      case 'Sum':
        return calculateSum(data);
      case 'Unique Count':
        return calculateUniqueCount(data);
      default:
        return null;
    }
  };

  const result = calculateResult();

  return (
    <div>
      <h2>Calculation Result</h2>
      <p>{`Result (${functionType}): ${result}`}</p>
    </div>
  );
};

export default ChartCalculator;

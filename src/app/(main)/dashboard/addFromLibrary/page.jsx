'use client';

import React, { useEffect, useState } from 'react';

const AddFromLibrary = ({ onClose }) => {
  const [charts, setCharts] = useState([]); // 전체 차트 목록
  const [filteredCharts, setFilteredCharts] = useState([]); // 필터링된 차트 목록
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChartType, setSelectedChartType] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  // 차트 목록 가져오기
  useEffect(() => {
    const fetchCharts = async () => {
        try {
          const response = await fetch('/api/charts/get');
          if (!response.ok) {
            throw new Error('네트워크 응답이 좋지 않습니다.');
          }
          const data = await response.json();
          console.log('Fetched charts:', data); // 데이터 확인
          
          // data.charts 배열로 설정
          setCharts(data.charts); // 전체 차트 목록 저장
          setFilteredCharts(data.charts); // 초기 필터링된 차트 목록 설정
        } catch (error) {
          console.error('차트 가져오기 오류:', error);
        }
      };

    fetchCharts();
  }, []);

  // 필터링 로직
  useEffect(() => {
    let filtered = Array.isArray(charts) ? charts : []; // charts가 배열인지 확인

    // 검색어로 필터링
    if (searchTerm) {
      filtered = filtered.filter((chart) =>
        chart.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 차트 타입으로 필터링
    if (selectedChartType) {
      filtered = filtered.filter((chart) => chart.chartType === selectedChartType);
    }

    // 태그로 필터링
    if (selectedTags.length > 0) {
      filtered = filtered.filter((chart) =>
        selectedTags.every((tag) => chart.tags.includes(tag))
      );
    }

    setFilteredCharts(filtered);
  }, [charts, searchTerm, selectedChartType, selectedTags]);

  // 검색 버튼 클릭 시 호출되는 함수
  const handleSearch = () => {
    if (!Array.isArray(charts)) {
      console.error('charts는 배열이 아닙니다:', charts);
      return;
    }

    const filtered = charts.filter(chart =>
      chart.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCharts(filtered);
  };

  return (
    <div className="fixed top-0 right-0 w-1/3 bg-white shadow-lg p-4 h-full">
      <h2 className="text-lg font-bold">차트 라이브러리</h2>
      <button onClick={onClose} className="text-red-500">닫기</button>

      {/* 검색 필드 */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="차트 이름 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <button
          onClick={handleSearch} // 검색 버튼 클릭 시 호출
          className="bg-blue-500 text-white rounded p-2 mt-2 w-full"
        >
          검색
        </button>
      </div>

      {/* 차트 타입 선택 */}
      <div className="mt-4">
        <label htmlFor="chartType">차트 타입 선택:</label>
        <select
          id="chartType"
          value={selectedChartType}
          onChange={(e) => setSelectedChartType(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="">모두</option>
          <option value="bar">막대 차트</option>
          <option value="line">선 차트</option>
          {/* 필요한 차트 타입 추가 */}
        </select>
      </div>

      {/* 태그 선택 */}
      <div className="mt-4">
        <label htmlFor="tags">태그 선택:</label>
        <select
          id="tags"
          multiple
          value={selectedTags}
          onChange={(e) => {
            const options = e.target.options;
            const value = [];
            for (let i = 0; i < options.length; i++) {
              if (options[i].selected) {
                value.push(options[i].value);
              }
            }
            setSelectedTags(value);
          }}
          className="border rounded p-2 w-full"
        >
          {/* 태그 목록 추가 */}
          <option value="tag1">태그 1</option>
          <option value="tag2">태그 2</option>
          {/* 필요한 태그 추가 */}
        </select>
      </div>

      {/* 차트 목록 표시 */}
        <h3 className="font-bold mt-4">차트 목록</h3>
        <ul>
        {Array.isArray(filteredCharts) && filteredCharts.length > 0 ? (
            filteredCharts.map((chart) => (
            <li key={chart.filePath} className="flex justify-between border-b py-2">
                <span>{chart.name}</span>
                <span>{chart.filePath}</span>
            </li>
            ))
        ) : (
            <li className="py-2">차트가 없습니다.</li>
        )}
        </ul>
    </div>
  );
};

export default AddFromLibrary;

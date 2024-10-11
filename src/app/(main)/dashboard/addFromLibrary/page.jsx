'use client';

import React, { useEffect, useState } from 'react';

const AddFromLibrary = ({ onClose, onAddChart }) => {
    const [charts, setCharts] = useState([]); // 전체 차트 목록
    const [filteredCharts, setFilteredCharts] = useState([]); // 필터링된 차트 목록
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedChartType, setSelectedChartType] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);

    // Pagination 상태
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // 페이지당 항목 수

    // 차트 목록 가져오기
    useEffect(() => {
        const fetchCharts = async () => {
            try {
                const response = await fetch('/api/charts/getChartList'); // 차트 목록 가져오기
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
                chart.name && chart.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 차트 타입으로 필터링
        if (selectedChartType) {
            filtered = filtered.filter((chart) => chart.chartType === selectedChartType);
        }

        // 태그로 필터링
        if (selectedTags.length > 0) {
            filtered = filtered.filter((chart) =>
                selectedTags.every((tag) => chart.tags && chart.tags.includes(tag))
            );
        }

        setFilteredCharts(filtered);
    }, [charts, searchTerm, selectedChartType, selectedTags]);

    // 현재 페이지의 차트 목록 가져오기
    const indexOfLastChart = currentPage * itemsPerPage;
    const indexOfFirstChart = indexOfLastChart - itemsPerPage;
    const currentCharts = filteredCharts.slice(indexOfFirstChart, indexOfLastChart);

    // 페이지 수 계산
    const totalPages = Math.ceil(filteredCharts.length / itemsPerPage);

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 대시보드로 차트 불러오기 핸들러
    const handleLoadChart = (chartId) => {
        console.log('Loading chart with ID:', chartId); // chartId 출력
        onAddChart(chartId); // 대시보드에 차트 ID를 전달
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
                    onClick={() => { setCurrentPage(1); }} // 검색 시 첫 페이지로 이동
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
                {Array.isArray(currentCharts) && currentCharts.length > 0 ? (
                    currentCharts.map((chart) => (
                        <li key={chart.filePath} className="flex justify-between border-b py-2">
                            <span>{chart.title || chart.name}</span> {/* 차트 제목 표시: title 또는 name */}
                            <button
                                onClick={() => handleLoadChart(chart.id)} // 선택 버튼
                                className="bg-green-500 text-white rounded px-2"
                            >
                                선택
                            </button>
                        </li>
                    ))
                ) : (
                    <li className="py-2">차트가 없습니다.</li>
                )}
            </ul>

            {/* Pagination */}
            <div className="mt-4 flex justify-between">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            {/* 대시보드로 불러오기 버튼 */}
            <div className="mt-4">
                <button
                    onClick={() => console.log('대시보드로 차트 불러오기')} // 대시보드로 차트를 불러오는 로직 추가
                    className="bg-green-500 text-white rounded p-2 w-full"
                >
                    대시보드로 불러오기
                </button>
            </div>

            {/* 버튼 가시화 */}
            <div className="mt-4">
                <button
                    onClick={onClose}
                    className="bg-red-500 text-white rounded p-2 w-full"
                >
                    닫기
                </button>
            </div>
        </div>
    );
};

export default AddFromLibrary;

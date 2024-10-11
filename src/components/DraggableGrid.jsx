import React from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css'; // 스타일 적용
import 'react-resizable/css/styles.css'; // 리사이즈 기능 적용

const DraggableGrid = ({ children }) => {
  // children이 없거나 undefined인 경우 기본값으로 빈 배열 사용
  const validChildren = React.Children.toArray(children); // children을 배열로 변환

  // 그리드 레이아웃 설정
  const layout = validChildren.map((_, index) => ({
    i: index.toString(), // 각 아이템의 고유 ID
    x: (index % 4) * 3, // 그리드 내에서의 x 위치
    y: Math.floor(index / 4) * 3, // 그리드 내에서의 y 위치
    w: 3, // 너비
    h: 3, // 높이
  }));

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={12} // 그리드 전체 열의 개수
      rowHeight={100} // 각 행의 높이
      width={1200} // 그리드의 총 너비
      isDraggable={true} // 드래그 기능 활성화
      isResizable={true} // 리사이즈 기능 활성화
    >
      {validChildren.map((child, index) => (
        <div key={index.toString()}>{child}</div>
      ))}
    </GridLayout>
  );
};

export default DraggableGrid;

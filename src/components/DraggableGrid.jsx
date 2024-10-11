import React from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css'; // 스타일 적용
import 'react-resizable/css/styles.css'; // 리사이즈 기능 적용

const DraggableGrid = ({ children, onLayoutChange }) => {
  const validChildren = React.Children.toArray(children); // children을 배열로 변환

  const layout = validChildren.map((child, index) => ({
    i: child.key, // 고유 ID
    x: (index % 4) * 3, // 그리드 내에서의 x 위치
    y: Math.floor(index / 4) * 3, // 그리드 내에서의 y 위치
    w: 3, // 너비
    h: 3, // 높이
  }));

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={12}
      rowHeight={100}
      width={1200}
      isDraggable={true}
      isResizable={true}
      onLayoutChange={onLayoutChange} // 레이아웃 변경 시 호출될 함수
    >
      {validChildren.map((child, index) => (
        <div key={child.key}>{child}</div>
      ))}
    </GridLayout>
  );
};

export default DraggableGrid;

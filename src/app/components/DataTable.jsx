import { useMemo } from 'react';

const DataTable = ({ headers, onFieldDrop }) => {
  if (!headers || headers.length === 0) return <p>데이터가 없습니다</p>;

  const handleDragStart = (e, header) => {
    e.dataTransfer.setData('field', header); // 필드명을 드래그 데이터에 저장
  };

  return (
    <ul>
      {headers.map((header) => (
        <li
          key={header}
          className="mb-2 p-2 border cursor-pointer"
          draggable
          onDragStart={(e) => handleDragStart(e, header)}
        >
          {header}
        </li>
      ))}
    </ul>
  );
};

export default DataTable;

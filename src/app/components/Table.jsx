import React from 'react';

const Table = ({ data, headers }) => {
  return (
    <table className="min-w-full border-collapse border border-gray-200">
      <thead>
        <tr>
          {headers.map((header) => (
            <th
              key={header}
              className="border border-gray-200 p-2 text-left bg-gray-100 font-semibold"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} className="border-t border-gray-200">
            {headers.map((header) => (
              <td key={header} className="border border-gray-200 p-2">
                {row[header]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;

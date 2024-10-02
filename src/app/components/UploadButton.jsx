import { useState } from 'react';

const UploadButton = ({ onUpload }) => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // 파일 변경 시 파일 목록을 저장
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // 선택된 파일들을 배열로 변환
    setFiles(selectedFiles);
    setSelectedFile(selectedFiles[0]); // 첫 번째 파일을 기본 선택
  };

  // 선택된 파일을 처리
  const handleFileSelect = (e) => {
    const selectedFileName = e.target.value;
    const file = files.find((f) => f.name === selectedFileName);
    setSelectedFile(file); // 사용자가 선택한 파일을 설정
  };

  // CSV 파일을 업로드 처리
  const handleUpload = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvData = e.target.result;
        onUpload(csvData); // CSV 데이터를 업로드
      };
      reader.readAsText(selectedFile); // 파일을 텍스트로 읽기
    }
  };

  return (
    <div>
      {/* 파일 선택 */}
      <input type="file" accept=".csv" multiple onChange={handleFileChange} />

      {/* 파일 목록 표시 및 선택 */}
      {files.length > 0 && (
        <>
          <label htmlFor="fileSelect">선택한 CSV 파일:</label>
          <select id="fileSelect" onChange={handleFileSelect}>
            {files.map((file) => (
              <option key={file.name} value={file.name}>
                {file.name}
              </option>
            ))}
          </select>
        </>
      )}

      {/* 업로드 버튼 */}
      <button onClick={handleUpload} disabled={!selectedFile}>
        선택한 CSV 업로드
      </button>
    </div>
  );
};

export default UploadButton;

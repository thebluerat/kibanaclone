// 기본 API 라우트 함수
export default function handler(req, res) {
    if (req.method === 'GET') {
      // GET 요청 처리
      res.status(200).json({ message: 'This is a GET request' });
    } else if (req.method === 'POST') {
      // POST 요청 처리
      res.status(200).json({ message: 'This is a POST request' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }
  
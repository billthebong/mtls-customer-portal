import { useState } from 'react';
import axios from 'axios';
import './index.css';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState('');

  const apiBaseUrl = 'https://mtls-customer-portal-worker.bradford-jardine.workers.dev';

  const login = async () => {
    try {
      const response = await axios.post(`${apiBaseUrl}/api/login`, { username, password });
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      setError('');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const generateCertificate = async () => {
    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/certificates`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCertificates([...certificates, { id: response.data.certificateId, downloadToken: response.data.downloadToken }]);
      setError('');
    } catch (err) {
      setError('Failed to generate certificate');
    }
  };

  const downloadCertificate = async (downloadToken) => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/certificates/download/${downloadToken}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'certificate.pem');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('Failed to download certificate');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {!token ? (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4">mTLS Customer Portal Login</h1>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 mb-4 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            onClick={login}
          >
            Login
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4">Manage Certificates</h1>
          <button
            className="w-full bg-green-500 text-white p-2 rounded mb-4 hover:bg-green-600"
            onClick={generateCertificate}
          >
            Generate New Certificate
          </button>
          <ul>
            {certificates.map((cert) => (
              <li key={cert.id} className="mb-2">
                Certificate ID: {cert.id}
                <button
                  className="ml-4 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  onClick={() => downloadCertificate(cert.downloadToken)}
                >
                  Download
                </button>
              </li>
            ))}
          </ul>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default App;
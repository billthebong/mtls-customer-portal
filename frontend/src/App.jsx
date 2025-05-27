import { useState } from 'react';
import axios from 'axios';
import './index.css';

function App() {
  const apiBaseUrl = 'https://mtls-customer-portal-worker.bradford-jardine.workers.dev';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiBaseUrl}/api/login`, {
        username,
        password,
      });
      setToken(response.data.token);
      setError('');
    } catch (err) {
      setError('Invalid username or password');
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
      const response = await axios.get(
        `${apiBaseUrl}/api/certificates/download/${downloadToken}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'certificate.pem');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to download certificate');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-600 text-white">
      {!token ? (
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-gray-800">
          <h1 className="text-2xl font-bold text-center mb-6">mTLS Customer Portal Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
          {error && <p className="mt-4 text-center text-red-600">{error}</p>}
        </div>
      ) : (
        <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg text-gray-800">
          <h1 className="text-2xl font-bold text-center mb-6">mTLS Customer Portal</h1>
          <button
            onClick={generateCertificate}
            className="w-full py-2 mb-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Generate New Certificate
          </button>
          {certificates.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Certificates</h2>
              <ul className="space-y-2">
                {certificates.map((cert) => (
                  <li key={cert.id} className="flex justify-between items-center p-2 bg-gray-100 rounded-md">
                    <span>Certificate ID: {cert.id}</span>
                    <button
                      onClick={() => downloadCertificate(cert.downloadToken)}
                      className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      Download
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {error && <p className="mt-4 text-center text-red-600">{error}</p>}
        </div>
      )}
    </div>
  );
}

export default App;
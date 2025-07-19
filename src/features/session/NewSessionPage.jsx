import { useState } from 'react';
import { createSession, uploadDocuments } from '../../services/sessionService';
import { useNavigate } from 'react-router-dom';

export default function NewSessionPage() {
  const [name, setName] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      const res = await createSession(name);
      console.log('Session creation response:', res.data);
      setSessionId(res.data.session.id); // assuming the backend returns this key
      setStatus('Session created. Now upload your documents.');
    } catch {
      setStatus('Failed to create session.');
    }
  };

  const handleUpload = async () => {
    if (!files.length || !sessionId) return;
    try {
      setUploading(true);
      await uploadDocuments(sessionId, files);
      setStatus('Documents uploaded. Redirecting...');
      setTimeout(() => navigate(`/session/${sessionId}/topics`), 1500);
    } catch {
      setStatus('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Start New Session</h1>

      {!sessionId ? (
        <>
          <input
            type="text"
            placeholder="Session name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded w-full max-w-md mb-4"
          />
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Session
          </button>
        </>
      ) : (
        <>
          <p className="mb-2">Upload your documents:</p>
          <input
            type="file"
            multiple
            onChange={(e) => setFiles([...e.target.files])}
            className="mb-4"
          />
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </>
      )}

      {status && <p className="mt-4 text-gray-600">{status}</p>}
    </div>
  );
}

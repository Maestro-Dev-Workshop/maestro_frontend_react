import { useState } from 'react';
import { createSession, uploadDocuments } from '../../services/sessionService.js';

export default function NewSessionPage() {
  const [name, setName] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('');

  const handleCreate = async () => {
    setStatus('Creating session...');
    try {
      const res = await createSession(name);
      setSessionId(res.data.id);
      setStatus('Session created. Upload documents.');
    } catch {
      setStatus('Failed to create session.');
    }
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setStatus('Uploading documents...');
    try {
      await uploadDocuments(sessionId, files);
      setStatus('Documents uploaded successfully.');
    } catch {
      setStatus('Upload failed.');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Create New Session</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Session Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded w-full max-w-md"
        />
        <button
          onClick={handleCreate}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Session
        </button>
      </div>

      {sessionId && (
        <div className="mt-6">
          <input
            type="file"
            multiple
            onChange={(e) => setFiles([...e.target.files])}
            className="block mb-2"
          />
          <button
            onClick={handleUpload}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Upload Documents
          </button>
        </div>
      )}

      {status && <p className="mt-4 text-gray-700">{status}</p>}
    </div>
  );
}

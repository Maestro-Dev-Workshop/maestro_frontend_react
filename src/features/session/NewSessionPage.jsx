import { useState } from 'react';
import { createSession, uploadDocuments, labelDocuments } from '../../services/sessionService';
import { useNavigate } from 'react-router-dom';

export default function NewSessionPage() {
  const [name, setName] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [stage, setStage] = useState('create'); // 'create', 'upload', 'label'
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [labeling, setLabeling] = useState(false);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      const res = await createSession(name);
      console.log('Session creation response:', res.data);
      setSessionId(res.data.session.id); // assuming the backend returns this key
      setStage('upload');
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
      setStage('label')
      setStatus('Documents uploaded. Now label your documents.');
    } catch {
      setStatus('Upload failed');
    } finally {
      setUploading(false);
    }
  };
  
  const handleLabel = async () => {
    if (!sessionId) return;
    try {
      setLabeling(true);
      await labelDocuments(sessionId);
      setStatus('Documents labeled. You can now select topics.');
      setTimeout(() => navigate(`/session/${sessionId}/topics`), 1500);
    } catch {
      setStatus('Labeling failed');
    } finally {
      setLabeling(false);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Start New Session</h1>

      {/* If stage is 'create', prompt for session name and create button
      If stage is 'upload', prompt for file upload and upload button
      If stage is 'label', prompt for labeling documents and next button */}

      {stage === 'create' && (
        <div>
          <input
            type="text"
            placeholder="Session Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 mb-4 w-full"
          />
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Session
          </button>
        </div>
      )}
      {stage === 'upload' && (
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
      {stage === 'label' && (
        <>
          <p className="mb-2">Label your documents:</p>
          <button
            onClick={handleLabel}
            disabled={labeling}
            className="bg-yellow-600 text-white px-4 py-2 rounded"
          >
            {labeling ? 'Labeling...' : 'Label Documents'}
          </button>
        </>
      )}

      {/* Status message */}

      {status && <p className="mt-4 text-gray-600">{status}</p>}
    </div>
  );
}

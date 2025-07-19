import React, { useState } from 'react';
import { createSession, uploadDocuments, labelDocuments } from './sessionCreationService';
import { useNavigate } from 'react-router-dom';

const Step1SubjectMaterials = () => {
    const navigate = useNavigate();
    const [sessionName, setSessionName] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [files, setFiles] = useState([]);
    const [topics, setTopics] = useState([]);
    const [creating, setCreating] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [labeling, setLabeling] = useState(false);

    const handleCreateSession = async () => {
        if (!sessionName.trim()) return alert('Please enter a session name');
        setCreating(true);
        try {
            const { session_id } = await createSession(sessionName.trim());
            setSessionId(session_id);
            alert('Session created!');
        } catch (err) {
            alert('Error creating session');
        } finally {
            setCreating(false);
        }
    };

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const handleUpload = async () => {
        if (!sessionId) return alert('Create session first.');
        if (files.length === 0) return alert('Please select files.');

        setUploading(true);
        try {
            await uploadDocuments(sessionId, files);
            alert('Files uploaded!');
            await handleLabeling();
        } catch (err) {
            alert('Error uploading files');
        } finally {
            setUploading(false);
        }
    };

    const handleLabeling = async () => {
        setLabeling(true);
        try {
            const data = await labelDocuments(sessionId);
            setTopics(data.topics_identified || []);
            alert('Labeling complete!');
        } catch (err) {
            alert('Error labeling documents');
        } finally {
            setLabeling(false);
        }
    };

    const handleProceed = () => {
        if (topics.length === 0) return alert('Label documents first.');
        navigate(`/session-creation/${sessionId}/step-2`, { state: { topics } });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Step 1: Name Session & Upload Materials</h1>

            {!sessionId && (
                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="Session name"
                        value={sessionName}
                        onChange={(e) => setSessionName(e.target.value)}
                    />
                    <button onClick={handleCreateSession} disabled={creating}>
                        {creating ? 'Creating...' : 'Create Session'}
                    </button>
                </div>
            )}

            {sessionId && (
                <>
                    <div style={{ marginBottom: '20px' }}>
                        <h3>Upload Materials</h3>
                        <input type="file" multiple onChange={handleFileChange} />
                        <button onClick={handleUpload} disabled={uploading}>
                            {uploading ? 'Uploading...' : 'Upload & Label'}
                        </button>
                    </div>

                    {labeling && <p>Labeling documents...</p>}

                    {topics.length > 0 && (
                        <>
                            <h3>Identified Topics:</h3>
                            <ul>
                                {topics.map((topic, idx) => (
                                    <li key={idx}>{topic}</li>
                                ))}
                            </ul>
                            <button onClick={handleProceed}>Proceed to Step 2</button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Step1SubjectMaterials;

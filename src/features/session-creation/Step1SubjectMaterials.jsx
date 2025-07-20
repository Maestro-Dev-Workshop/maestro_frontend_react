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
            const { session } = await createSession(sessionName.trim());
            setSessionId(session.id);
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
            setFiles([]);  // reset files after upload
        } catch (err) {
            alert('Error uploading files');
        } finally {
            setUploading(false);
        }
    };

    const handleProceed = async () => {
        if (!sessionId) return alert('Session not created.');
        setLabeling(true);
        try {
            const data = await labelDocuments(sessionId);
            const result = data.result || [];
    
            // Flatten all topics across documents and deduplicate
            const topicsSet = new Set();
            result.forEach(doc => {
                (doc.topics_found || []).forEach(topic => topicsSet.add(topic));
            });
            const uniqueTopics = Array.from(topicsSet);
    
            setTopics(uniqueTopics);
            alert('Labeling complete!');
            navigate(`/session/create/step-2/${sessionId}`, { state: { topics: uniqueTopics } });
        } catch (err) {
            console.error('Labelling error:', err);
            alert('Error labeling documents');
        } finally {
            setLabeling(false);
        }
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
                        <h3>Upload Materials (You can upload multiple times)</h3>
                        <input type="file" multiple onChange={handleFileChange} />
                        <button onClick={handleUpload} disabled={uploading}>
                            {uploading ? 'Uploading...' : 'Upload Files'}
                        </button>
                    </div>

                    <button
                        onClick={handleProceed}
                        disabled={labeling}
                        style={{ marginTop: '20px', fontWeight: 'bold' }}
                    >
                        {labeling ? 'Labelling...' : 'Proceed to Step 2 (Label Documents)'}
                    </button>
                </>
            )}
        </div>
    );
};

export default Step1SubjectMaterials;

import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getTopics } from '../../services/topicService.js';
import { labelDocuments } from '../../services/sessionService.js'; // ✅ Import this

export default function TopicSelectionPage() {
  const { sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  
  const [topics, setTopics] = useState([]);
  const [selected, setSelected] = useState([]);
  const [status, setStatus] = useState('');
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    if (location.state?.topics) {
    setTopics(location.state.topics);
    return;
  }

  const fetchTopics = async () => {
    try {
      const res = await getTopics(sessionId);
      setTopics(res.data.topics);
    } catch {
      setStatus('Failed to load topics');
    }
  };

  fetchTopics();
}, [sessionId, location.state]);

  const handleToggle = (topic) => {
    setSelected((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSubmit = async () => {
    if (!selected.length) {
      alert('Please select at least one topic.');
      return;
    }

    try {
      console.log('Submitting selected topics:', selected);
      await labelDocuments(sessionId, selected); // ✅ Send selected as array of strings
      navigate(`/session/${sessionId}/exercises`);
    } catch (err) {
      console.error('Labeling failed:', err.response?.data || err.message);
      alert('Failed to submit topics. Make sure at least one is selected.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Select Topics</h1>

      <div className="mb-4">
        {topics.map((topic) => (
          <label key={topic} className="block">
            <input
              type="checkbox"
              value={topic}
              checked={selected.includes(topic)}
              onChange={() => handleToggle(topic)}
              className="mr-2"
            />
            {topic}
          </label>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Generate Lesson
      </button>

      {status && <p className="mt-4 text-gray-600">{status}</p>}

      {lesson && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Generated Lesson</h2>
          <p className="whitespace-pre-line text-gray-800">{lesson}</p>
        </div>
      )}
    </div>
  );
}

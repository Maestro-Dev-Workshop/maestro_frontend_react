import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTopics, selectTopics, generateLesson } from '../../services/topicService.js';

export default function TopicSelectionPage() {
  const { sessionId } = useParams();
  const [topics, setTopics] = useState([]);
  const [selected, setSelected] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await getTopics(sessionId);
        setTopics(res.data.topics);
      } catch {
        setStatus('Failed to load topics');
      }
    };
    fetchTopics();
  }, [sessionId]);

  const handleToggle = (topic) => {
    setSelected((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSubmit = async () => {
  if (!topics.length) return;
    try {
    // const topicNames = selectedTopics.map((t) => t.name); // or t.value if using react-select
    // console.log('Topics being submitted:', topicNames);

    await labelDocuments(sessionId);
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

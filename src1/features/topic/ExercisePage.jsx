import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getExercise, saveExerciseScore } from '../../services/exerciseService.js';
import { submitEssayAnswer } from '../../services/chatbotService.js';

export default function ExercisePage() {
  const { topicId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const res = await getExercise(topicId);
        setQuestions(res.data.setQuestions);
      } catch {
        setStatus('Failed to load exercise');
      }
    };
    fetchExercise();
  }, [topicId]);

  const handleChange = (qid, value) => {
    setAnswers({ ...answers, [qid]: value });
  };

  const handleSubmit = async () => {
    try {
      setStatus('Submitting...');
      for (let q of questions) {
        if (q.type === 'essay') {
          await submitEssayAnswer(q.id, answers[q.id] || '');
        }
      }
      await saveExerciseScore(topicId, {
        exercise_id: questions[0]?.exercise_id,
        score: 5, // placeholder
      });
      setStatus('Submitted successfully');
    } catch {
      setStatus('Submission failed');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Exercises</h1>
      {questions.map((q) => (
        <div key={q.id} className="mb-6 p-4 bg-white rounded shadow">
          <p className="font-medium mb-2">{q.question}</p>

          {q.type === 'multiple choice' &&
            q.options.map((opt) => (
              <label key={opt} className="block">
                <input
                  type="radio"
                  name={q.id}
                  value={opt}
                  checked={answers[q.id] === opt}
                  onChange={() => handleChange(q.id, opt)}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}

          {q.type === 'multiple selection' &&
            q.options.map((opt) => (
              <label key={opt} className="block">
                <input
                  type="checkbox"
                  value={opt}
                  checked={answers[q.id]?.includes(opt)}
                  onChange={(e) => {
                    const selected = answers[q.id] || [];
                    if (e.target.checked) {
                      handleChange(q.id, [...selected, opt]);
                    } else {
                      handleChange(q.id, selected.filter((o) => o !== opt));
                    }
                  }}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}

          {q.type === 'essay' && (
            <textarea
              rows={4}
              className="w-full border p-2 rounded"
              placeholder="Write your answer..."
              value={answers[q.id] || ''}
              onChange={(e) => handleChange(q.id, e.target.value)}
            />
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Submit Answers
      </button>

      {status && <p className="mt-4 text-gray-700">{status}</p>}
    </div>
  );
}

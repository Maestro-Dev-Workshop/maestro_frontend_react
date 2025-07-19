import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getExam, saveExamScore } from '../../services/examService.js';

export default function ExamPage() {
  const { sessionId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await getExam(sessionId);
        setQuestions(res.data);
      } catch {
        setStatus('Failed to load exam');
      }
    };
    fetchExam();
  }, [sessionId]);

  const handleChange = (qid, value) => {
    setAnswers({ ...answers, [qid]: value });
  };

  const handleSubmit = async () => {
    try {
      setStatus('Submitting exam...');
      await saveExamScore(sessionId, {
        exam_id: questions[0]?.exam_id,
        score: 8, // placeholder
      });
      setStatus('Exam submitted successfully');
    } catch {
      setStatus('Exam submission failed');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Exam</h1>
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
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit Exam
      </button>

      {status && <p className="mt-4 text-gray-700">{status}</p>}
    </div>
  );
}

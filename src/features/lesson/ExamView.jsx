import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExam, saveExamScore } from './lessonService';

const ExamView = () => {
    const { session_id } = useParams();
    const navigate = useNavigate();

    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(null);

    useEffect(() => {
        const fetchExam = async () => {
            setLoading(true);
            try {
                const data = await getExam(session_id);
                setExam(data);
            } catch (error) {
                alert('Failed to load exam');
            } finally {
                setLoading(false);
            }
        };

        fetchExam();
    }, [session_id]);

    const handleAnswerChange = (questionId, option) => {
        setAnswers({ ...answers, [questionId]: option });
    };

    const handleSubmit = async () => {
        if (!exam?.questions?.length) return;

        let correct = 0;
        exam.questions.forEach(q => {
            if (answers[q.id] && answers[q.id] === q.correct_answer) correct++;
        });
        const finalScore = (correct / exam.questions.length) * 100;
        setScore(finalScore);
        setSubmitted(true);

        try {
            await saveExamScore(session_id, exam.id, finalScore);
            alert(`Exam submitted. Score: ${finalScore.toFixed(2)}%`);
        } catch (err) {
            alert('Failed to save exam score.');
        }
    };

    const handleNavigation = (direction) => {
        setCurrentIndex((prev) => {
            const next = direction === 'next' ? prev + 1 : prev - 1;
            if (next < 0) return 0;
            if (next >= exam.questions.length) return exam.questions.length - 1;
            return next;
        });
    };

    if (loading) return <p>Loading exam...</p>;
    if (!exam) return <p>No exam found.</p>;

    const currentQuestion = exam.questions[currentIndex];

    return (
        <div>
            <h2>Exam: Question {currentIndex + 1} of {exam.questions.length}</h2>
            <p><strong>{currentQuestion.question}</strong></p>
            {currentQuestion.options.map((opt, idx) => (
                <div key={idx}>
                    <input
                        type="radio"
                        name={`q-${currentQuestion.id}`}
                        value={opt}
                        checked={answers[currentQuestion.id] === opt}
                        onChange={() => handleAnswerChange(currentQuestion.id, opt)}
                        disabled={submitted}
                    />
                    <label>{opt}</label>
                </div>
            ))}

            <div style={{ marginTop: '20px' }}>
                <button disabled={currentIndex === 0} onClick={() => handleNavigation('prev')}>Previous</button>
                <button disabled={currentIndex === exam.questions.length - 1} onClick={() => handleNavigation('next')} style={{ marginLeft: '10px' }}>Next</button>
            </div>

            {!submitted && (
                <div style={{ marginTop: '20px' }}>
                    <button onClick={handleSubmit}>Submit Exam</button>
                </div>
            )}

            {score !== null && (
                <p style={{ marginTop: '20px' }}><strong>Score: {score.toFixed(2)}%</strong></p>
            )}
        </div>
    );
};

export default ExamView;

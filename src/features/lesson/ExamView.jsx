import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExam, saveExamScore, scoreEssayAnswer } from './lessonService';

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
                setExam(data.exam);
            } catch (error) {
                alert('Failed to load exam');
            } finally {
                setLoading(false);
            }
        };

        fetchExam();
    }, [session_id]);

    const handleAnswerChange = (questionId, value, type) => {
        if (type === 'multiple selection') {
            const currentAnswers = answers[questionId] || [];
            if (currentAnswers.includes(value)) {
                setAnswers({
                    ...answers,
                    [questionId]: currentAnswers.filter(ans => ans !== value)
                });
            } else {
                setAnswers({
                    ...answers,
                    [questionId]: [...currentAnswers, value]
                });
            }
        } else {
            setAnswers({ ...answers, [questionId]: value });
        }
    };

    const handleSubmit = async () => {
        if (!exam?.questions?.length) return;

        let correct = 0;

        for (const q of exam.questions) {
            const userAnswer = answers[q.id];
            console.log(userAnswer)

            if (q.type === 'multiple choice') {
                const correctOption = q.options.find(opt => opt.correct);
                if (userAnswer === correctOption?.text) correct++;
            }

            if (q.type === 'multiple selection') {
                const correctAnswers = q.options.filter(opt => opt.correct).map(opt => opt.text).sort();
                const userAnswers = Array.isArray(userAnswer) ? userAnswer.sort() : [];
                if (JSON.stringify(correctAnswers) === JSON.stringify(userAnswers)) correct++;
            }            

            if (q.type === 'essay') {
                try {
                    const essayScore = await scoreEssayAnswer(q.id, userAnswer);
                    if (essayScore?.result.correct) correct++;
                } catch (err) {
                    console.error('Essay scoring failed', err);
                }
            }
        }

        setScore(correct);
        setSubmitted(true);

        try {
            await saveExamScore(session_id, exam.exam_id, correct);
            alert(`Exam submitted. Score: ${correct} / ${exam.questions.length}`);
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
            <p><strong>{currentQuestion.text}</strong></p>

            {currentQuestion.type === 'multiple choice' && (
                currentQuestion.options.map((opt, idx) => (
                    <div key={idx}>
                        <input
                            type="radio"
                            name={`q-${currentQuestion.id}`}
                            value={opt.text}
                            checked={answers[currentQuestion.id] === opt.text}
                            onChange={() => handleAnswerChange(currentQuestion.id, opt.text, currentQuestion.type)}
                            disabled={submitted}
                        />
                        <label>{opt.text}</label>
                    </div>
                ))
            )}

            {currentQuestion.type === 'multiple selection' && (
                currentQuestion.options.map((opt, idx) => (
                    <div key={idx}>
                        <input
                            type="checkbox"
                            name={`q-${currentQuestion.id}`}
                            value={opt.text}
                            checked={(answers[currentQuestion.id] || []).includes(opt.text)}
                            onChange={() => handleAnswerChange(currentQuestion.id, opt.text, currentQuestion.type)}
                            disabled={submitted}
                        />
                        <label>{opt.text}</label>
                    </div>
                ))
            )}

            {currentQuestion.type === 'essay' && (
                <textarea
                    rows="5"
                    style={{ width: '100%' }}
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value, currentQuestion.type)}
                    disabled={submitted}
                />
            )}

            <div style={{ marginTop: '20px' }}>
                <button disabled={currentIndex === 0} onClick={() => handleNavigation('prev')}>Previous</button>
                <button
                    disabled={currentIndex === exam.questions.length - 1}
                    onClick={() => handleNavigation('next')}
                    style={{ marginLeft: '10px' }}
                >
                    Next
                </button>
            </div>

            {!submitted && (
                <div style={{ marginTop: '20px' }}>
                    <button onClick={handleSubmit}>Submit Exam</button>
                </div>
            )}

            {score !== null && (
                <div style={{ marginTop: '20px' }}>
                    <p><strong>Score: {score} / {exam.questions.length}</strong></p>
                    <button onClick={() => navigate(`/lesson/${session_id}`)}>Back to Lesson Overview</button>
                </div>
            )}
        </div>
    );
};

export default ExamView;

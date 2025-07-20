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
    const [questionCorrectness, setQuestionCorrectness] = useState({});
    const [submitting, setSubmitting] = useState(false);

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
        setSubmitting(true);

        let correct = 0;
        const correctnessMap = {};

        for (const q of exam.questions) {
            const userAnswer = answers[q.id];

            if (q.type === 'multiple choice') {
                const correctOption = q.options.find(opt => opt.correct);
                const isCorrect = userAnswer === correctOption?.text;
                if (isCorrect) correct++;
                correctnessMap[q.id] = isCorrect;
            }

            if (q.type === 'multiple selection') {
                const correctAnswers = q.options.filter(opt => opt.correct).map(opt => opt.text).sort();
                const userAnswers = Array.isArray(userAnswer) ? userAnswer.sort() : [];
                const isCorrect = JSON.stringify(correctAnswers) === JSON.stringify(userAnswers);
                if (isCorrect) correct++;
                correctnessMap[q.id] = isCorrect;
            }

            if (q.type === 'essay') {
                try {
                    const essayScore = await scoreEssayAnswer(q.id, userAnswer);
                    const isCorrect = essayScore?.result.correct;
                    if (isCorrect) correct++;
                    correctnessMap[q.id] = {
                        correct: isCorrect,
                        feedback: essayScore?.result.feedback
                    };
                } catch (err) {
                    console.error('Essay scoring failed', err);
                    correctnessMap[q.id] = { correct: false, feedback: 'Error scoring essay.' };
                }
            }
        }

        setQuestionCorrectness(correctnessMap);
        setScore(correct);
        setSubmitted(true);

        try {
            await saveExamScore(session_id, exam.exam_id, correct);
            alert(`Exam submitted. Score: ${correct} / ${exam.questions.length}`);
        } catch (err) {
            alert('Failed to save exam score.');
        } finally {
            setSubmitting(false);
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
                    <label key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', marginTop: '8px' }}>
                        <input
                            type="radio"
                            name={`q-${currentQuestion.id}`}
                            value={opt.text}
                            checked={answers[currentQuestion.id] === opt.text}
                            onChange={() => handleAnswerChange(currentQuestion.id, opt.text, currentQuestion.type)}
                            disabled={submitted}
                            style={{ marginRight: '8px', width: '20px' }}
                        />
                        {opt.text}
                    </label>
                ))
            )}

            {currentQuestion.type === 'multiple selection' && (
                currentQuestion.options.map((opt, idx) => (
                    <label key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', marginTop: '8px' }}>
                        <input
                            type="checkbox"
                            name={`q-${currentQuestion.id}`}
                            value={opt.text}
                            checked={(answers[currentQuestion.id] || []).includes(opt.text)}
                            onChange={() => handleAnswerChange(currentQuestion.id, opt.text, currentQuestion.type)}
                            disabled={submitted}
                            style={{ marginRight: '8px', width: '20px' }}
                        />
                        {opt.text}
                    </label>
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

            {submitted && (
                <p style={{
                    marginTop: '10px',
                    fontWeight: 'bold',
                    color:
                        currentQuestion.type === 'essay'
                            ? questionCorrectness[currentQuestion.id]?.correct
                                ? 'green'
                                : 'red'
                            : questionCorrectness[currentQuestion.id]
                                ? 'green'
                                : 'red'
                }}>
                    {
                        currentQuestion.type === 'essay'
                            ? questionCorrectness[currentQuestion.id]?.correct
                                ? 'Correct'
                                : 'Incorrect'
                            : questionCorrectness[currentQuestion.id]
                                ? 'Correct'
                                : 'Incorrect'
                    }
                </p>
            )}

            {submitted && currentQuestion.type === 'multiple choice' && (
                <p style={{ fontStyle: 'italic', marginTop: '5px' }}>
                    Explanation: {currentQuestion.options.find(opt => opt.correct)?.explanation}
                </p>
            )}

            {submitted && currentQuestion.type === 'multiple selection' && (
                <div style={{ fontStyle: 'italic', marginTop: '5px' }}>
                    <p><strong>Explanations:</strong></p>
                    {currentQuestion.options.map((opt, idx) => (
                        <p key={idx} style={{ marginBottom: '5px' }}>
                            <span style={{ fontWeight: 'bold' }}>{opt.text}:</span> {opt.explanation}
                        </p>
                    ))}
                </div>
            )}

            {submitted && currentQuestion.type === 'essay' && (
                <p style={{ fontStyle: 'italic', marginTop: '5px' }}>
                    Feedback: {questionCorrectness[currentQuestion.id]?.feedback}
                </p>
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
                    <button onClick={handleSubmit} disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit Exam'}
                    </button>
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

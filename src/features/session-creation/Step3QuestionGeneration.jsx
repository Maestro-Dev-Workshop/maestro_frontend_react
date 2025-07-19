// src/features/session-creation/Step3QuestionGeneration.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { generateExercises, generateExam } from './sessionCreationService';

const Step3QuestionGeneration = () => {
    const { session_id } = useParams();
    const navigate = useNavigate();

    const [includeExercises, setIncludeExercises] = useState(true);
    const [exercisePreference, setExercisePreference] = useState('');
    const [exerciseQuestionTypes, setExerciseQuestionTypes] = useState([]);

    const [includeExam, setIncludeExam] = useState(true);
    const [examPreference, setExamPreference] = useState('');
    const [examQuestionTypes, setExamQuestionTypes] = useState([]);
    const [useTimeLimit, setUseTimeLimit] = useState(false);

    const [submitting, setSubmitting] = useState(false);

    const handleCheckboxChange = (setter, values, value) => {
        if (values.includes(value)) {
            setter(values.filter(v => v !== value));
        } else {
            setter([...values, value]);
        }
    };

    const handleGenerate = async () => {
        setSubmitting(true);
        try {
            if (includeExercises) {
                await generateExercises(session_id, {
                    exercise_preference: exercisePreference,
                    question_types: exerciseQuestionTypes
                });
            }

            if (includeExam) {
                await generateExam(session_id, {
                    exam_preference: examPreference,
                    question_types: examQuestionTypes,
                    use_time_limit: useTimeLimit
                });
            }

            alert('Exercises and/or exam generated successfully!');
            navigate(`/lesson/${session_id}`);
        } catch (err) {
            alert('Error generating questions');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Step 3: Practice Questions and Exam</h1>

            {/* Exercise Section */}
            <section style={{ marginBottom: '20px' }}>
                <h2>Exercises</h2>
                <label>
                    <input type="checkbox" checked={includeExercises} onChange={(e) => setIncludeExercises(e.target.checked)} />
                    Include Exercises
                </label>
                {includeExercises && (
                    <div style={{ marginTop: '10px' }}>
                        <textarea
                            placeholder="Enter your exercise preference"
                            value={exercisePreference}
                            onChange={(e) => setExercisePreference(e.target.value)}
                            style={{ width: '100%', height: '60px' }}
                        />
                        <div style={{ marginTop: '10px' }}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={exerciseQuestionTypes.includes('multiple choice')}
                                    onChange={() => handleCheckboxChange(setExerciseQuestionTypes, exerciseQuestionTypes, 'multiple choice')}
                                />
                                Multiple Choice
                            </label>
                            <label style={{ marginLeft: '10px' }}>
                                <input
                                    type="checkbox"
                                    checked={exerciseQuestionTypes.includes('multiple selection')}
                                    onChange={() => handleCheckboxChange(setExerciseQuestionTypes, exerciseQuestionTypes, 'multiple selection')}
                                />
                                Multiple Selection
                            </label>
                            <label style={{ marginLeft: '10px' }}>
                                <input
                                    type="checkbox"
                                    checked={exerciseQuestionTypes.includes('essay')}
                                    onChange={() => handleCheckboxChange(setExerciseQuestionTypes, exerciseQuestionTypes, 'essay')}
                                />
                                Essay
                            </label>
                        </div>
                    </div>
                )}
            </section>

            {/* Exam Section */}
            <section style={{ marginBottom: '20px' }}>
                <h2>Exam</h2>
                <label>
                    <input type="checkbox" checked={includeExam} onChange={(e) => setIncludeExam(e.target.checked)} />
                    Include Exam
                </label>
                {includeExam && (
                    <div style={{ marginTop: '10px' }}>
                        <textarea
                            placeholder="Enter your exam preference"
                            value={examPreference}
                            onChange={(e) => setExamPreference(e.target.value)}
                            style={{ width: '100%', height: '60px' }}
                        />
                        <div style={{ marginTop: '10px' }}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={examQuestionTypes.includes('multiple choice')}
                                    onChange={() => handleCheckboxChange(setExamQuestionTypes, examQuestionTypes, 'multiple choice')}
                                />
                                Multiple Choice
                            </label>
                            <label style={{ marginLeft: '10px' }}>
                                <input
                                    type="checkbox"
                                    checked={examQuestionTypes.includes('multiple selection')}
                                    onChange={() => handleCheckboxChange(setExamQuestionTypes, examQuestionTypes, 'multiple selection')}
                                />
                                Multiple Selection
                            </label>
                            <label style={{ marginLeft: '10px' }}>
                                <input
                                    type="checkbox"
                                    checked={examQuestionTypes.includes('essay')}
                                    onChange={() => handleCheckboxChange(setExamQuestionTypes, examQuestionTypes, 'essay')}
                                />
                                Essay
                            </label>
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <label>
                                <input type="checkbox" checked={useTimeLimit} onChange={(e) => setUseTimeLimit(e.target.checked)} />
                                Add time limit to exam
                            </label>
                        </div>
                    </div>
                )}
            </section>

            <button onClick={handleGenerate} disabled={submitting}>
                {submitting ? 'Generating...' : 'Generate and Proceed to Lesson'}
            </button>
        </div>
    );
};

export default Step3QuestionGeneration;

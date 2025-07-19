import api from '../../services/axiosConfig';

// ✅ Get all session topics (already selected for the lesson)
export const getSessionTopics = async (session_id) => {
    const res = await api.get(`/topic/${session_id}/list`);
    return res.data;
};

// ✅ Get full content of a single topic (includes subtopics and lesson)
export const getTopicContent = async (topic_id) => {
    const res = await api.get(`/topic/${topic_id}/get-content`);
    return res.data;
};

// ✅ Get exercises for a topic
export const getExercise = async (topic_id) => {
    const res = await api.get(`/topic/${topic_id}/get-exercise`);
    return res.data;
};

// ✅ Save exercise score
export const saveExerciseScore = async (topic_id, exercise_id, score) => {
    const res = await api.post(`/topic/${topic_id}/save-exercise-score`, JSON.stringify({
        exercise_id,
        score
    }));
    return res.data;
};

// ✅ Get exam for session
export const getExam = async (session_id) => {
    const res = await api.get(`/session/${session_id}/get-exam`);
    return res.data;
};

// ✅ Save exam score
export const saveExamScore = async (session_id, exam_id, score) => {
    const res = await api.post(`/session/${session_id}/save-exam-score`, {
        exam_id,
        score
    });
    return res.data;
};

// ✅ Send message to chatbot
export const sendChatMessage = async (session_id, message, metadata) => {
    const res = await api.post(`/chatbot/${session_id}/send-message`, {
        message,
        metadata
    });
    return res.data;
};

export const scoreEssayAnswer = async (question_id, answer) => {
    const res = await api.post(
        '/chatbot/answer-question',
        new URLSearchParams({
            question_id,
            answer
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );
    return res.data;
};

// ✅ Get chat history for session
export const getChatHistory = async (session_id) => {
    const res = await api.get(`/chatbot/${session_id}/chat-history`);
    return res.data;
};

// ✅ Mark subtopic as read
export const markSubtopicAsRead = async (topic_id, subtopic_id) => {
    const res = await api.post(`/topic/${topic_id}/mark-as-read`, {
        subtopic_id
    });
    return res.data;
};

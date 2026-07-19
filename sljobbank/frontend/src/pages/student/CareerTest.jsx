// src/pages/student/CareerTest.jsx
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { careerTestApi } from '@/api';
import {
  Compass,
  Award,
  FileText,
  Download,
  ChevronLeft,
  Sparkles,
  TrendingUp,
  Clock,
} from 'lucide-react';

const STAGE = { LIST: 'list', PRE_INFO: 'pre_info', TAKING: 'taking', RESULT: 'result' };

export default function CareerTest() {
  const [stage, setStage] = useState(STAGE.LIST);
  const [tests, setTests] = useState([]);
  const [activeTest, setActiveTest] = useState(null);
  const [preInfo, setPreInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [attemptId, setAttemptId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [qIndex, setQIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [myAttempts, setMyAttempts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    careerTestApi.listTests()
      .then(res => setTests(res.data.data || []))
      .catch(() => toast.error('Failed to load tests'));
    careerTestApi.myAttempts()
      .then(res => setMyAttempts(res.data.data || []))
      .catch(() => {});
  }, []);

  async function openPreInfo(test) {
    setActiveTest(test);
    setLoading(true);
    try {
      const res = await careerTestApi.preTestInfo(test.id);
      setPreInfo(res.data.data);
      setStage(STAGE.PRE_INFO);
    } catch {
      toast.error('Could not load test info');
    } finally {
      setLoading(false);
    }
  }

  async function beginTest() {
    setLoading(true);
    try {
      const [startRes, qRes] = await Promise.all([
        careerTestApi.start(activeTest.id),
        careerTestApi.getQuestions(activeTest.id),
      ]);
      setAttemptId(startRes.data.data.id);
      setQuestions(qRes.data.data);
      setAnswers({});
      setQIndex(0);
      setStage(STAGE.TAKING);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not start the test.');
    } finally {
      setLoading(false);
    }
  }

  function answer(value) {
    const q = questions[qIndex];
    setAnswers(prev => ({ ...prev, [q.id]: value }));
    if (qIndex < questions.length - 1) {
      setQIndex(qIndex + 1);
    }
  }

  async function submitTest() {
    setLoading(true);
    try {
      const payload = Object.entries(answers).map(([questionId, value]) => ({ questionId, value }));
      await careerTestApi.submitAnswers(attemptId, payload);
      const res = await careerTestApi.complete(attemptId);
      setResult(res.data.data);
      setStage(STAGE.RESULT);
      toast.success('Test complete! Here are your results.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit your answers.');
    } finally {
      setLoading(false);
    }
  }

  async function downloadResult() {
    try {
      const res = await careerTestApi.studentDownload(attemptId);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'career-key-result.pdf';
      link.click();
      toast.success('Download started!');
    } catch {
      toast.error('Download failed.');
    }
  }

  // ── LIST ──────────────────────────────────────────
  if (stage === STAGE.LIST) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] px-4 py-6 md:px-8 md:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0A2E1C] to-[#1A5C3A] p-6 md:p-10 mb-8 shadow-lg shadow-[#0A2E1C]/20">
            <div className="absolute right-0 top-0 h-full w-1/2 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cGF0aCBkPSJNMjAgMjBoNDB2NDBIMjB6IiBmaWxsPSIjZmZmIi8+PC9zdmc+')] bg-repeat" />
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <Compass className="w-7 h-7 text-white/80" />
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Career Key Test</h1>
                </div>
                <p className="text-white/70 text-sm md:text-base mt-1 max-w-xl">
                  Discover careers that genuinely match your interests – based on Holland's RIASEC theory.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
                <Sparkles className="w-4 h-4 text-white/60" />
                <span className="text-white/80 text-sm font-medium">
                  {tests.length} test available
                </span>
              </div>
            </div>
          </div>

          {/* Test Cards */}
          <div className="grid md:grid-cols-2 gap-5 mb-8">
            {tests.map(t => (
              <div key={t.id} className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-6 hover:shadow-md transition">
                <div className="text-2xl mb-2">🧭</div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">{t.title}</h2>
                <p className="text-sm text-gray-500 mb-4">{t.purpose}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {t.estimatedMinutes || '10-15 min'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> {t.questionCount || 50} questions
                  </span>
                </div>
                <button
                  onClick={() => openPreInfo(t)}
                  disabled={loading}
                  className="w-full py-2.5 bg-[#1A6B50] text-white rounded-xl font-semibold hover:bg-[#145A42] transition shadow-md shadow-[#1A6B50]/20"
                >
                  {loading ? 'Loading…' : 'Start Test'}
                </button>
              </div>
            ))}
          </div>

          {/* Past Attempts */}
          {myAttempts.filter(a => a.status === 'COMPLETED').length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 text-[#1A6B50]" />
                Your Past Results
              </h2>
              <div className="divide-y divide-gray-100">
                {myAttempts
                  .filter(a => a.status === 'COMPLETED')
                  .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
                  .map(a => (
                    <div key={a.id} className="flex justify-between items-center py-3">
                      <div>
                        <div className="text-sm font-semibold text-gray-800">
                          Holland Code: <span className="text-[#1A6B50]">{a.hollandCode}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(a.completedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span className="badge badge-success">Completed</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── PRE-TEST INFO ──────────────────────────────────
  if (stage === STAGE.PRE_INFO) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] px-4 py-6 md:px-8 md:py-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setStage(STAGE.LIST)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1A6B50] mb-5 transition"
          >
            <ChevronLeft className="w-4 h-4" /> Back to tests
          </button>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{preInfo.testTitle}</h2>
            <div className="badge badge-info mb-4">Your Grade: {preInfo.studentGrade || 'Not set'}</div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#1A6B50]" /> Why take this test?
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mt-1">{preInfo.purpose}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#1A6B50]" /> What will this identify?
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mt-1">{preInfo.whatItIdentifies}</p>
              </div>
              <div className="flex gap-4 text-sm text-gray-500">
                <span>⏱ {preInfo.estimatedMinutes}</span>
                <span>📝 {preInfo.questionCount} questions</span>
              </div>
              {preInfo.hasCompletedBefore && (
                <div className="text-sm bg-amber-50 text-amber-800 border border-amber-200 rounded-lg p-3">
                  You've completed this test before. Taking it again will generate a new result.
                </div>
              )}
            </div>

            <button
              onClick={beginTest}
              disabled={loading}
              className="mt-6 w-full py-3 bg-[#1A6B50] text-white rounded-xl font-semibold hover:bg-[#145A42] transition shadow-md shadow-[#1A6B50]/20"
            >
              {loading ? 'Starting…' : "I'm Ready – Start the Test →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── TAKING ──────────────────────────────────────────
  if (stage === STAGE.TAKING) {
    const q = questions[qIndex];
    const progress = Math.round(((qIndex) / questions.length) * 100);
    const isLast = qIndex === questions.length - 1;
    const hasAnswered = answers[q?.id] !== undefined;

    return (
      <div className="min-h-screen bg-[#F8FAFB] px-4 py-6 md:px-8 md:py-8 flex items-center justify-center">
        <div className="max-w-xl w-full">
          {/* Progress */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-6">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-gradient-to-r from-[#1A6B50] to-[#0D4A35] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Question */}
            <div className="text-center">
              <div className="text-xs font-bold text-gray-400 mb-2">
                Question {qIndex + 1} of {questions.length}
              </div>
              <div className="text-lg font-bold text-gray-900 mb-6">{q?.text}</div>

              <div className="grid grid-cols-5 gap-2 mb-2">
                {[1, 2, 3, 4, 5].map(v => (
                  <button
                    key={v}
                    onClick={() => answer(v)}
                    className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                      answers[q?.id] === v
                        ? 'border-[#1A6B50] bg-[#1A6B50] text-white shadow-md'
                        : 'border-gray-200 hover:border-[#1A6B50] hover:bg-gray-50'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 px-1">
                <span>Strongly Disagree</span>
                <span>Strongly Agree</span>
              </div>
            </div>

            {/* Next / Submit */}
            {isLast && hasAnswered && (
              <button
                onClick={submitTest}
                disabled={loading}
                className="mt-6 w-full py-3 bg-[#1A6B50] text-white rounded-xl font-semibold hover:bg-[#145A42] transition shadow-md shadow-[#1A6B50]/20"
              >
                {loading ? 'Scoring…' : 'Submit & See My Results →'}
              </button>
            )}
            {!isLast && hasAnswered && (
              <div className="mt-4 text-center text-sm text-gray-400">
                Answering automatically moves to the next question.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── RESULT ──────────────────────────────────────────
  if (stage === STAGE.RESULT && result) {
    const colors = {
      Realistic: '#2563EB',
      Investigative: '#7C3AED',
      Artistic: '#DB2777',
      Social: '#059669',
      Enterprising: '#D97706',
      Conventional: '#6B7280',
    };

    return (
      <div className="min-h-screen bg-[#F8FAFB] px-4 py-6 md:px-8 md:py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-6 md:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-xs font-bold text-[#1A6B50] uppercase tracking-wider">Your Result</div>
              <div className="text-4xl font-black text-gray-900 mt-1">Holland Code</div>
              <div className="text-6xl font-extrabold text-[#1A6B50] mt-2 tracking-widest">
                {result.hollandCode}
              </div>
            </div>

            {/* Bar chart */}
            <div className="space-y-3 mb-6">
              {Object.entries(result.scoresPercent).map(([cat, pct]) => (
                <div key={cat}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{cat}</span>
                    <span className="font-bold text-gray-900">{pct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 mt-0.5">
                    <div
                      className="h-2.5 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: colors[cat] || '#1A6B50' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Guidance */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#1A6B50]" /> Guidance
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line mt-1">
                {result.guidanceText}
              </p>
            </div>

            {/* Suggested Jobs */}
            {result.suggestedJobs?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#1A6B50]" /> Jobs Worth Exploring
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {result.suggestedJobs.map(j => (
                    <span key={j.jobId} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {j.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Download */}
            <button
              onClick={downloadResult}
              className="w-full py-3 bg-[#1A6B50] text-white rounded-xl font-semibold hover:bg-[#145A42] transition shadow-md shadow-[#1A6B50]/20 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download My Result (PDF)
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">
              Downloading unlocks your counselor's ability to also download this result.
            </p>
          </div>

          <button
            onClick={() => setStage(STAGE.LIST)}
            className="mt-4 w-full py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:border-[#1A6B50] hover:text-[#1A6B50] transition"
          >
            Back to Career Key
          </button>
        </div>
      </div>
    );
  }

  return null;
}


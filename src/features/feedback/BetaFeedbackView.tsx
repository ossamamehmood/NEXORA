import React, { useState, useEffect } from 'react';
import {
  MessageSquareQuote,
  Bug,
  Lightbulb,
  HelpCircle,
  Zap,
  Star,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  History,
  Send,
} from 'lucide-react';
import { BetaFeedbackRecord, FeedbackType, SanitizedDiagnosticBundle } from '../../types';
import { NexoraApi } from '../../services/api';

const feedbackTypes: { type: FeedbackType; label: string; icon: React.ElementType; desc: string }[] = [
  { type: 'bug', label: 'Bug Report', icon: Bug, desc: 'Something didn\'t work or behaved unexpectedly' },
  { type: 'feature', label: 'Feature Request', icon: Lightbulb, desc: 'An idea or capability you\'d like to see' },
  { type: 'workflow', label: 'Confusing UX', icon: HelpCircle, desc: 'A flow or screen that was hard to understand' },
  { type: 'performance', label: 'Performance', icon: Zap, desc: 'Sluggishness, stuttering, or high resource usage' },
  { type: 'general', label: 'General Rating', icon: Star, desc: 'Overall impressions and qualitative feedback' },
];

const ratingLabels = ['', 'Poor', 'Needs Work', 'Good', 'Very Good', 'Exceptional'];

export const BetaFeedbackView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'submit' | 'history'>('submit');
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('bug');
  const [rating, setRating] = useState<number>(5);
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState('');
  const [includeDiagnostics, setIncludeDiagnostics] = useState(true);
  const [diagnosticBundle, setDiagnosticBundle] = useState<SanitizedDiagnosticBundle | null>(null);
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [feedbackHistory, setFeedbackHistory] = useState<BetaFeedbackRecord[]>([]);

  useEffect(() => {
    NexoraApi.getSanitizedDiagnosticBundle()
      .then(setDiagnosticBundle)
      .catch(() => {});
    NexoraApi.getBetaFeedbacks()
      .then(setFeedbackHistory)
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim() || !description.trim()) {
      setErrorMessage('Please provide both a summary headline and detailed description.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const record: BetaFeedbackRecord = {
      id: 'fb-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
      feedback_type: feedbackType,
      rating,
      summary: summary.trim(),
      description: description.trim(),
      steps_to_reproduce: feedbackType === 'bug' ? steps.trim() : undefined,
      include_diagnostics: includeDiagnostics,
      diagnostic_payload: includeDiagnostics && diagnosticBundle ? diagnosticBundle : undefined,
      timestamp: new Date().toISOString(),
    };

    try {
      await NexoraApi.submitBetaFeedback(record);
      setSubmitSuccess(true);
      setSummary('');
      setDescription('');
      setSteps('');
      const updatedList = await NexoraApi.getBetaFeedbacks();
      setFeedbackHistory(updatedList);
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err?.toString() || 'Failed to submit feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-4rem)]">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#11131A] border border-[#232838] flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="w-5 h-5 text-[#02FEDC]" />
            <h2 className="text-sm font-bold text-[#F5F7FA]">Closed Beta Feedback & Telemetry Vault</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#02FEDC]/15 text-[#02FEDC] border border-[#02FEDC]/30">
              v1.0.0-beta.1
            </span>
          </div>
          <p className="text-xs text-[#969BAA]">
            Direct channel to the engineering team. Your feedback shapes safety, performance, and user experience.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 p-1 bg-[#171A23] rounded-xl border border-[#232838]">
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'submit'
                ? 'bg-[#02FEDC] text-[#08090D] font-bold'
                : 'text-[#969BAA] hover:text-[#F5F7FA]'
            }`}
          >
            Submit Feedback
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-[#02FEDC] text-[#08090D] font-bold'
                : 'text-[#969BAA] hover:text-[#F5F7FA]'
            }`}
          >
            Feedback History ({feedbackHistory.length})
          </button>
        </div>
      </div>

      {submitSuccess && (
        <div className="p-4 rounded-xl bg-[#00E699]/10 border border-[#00E699]/30 text-xs text-[#00E699] flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Feedback successfully logged to local beta telemetry vault. Thank you for helping refine NEXORA!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-[#FF453A]/10 border border-[#FF453A]/30 text-xs text-[#FF453A] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {activeTab === 'submit' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Feedback Type Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#F5F7FA] uppercase tracking-wider">
              1. Select Feedback Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {feedbackTypes.map((item) => {
                const Icon = item.icon;
                const isSelected = feedbackType === item.type;
                return (
                  <button
                    type="button"
                    key={item.type}
                    onClick={() => setFeedbackType(item.type)}
                    className={`p-3.5 rounded-xl border text-left transition-all space-y-1.5 ${
                      isSelected
                        ? 'bg-[#171A23] border-[#02FEDC] shadow-lg shadow-[#02FEDC]/10'
                        : 'bg-[#11131A] border-[#232838] hover:border-[#38425A]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[#02FEDC]' : 'text-[#656C80]'}`} />
                      <span className={`text-xs font-semibold ${isSelected ? 'text-[#F5F7FA]' : 'text-[#969BAA]'}`}>
                        {item.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#656C80] leading-tight">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Experience Rating */}
          <div className="p-5 rounded-xl bg-[#11131A] border border-[#232838] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#F5F7FA] uppercase tracking-wider">
                2. Experience Rating
              </label>
              <span className="text-xs font-semibold text-[#02FEDC]">{ratingLabels[rating]}</span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-[#969BAA] hover:text-[#02FEDC] transition-all"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      star <= rating ? 'fill-[#02FEDC] text-[#02FEDC]' : 'text-[#232838]'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Details */}
          <div className="p-5 rounded-xl bg-[#11131A] border border-[#232838] space-y-4">
            <label className="text-xs font-bold text-[#F5F7FA] uppercase tracking-wider">
              3. Feedback Details
            </label>

            <div className="space-y-1">
              <label className="text-[11px] text-[#969BAA]">Headline Summary *</label>
              <input
                type="text"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief summary (e.g. Smart Cleaner identified 1.2GB in 400ms)"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0E1017] border border-[#232838] text-xs text-[#F5F7FA] focus:outline-none focus:border-[#02FEDC]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-[#969BAA]">Detailed Observations *</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what happened, what you expected, and any relevant context..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0E1017] border border-[#232838] text-xs text-[#F5F7FA] focus:outline-none focus:border-[#02FEDC] resize-none"
              />
            </div>

            {feedbackType === 'bug' && (
              <div className="space-y-1">
                <label className="text-[11px] text-[#969BAA]">Steps to Reproduce (Optional)</label>
                <textarea
                  rows={3}
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  placeholder="1. Navigate to Startup Manager&#10;2. Click toggle for entry&#10;3. Observed behavior..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0E1017] border border-[#232838] text-xs text-[#F5F7FA] focus:outline-none focus:border-[#02FEDC] resize-none font-mono text-[11px]"
                />
              </div>
            )}
          </div>

          {/* Privacy & Diagnostic Sharing */}
          <div className="p-5 rounded-xl bg-[#11131A] border border-[#232838] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00E699]" />
                <h3 className="text-xs font-bold text-[#F5F7FA] uppercase tracking-wider">
                  4. Privacy & Diagnostic Transparency
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowJsonPreview(!showJsonPreview)}
                className="text-[11px] text-[#02FEDC] hover:underline flex items-center gap-1 font-medium"
              >
                {showJsonPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showJsonPreview ? 'Hide Raw Payload' : 'Inspect Diagnostic Payload'}
              </button>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#0E1017] border border-[#1D2230]">
              <input
                type="checkbox"
                id="diagnosticOptIn"
                checked={includeDiagnostics}
                onChange={(e) => setIncludeDiagnostics(e.target.checked)}
                className="mt-0.5 rounded border-[#2B3245] bg-[#11131A] text-[#02FEDC] focus:ring-0"
              />
              <label htmlFor="diagnosticOptIn" className="text-xs text-[#969BAA] leading-relaxed cursor-pointer">
                <strong className="text-[#F5F7FA]">Attach Sanitized System Metadata:</strong> Includes OS version, CPU
                architecture, and app version. <strong className="text-[#00E699]">Guaranteed:</strong> Zero file paths,
                personal documents, browsing histories, or user credentials will ever be captured.
              </label>
            </div>

            {showJsonPreview && diagnosticBundle && (
              <div className="p-3.5 rounded-lg bg-[#08090D] border border-[#232838] font-mono text-[11px] text-[#969BAA] overflow-x-auto">
                <pre>{JSON.stringify(diagnosticBundle, null, 2)}</pre>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#02FEDC] to-[#5A5CFF] text-[#08090D] font-bold text-xs hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-[#02FEDC]/15"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? 'Logging Feedback...' : 'Submit Beta Feedback'}
            </button>
          </div>
        </form>
      )}

      {activeTab === 'history' && (
        <div className="border border-[#1D2230] rounded-xl overflow-hidden bg-[#11131A]">
          {feedbackHistory.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <MessageSquareQuote className="w-8 h-8 text-[#656C80] mx-auto" />
              <p className="text-xs text-[#969BAA]">No beta feedback records found.</p>
              <p className="text-[11px] text-[#656C80]">Submitted reports will appear here for auditability.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B0D13] text-[#969BAA] border-b border-[#1D2230]">
                <tr>
                  <th className="p-3.5 font-semibold">Timestamp</th>
                  <th className="p-3.5 font-semibold">Category</th>
                  <th className="p-3.5 font-semibold">Rating</th>
                  <th className="p-3.5 font-semibold">Summary</th>
                  <th className="p-3.5 font-semibold">Diagnostics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D2230]/60">
                {feedbackHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-[#171A23]/50">
                    <td className="p-3.5 font-mono text-[#F5F7FA] whitespace-nowrap">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#171A23] text-[#02FEDC] border border-[#02FEDC]/20">
                        {item.feedback_type}
                      </span>
                    </td>
                    <td className="p-3.5 text-[#02FEDC] font-semibold">
                      {item.rating ? `${item.rating} ★` : '—'}
                    </td>
                    <td className="p-3.5 text-[#F5F7FA] max-w-md truncate" title={item.description}>
                      {item.summary}
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-[#00E699]">
                      {item.include_diagnostics ? 'Sanitized Attached' : 'None'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

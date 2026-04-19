import React, { useState } from 'react';
import { EmptyState } from '../../components/dashboard/EmptyState';

const labResults = [
  { id: 1, patient: 'John Doe', patientId: 'P-001', testName: 'HbA1c', date: 'Dec 12, 2024', status: 'pending', priority: 'normal', results: [{ name: 'HbA1c', value: '7.2', unit: '%', range: '<7.0', normal: false }], notes: '' },
  { id: 2, patient: 'Robert Chen', patientId: 'P-003', testName: 'ECG Report', date: 'Dec 11, 2024', status: 'pending', priority: 'urgent', results: [{ name: 'Heart Rate', value: '88', unit: 'bpm', range: '60-100', normal: true }, { name: 'PR Interval', value: '210', unit: 'ms', range: '120-200', normal: false }], notes: '' },
  { id: 3, patient: 'David Brown', patientId: 'P-005', testName: 'Pulmonary Function', date: 'Dec 10, 2024', status: 'pending', priority: 'normal', results: [{ name: 'FEV1', value: '68', unit: '%', range: '>80', normal: false }, { name: 'FVC', value: '75', unit: '%', range: '>80', normal: false }], notes: '' },
  { id: 4, patient: 'Mary Johnson', patientId: 'P-002', testName: 'Fasting Glucose', date: 'Dec 8, 2024', status: 'reviewed', priority: 'normal', results: [{ name: 'Glucose', value: '126', unit: 'mg/dL', range: '70-100', normal: false }], notes: 'Elevated fasting glucose. Adjust Metformin dosage.' },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending Review', color: 'bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300' },
  reviewed: { label: 'Reviewed', color: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-300' },
};

export const DoctorLabResultsPage: React.FC = () => {
  const [selectedResult, setSelectedResult] = useState<typeof labResults[0] | null>(null);
  const [notes, setNotes] = useState('');
  const [reviewedIds, setReviewedIds] = useState<Set<number>>(new Set([4]));
  const [filter, setFilter] = useState<'all' | 'pending' | 'urgent'>('all');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadPatient, setUploadPatient] = useState('');
  const [uploadTest, setUploadTest] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const filtered = labResults.filter(r => {
    if (filter === 'pending') return !reviewedIds.has(r.id);
    if (filter === 'urgent') return r.priority === 'urgent';
    return true;
  });

  const handleReview = (id: number) => {
    setReviewedIds(prev => new Set([...prev, id]));
    if (selectedResult?.id === id) {
      setSelectedResult({ ...selectedResult, status: 'reviewed', notes });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    await new Promise(r => setTimeout(r, 1500));
    setUploading(false);
    setUploadSuccess(true);
    setTimeout(() => { setUploadSuccess(false); setShowUpload(false); setUploadPatient(''); setUploadTest(''); setUploadFile(null); }, 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold font-headline text-neutral-900 dark:text-white">Lab Results</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Review and manage patient lab results</p>
        </div>
        <button onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-purple-500 to-indigo-400 hover:from-purple-600 hover:to-indigo-500 shadow-elevation-2 transition-all hover:scale-[1.03]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          Upload Result
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl w-fit">
        {[
          { key: 'all', label: `All (${labResults.length})` },
          { key: 'pending', label: `Pending (${labResults.filter(r => !reviewedIds.has(r.id)).length})` },
          { key: 'urgent', label: `Urgent (${labResults.filter(r => r.priority === 'urgent').length})` },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key as any)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${filter === f.key ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-elevation-1' : 'text-neutral-500 dark:text-neutral-400'}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* Results list */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-8">
              <EmptyState icon="🔬" title="No results" description="No lab results match your filter." />
            </div>
          ) : (
            filtered.map((result, i) => {
              const isReviewed = reviewedIds.has(result.id);
              const isSelected = selectedResult?.id === result.id;
              return (
                <div key={result.id} onClick={() => { setSelectedResult(result); setNotes(result.notes); }}
                  className={`bg-white dark:bg-neutral-900 rounded-2xl border shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer animate-fade-up ${isSelected ? 'border-purple-300 dark:border-purple-700 ring-2 ring-purple-200 dark:ring-purple-900/40' : result.priority === 'urgent' ? 'border-accent-200 dark:border-accent-800/50' : 'border-neutral-100 dark:border-neutral-800'}`}
                  style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="flex items-center gap-3 p-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${result.priority === 'urgent' ? 'bg-accent-100 dark:bg-accent-900/40' : 'bg-purple-100 dark:bg-purple-900/40'}`}>
                      🔬
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100 truncate">{result.testName}</p>
                        {result.priority === 'urgent' && <span className="text-[10px] font-bold text-accent-600 dark:text-accent-400 flex-shrink-0">⚠ Urgent</span>}
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">{result.patient} · {result.date}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${isReviewed ? statusConfig.reviewed.color : statusConfig.pending.color}`}>
                      {isReviewed ? 'Reviewed' : 'Pending'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-3 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-elevation-1 overflow-hidden">
          {selectedResult ? (
            <div className="animate-fade-in h-full flex flex-col">
              <div className="p-5 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-neutral-900 dark:text-white">{selectedResult.testName}</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{selectedResult.patient} · {selectedResult.patientId}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{selectedResult.date}</p>
                  </div>
                  {selectedResult.priority === 'urgent' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300">⚠ Urgent</span>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* Results table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                        <th className="text-left pb-3">Test</th>
                        <th className="text-right pb-3">Result</th>
                        <th className="text-right pb-3">Unit</th>
                        <th className="text-right pb-3">Range</th>
                        <th className="text-right pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                      {selectedResult.results.map((r, j) => (
                        <tr key={j} className={!r.normal ? 'bg-accent-50/50 dark:bg-accent-950/10' : ''}>
                          <td className="py-2.5 font-medium text-neutral-800 dark:text-neutral-100">{r.name}</td>
                          <td className={`py-2.5 text-right font-bold font-mono ${r.normal ? 'text-neutral-800 dark:text-neutral-100' : 'text-accent-600 dark:text-accent-400'}`}>{r.value}</td>
                          <td className="py-2.5 text-right text-neutral-500 dark:text-neutral-400">{r.unit}</td>
                          <td className="py-2.5 text-right text-neutral-500 dark:text-neutral-400">{r.range}</td>
                          <td className="py-2.5 text-right">
                            {r.normal ? <span className="text-secondary-600 dark:text-secondary-400 font-semibold text-xs">Normal</span> : <span className="text-accent-600 dark:text-accent-400 font-semibold text-xs">⚠ Abnormal</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Doctor notes */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-2">Clinical Notes</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                    placeholder="Add your clinical interpretation and recommendations..."
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 transition-all resize-none" />
                </div>

                {!reviewedIds.has(selectedResult.id) && (
                  <button onClick={() => handleReview(selectedResult.id)}
                    className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-400 hover:from-purple-600 hover:to-indigo-500 shadow-elevation-2 transition-all hover:scale-[1.02]">
                    Mark as Reviewed
                  </button>
                )}
                {reviewedIds.has(selectedResult.id) && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary-50 dark:bg-secondary-950/20 border border-secondary-100 dark:border-secondary-900/40">
                    <svg className="w-4 h-4 text-secondary-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    <span className="text-sm font-semibold text-secondary-700 dark:text-secondary-300">Reviewed</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8">
              <EmptyState icon="🔬" title="Select a result" description="Click on a lab result to review it." />
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowUpload(false)}>
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-elevation-4 w-full max-w-md border border-neutral-100 dark:border-neutral-800 animate-scale-in overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="h-1.5 bg-gradient-to-r from-purple-500 to-indigo-400" />
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="font-bold text-neutral-900 dark:text-white">Upload Lab Result</h3>
              <button onClick={() => setShowUpload(false)} className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {uploadSuccess ? (
              <div className="p-8 text-center animate-scale-in">
                <div className="w-16 h-16 rounded-full bg-secondary-100 dark:bg-secondary-900/40 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p className="font-semibold text-neutral-800 dark:text-neutral-100">Result Uploaded!</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Patient has been notified.</p>
              </div>
            ) : (
              <form onSubmit={handleUpload} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Patient *</label>
                  <select required value={uploadPatient} onChange={e => setUploadPatient(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 transition-all">
                    <option value="">Select patient...</option>
                    {['John Doe', 'Mary Johnson', 'Robert Chen', 'Sarah Williams', 'David Brown'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Test Name *</label>
                  <input required type="text" value={uploadTest} onChange={e => setUploadTest(e.target.value)} placeholder="e.g. Complete Blood Count"
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">File (PDF, JPG, PNG) *</label>
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${uploadFile ? 'border-purple-400 bg-purple-50 dark:bg-purple-950/20' : 'border-neutral-200 dark:border-neutral-700 hover:border-purple-300 dark:hover:border-purple-700'}`}>
                    {uploadFile ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl">📄</span>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{uploadFile.name}</p>
                          <p className="text-xs text-neutral-500">{(uploadFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button type="button" onClick={() => setUploadFile(null)} className="ml-2 text-neutral-400 hover:text-error-500 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <svg className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Click to upload or drag & drop</p>
                        <p className="text-xs text-neutral-400 mt-1">PDF, JPG, PNG up to 10MB</p>
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e => setUploadFile(e.target.files?.[0] || null)} />
                      </label>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowUpload(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all">Cancel</button>
                  <button type="submit" disabled={uploading || !uploadFile} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-400 disabled:opacity-50 transition-all">
                    {uploading ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Uploading...</span> : 'Upload'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

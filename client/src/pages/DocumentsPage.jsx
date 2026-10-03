import React, { useState, useEffect } from 'react';
import { FileText, Upload, Download, Eye, Trash2, CheckCircle2, ShieldCheck, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/Common/StatusBadge';
import Modal from '../components/Common/Modal';
import api from '../services/api';

export default function DocumentsPage() {
  const { user, playerProfile, showToast } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [activePreviewDoc, setActivePreviewDoc] = useState(null);

  const [newDoc, setNewDoc] = useState({
    doc_name: '',
    doc_type: 'ID Proof',
    file_size: '1.4 MB'
  });

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const targetId = playerProfile?.id || 1;
      const res = await api.get(`/documents/${targetId}`);
      if (res.success) {
        setDocuments(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [user, playerProfile]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const targetId = playerProfile?.id || 1;
      const res = await api.post('/documents', {
        player_id: targetId,
        doc_name: newDoc.doc_name.endsWith('.pdf') ? newDoc.doc_name : `${newDoc.doc_name}.pdf`,
        doc_type: newDoc.doc_type,
        file_size: newDoc.file_size
      });
      if (res.success) {
        showToast('Document uploaded and verified!', 'success');
        setUploadModalOpen(false);
        fetchDocuments();
      }
    } catch (err) {
      showToast(err.message || 'Upload failed', 'error');
    }
  };

  const handleDelete = async (docId) => {
    try {
      const res = await api.delete(`/documents/${docId}`);
      if (res.success) {
        showToast('Document removed', 'info');
        fetchDocuments();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete document', 'error');
    }
  };

  const handleDownload = (docName) => {
    showToast(`Downloading ${docName}...`, 'info');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Document Management Vault</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Secure repository for identity cards, medical clearances and sports credentials</p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Document Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {['ID Proof', 'Medical Certificate', 'Sports Certificate', 'Insurance Document'].map((cat, idx) => (
          <div key={idx} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-semibold">{cat}</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">
                {documents.filter(d => d.doc_type === cat).length} File(s)
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Documents Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Uploaded Documents List</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-slate-900/80 text-gray-500 dark:text-gray-400 uppercase text-[11px] font-bold">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Document Name</th>
                <th className="px-4 py-3">Category Type</th>
                <th className="px-4 py-3">Uploaded Date</th>
                <th className="px-4 py-3">File Size</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                  <td className="px-4 py-3.5 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>{doc.doc_name}</span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-600 dark:text-gray-300">{doc.doc_type}</td>
                  <td className="px-4 py-3.5 text-xs text-gray-500 dark:text-gray-400">{doc.uploaded_date}</td>
                  <td className="px-4 py-3.5 text-xs text-gray-500 dark:text-gray-400">{doc.file_size}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={doc.status} /></td>
                  <td className="px-4 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => { setActivePreviewDoc(doc); setPreviewModalOpen(true); }}
                      className="p-1.5 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-emerald-100 text-gray-700 dark:text-gray-200 transition"
                      title="Preview Document"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownload(doc.doc_name)}
                      className="p-1.5 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-blue-100 text-gray-700 dark:text-gray-200 transition"
                      title="Download File"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-1.5 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-rose-100 text-rose-600 transition"
                      title="Delete File"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      <Modal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} title="Upload Varsity Document">
        <form onSubmit={handleUpload} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Document Title</label>
            <input
              type="text"
              required
              value={newDoc.doc_name}
              onChange={(e) => setNewDoc({ ...newDoc, doc_name: e.target.value })}
              placeholder="e.g. Vijay_Medical_Certificate_2026.pdf"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Document Category</label>
            <select
              value={newDoc.doc_type}
              onChange={(e) => setNewDoc({ ...newDoc, doc_type: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
            >
              <option value="ID Proof">ID Proof</option>
              <option value="Medical Certificate">Medical Certificate</option>
              <option value="Sports Certificate">Sports Certificate</option>
              <option value="Insurance Document">Insurance Document</option>
              <option value="Academic Document">Academic Document</option>
              <option value="Competition Document">Competition Document</option>
            </select>
          </div>

          <div className="p-4 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-2xl flex flex-col items-center text-center space-y-2">
            <Upload className="w-6 h-6 text-emerald-500" />
            <p className="font-bold text-gray-700 dark:text-gray-300">Click or Drag PDF / Image File Here</p>
            <p className="text-[10px] text-gray-400">Supported Formats: PDF, PNG, JPG (Max 10MB)</p>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
          >
            Upload to Vault
          </button>
        </form>
      </Modal>

      {/* Document Preview Modal */}
      <Modal isOpen={previewModalOpen} onClose={() => setPreviewModalOpen(false)} title="Document Viewer">
        {activePreviewDoc && (
          <div className="space-y-4 text-center">
            <div className="p-8 bg-gray-100 dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 flex flex-col items-center space-y-3">
              <FileText className="w-16 h-16 text-emerald-600 animate-pulse" />
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">{activePreviewDoc.doc_name}</h4>
              <StatusBadge status={activePreviewDoc.status} />
              <p className="text-xs text-gray-500">Category: {activePreviewDoc.doc_type} • Size: {activePreviewDoc.file_size}</p>
            </div>
            <button
              onClick={() => handleDownload(activePreviewDoc.doc_name)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl"
            >
              Download Verified Copy
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

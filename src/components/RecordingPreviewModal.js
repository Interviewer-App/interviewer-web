'use client';

import React from 'react';
import { X, Download, Save } from 'lucide-react';

const RecordingPreviewModal = ({ 
  isOpen, 
  onClose, 
  recordingUrl, 
  onDownload, 
  onSave, 
  isLoading = false 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg border border-gray-600 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <h2 className="text-xl font-semibold text-white">Interview Recording Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Video Preview */}
        <div className="p-4">
          {recordingUrl ? (
            <video
              src={recordingUrl}
              controls
              className="w-full max-h-[60vh] bg-black rounded"
              preload="metadata"
            >
              Your browser does not support video playback.
            </video>
          ) : (
            <div className="w-full h-64 bg-gray-700 rounded flex items-center justify-center">
              <p className="text-gray-400">No recording available</p>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-600">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white border border-gray-600 rounded hover:border-gray-500"
          >
            Close
          </button>
          
          <button
            onClick={onDownload}
            disabled={isLoading || !recordingUrl}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          
          <button
            onClick={onSave}
            disabled={isLoading || !recordingUrl}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isLoading ? 'Saving...' : 'Save to Server'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordingPreviewModal;

import React, { useCallback } from 'react';
import { Upload, X, FileText } from 'lucide-react';

interface DocumentsStepProps {
  documents: File[];
  onChange: (documents: File[]) => void;
}

export const DocumentsStep: React.FC<DocumentsStepProps> = ({
  documents,
  onChange,
}) => {
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onChange([...documents, ...files]);
    e.target.value = '';
  }, [documents, onChange]);

  const removeFile = useCallback((index: number) => {
    const newDocuments = documents.filter((_, i) => i !== index);
    onChange(newDocuments);
  }, [documents, onChange]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Upload Documents
        </h3>
        <p className="text-slate-700 text-sm">
          Upload any relevant business documents, licenses, or certificates (optional).
        </p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-200">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-gray-700 mb-2">
          Upload Documents
        </h4>
        <p className="text-gray-500 mb-4">
          Drag and drop files here, or click to browse
        </p>
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors duration-200"
        >
          <Upload className="w-4 h-4 mr-2" />
          Browse Files
        </label>
        <p className="text-xs text-gray-400 mt-2">
          Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB each)
        </p>
      </div>

      {documents.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-md font-semibold text-gray-800">
            Uploaded Documents ({documents.length})
          </h4>
          <div className="space-y-2">
            {documents.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
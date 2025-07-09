import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Upload, 
  Download, 
  Trash2, 
  Eye,
  File,
  Image,
  FileType,
  Calendar,
  Building2
} from 'lucide-react';

export const DocumentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock data - replace with actual API call
  const documents = [
    {
      id: 1,
      file_name: 'business_license.pdf',
      file_size: 2048576, // 2MB
      mime_type: 'application/pdf',
      company: 'Tech Solutions Inc',
      uploaded_by: 'John Doe',
      created_at: '2024-01-15T10:30:00Z',
    },
    {
      id: 2,
      file_name: 'tax_certificate.pdf',
      file_size: 1536000, // 1.5MB
      mime_type: 'application/pdf',
      company: 'Healthcare Plus',
      uploaded_by: 'Jane Smith',
      created_at: '2024-01-20T14:15:00Z',
    },
    {
      id: 3,
      file_name: 'company_logo.png',
      file_size: 512000, // 500KB
      mime_type: 'image/png',
      company: 'Tech Solutions Inc',
      uploaded_by: 'Mike Johnson',
      created_at: '2024-02-01T09:00:00Z',
    },
    {
      id: 4,
      file_name: 'incorporation_docs.docx',
      file_size: 3072000, // 3MB
      mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      company: 'Healthcare Plus',
      uploaded_by: 'Sarah Wilson',
      created_at: '2024-02-05T16:45:00Z',
    },
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.uploaded_by.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      selectedFilter === 'all' ||
      (selectedFilter === 'pdf' && doc.mime_type === 'application/pdf') ||
      (selectedFilter === 'image' && doc.mime_type.startsWith('image/')) ||
      (selectedFilter === 'document' && doc.mime_type.includes('document'));

    return matchesSearch && matchesFilter;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/pdf') {
      return <File className="w-5 h-5 text-red-600" />;
    } else if (mimeType.startsWith('image/')) {
      return <Image className="w-5 h-5 text-green-600" />;
    } else if (mimeType.includes('document') || mimeType.includes('word')) {
      return <FileType className="w-5 h-5 text-blue-600" />;
    }
    return <FileText className="w-5 h-5 text-gray-600" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalSize = documents.reduce((acc, doc) => acc + doc.file_size, 0);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Document Management</h2>
          <p className="text-gray-600">Manage uploaded documents and files</p>
        </div>
        <button className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Documents</p>
              <p className="text-2xl font-bold text-blue-800">{documents.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-600 text-sm font-medium">Total Size</p>
              <p className="text-2xl font-bold text-emerald-800">{formatFileSize(totalSize)}</p>
            </div>
            <FileText className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-medium">PDF Files</p>
              <p className="text-2xl font-bold text-amber-800">
                {documents.filter(d => d.mime_type === 'application/pdf').length}
              </p>
            </div>
            <File className="w-8 h-8 text-amber-600" />
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Images</p>
              <p className="text-2xl font-bold text-purple-800">
                {documents.filter(d => d.mime_type.startsWith('image/')).length}
              </p>
            </div>
            <Image className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Files</option>
          <option value="pdf">PDF Files</option>
          <option value="image">Images</option>
          <option value="document">Documents</option>
        </select>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((document) => (
                <tr key={document.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getFileIcon(document.mime_type)}
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {document.file_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {document.mime_type}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatFileSize(document.file_size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-1 text-gray-400" />
                      {document.company}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {document.uploaded_by}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                      {formatDate(document.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900 p-1 rounded"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDocuments.length === 0 && (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No documents found</p>
          </div>
        )}
      </div>
    </div>
  );
};
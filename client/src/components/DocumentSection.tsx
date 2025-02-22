import React from "react";
import { FileText, ExternalLink, Trash2, Upload } from "lucide-react";
import { DocumentSectionProps } from "../types/index";
import { useDocument } from "../contexts/document.context";
import { useNavigate } from "react-router-dom";

export const DocumentSection: React.FC<DocumentSectionProps> = ({
  title,
  documents,
  showUpload,
}) => {
  const { deleteDocument } = useDocument();
  const navigate = useNavigate();

  return (
    <div
      className={`p-8 rounded-3xl ${
        showUpload ? "bg-gray-200" : "bg-[#E5F9FF]"
      }`}
    >
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid gap-4">
        {documents.map((doc) => (
          <div
            key={doc.public_id}
            className="group bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-inner">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">
                    {doc.public_id.split("_").slice(0, -1).join("_")}
                  </span>
                  <span className="text-sm text-gray-500 uppercase">
                    {doc.format}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 opacity-90 group-hover:opacity-100">
                <button
                  className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors relative group/tooltip"
                  onClick={() => window.open(doc.secure_url, "_blank")}
                >
                  <ExternalLink className="h-5 w-5" />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap">
                    View Document
                  </span>
                </button>

                <button className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors relative group/tooltip" onClick={() => deleteDocument(doc.public_id, doc.resource_type)}>
                  <Trash2 className="h-5 w-5" />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap">
                    Delete Document
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {documents.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No documents yet
            </h3>
            <p className="text-gray-500">
              Upload your first document to get started
            </p>
          </div>
        )}
      </div>
      {showUpload && (
        <button className="w-full mt-6 py-3 bg-[#00B6F0] text-white rounded-lg hover:bg-[#008bc0] transition-colors flex items-center justify-center gap-2" onClick={() => navigate('/upload')}>
        <Upload className="h-5 w-5" />
        <span>Upload new document</span>
            </button>
      )}
    </div>
  );
};

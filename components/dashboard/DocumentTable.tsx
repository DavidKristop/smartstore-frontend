"use client";

import {
  File,
  Download,
  Trash2,
  MoreVertical,
  Eye,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Document {
  id: string;
  name: string;
  subject: string;
  size: string;
  uploadedDate: string;
  type: string;
}

interface DocumentTableProps {
  documents: Document[];
  onDelete?: (id: string) => void;
  onDownload?: (id: string) => void;
  isAdmin?: boolean;
}

export const DocumentTable = ({
  documents,
  onDelete,
  onDownload,
  isAdmin = false,
}: DocumentTableProps) => {
  const getFileIcon = (type: string) => {
    const iconProps = "h-5 w-5";
    switch (type.toLowerCase()) {
      case "pdf":
        return <File className={`${iconProps} text-red-500`} />;
      case "docx":
        return <File className={`${iconProps} text-blue-500`} />;
      case "pptx":
        return <File className={`${iconProps} text-orange-500`} />;
      default:
        return <File className={`${iconProps} text-gray-500`} />;
    }
  };

  return (
    <div className="background-light800_dark400 light-border-2 rounded-2xl border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead>
            <tr className="background-light700_dark500 border-b border-light700_dark500">
              <th className="px-6 py-4 text-left">
                <span className="paragraph-medium text-dark400_light700">
                  File Name
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="paragraph-medium text-dark400_light700">
                  Subject
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="paragraph-medium text-dark400_light700">
                  Size
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="paragraph-medium text-dark400_light700">
                  Uploaded Date
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="paragraph-medium text-dark400_light700">
                  Actions
                </span>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-light700_dark500">
            {documents.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center">
                  <p className="paragraph-regular text-dark400_light700">
                    No documents found
                  </p>
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr
                  key={doc.id}
                  className="transition-colors duration-200 hover:background-light700_dark500"
                >
                  {/* File Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getFileIcon(doc.type)}
                      <span className="paragraph-medium text-dark200_light800">
                        {doc.name}
                      </span>
                    </div>
                  </td>

                  {/* Subject */}
                  <td className="px-6 py-4">
                    <span className="paragraph-regular text-dark300_light700">
                      {doc.subject}
                    </span>
                  </td>

                  {/* Size */}
                  <td className="px-6 py-4">
                    <span className="paragraph-regular text-dark300_light700">
                      {doc.size}
                    </span>
                  </td>

                  {/* Uploaded Date */}
                  <td className="px-6 py-4">
                    <span className="paragraph-regular text-dark300_light700">
                      {doc.uploadedDate}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onDownload?.(doc.id)}
                        className="rounded-lg p-2 transition-all duration-200 hover:background-light700_dark500"
                        title="Download"
                      >
                        <Download className="h-4 w-4 text-blue-500" />
                      </button>

                      {!isAdmin && (
                        <>
                          <button
                            className="rounded-lg p-2 transition-all duration-200 hover:background-light700_dark500"
                            title="View"
                          >
                            <Eye className="h-4 w-4 text-green-500" />
                          </button>
                          <button
                            className="rounded-lg p-2 transition-all duration-200 hover:background-light700_dark500"
                            title="Share"
                          >
                            <Share2 className="h-4 w-4 text-purple-500" />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => onDelete?.(doc.id)}
                        className="rounded-lg p-2 transition-all duration-200 hover:background-light700_dark500"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>

                      <button className="rounded-lg p-2 transition-all duration-200 hover:background-light700_dark500">
                        <MoreVertical className="h-4 w-4 text-dark400_light700" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

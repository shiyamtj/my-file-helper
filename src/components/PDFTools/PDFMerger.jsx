import { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Common/Card';
import Button from '../Common/Button';
import FileUpload from '../Common/FileUpload';
import Alert from '../Common/Alert';
import LoadingOverlay from '../Common/LoadingOverlay';
import { mergePDFs, getPDFPageCount } from '../../utils/pdfUtils';
import { formatFileSize } from '../../utils/fileUtils';
import { Download, GripVertical, Trash2, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

const PDFMerger = () => {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [pageCounts, setPageCounts] = useState({});
  const [mergedPdf, setMergedPdf] = useState(null);
  const [previewPdf, setPreviewPdf] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef(null);

  const handleFilesSelected = async (selectedFiles) => {
    setFiles(selectedFiles);
    setError(null);
    setMergedPdf(null);
    setPreviewPdf(null);
    setShowPreview(false);

    // Get page counts for each PDF
    const counts = {};
    for (const file of selectedFiles) {
      try {
        const count = await getPDFPageCount(file);
        counts[file.name] = count;
      } catch (err) {
        console.error('Error getting page count:', err);
      }
    }
    setPageCounts(counts);
  };

  const moveFile = (fromIndex, toIndex) => {
    const newFiles = [...files];
    const [movedFile] = newFiles.splice(fromIndex, 1);
    newFiles.splice(toIndex, 0, movedFile);
    setFiles(newFiles);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    setMergedPdf(null);
    setPreviewPdf(null);
  };

  const handlePreview = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to preview');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const blob = await mergePDFs(files);
      setPreviewPdf(blob);
      setShowPreview(true);
    } catch (err) {
      setError('Failed to generate preview. Please try again.');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const blob = await mergePDFs(files);
      setMergedPdf(blob);
      setPreviewPdf(blob);
    } catch (err) {
      setError('Failed to merge PDFs. Please try again.');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!mergedPdf) return;
    const url = URL.createObjectURL(mergedPdf);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card id="pdf-merge">
      <CardHeader>
        <CardTitle>PDF Merge</CardTitle>
        <CardDescription>
          Combine multiple PDF files into a single document. Drag and drop to reorder.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FileUpload
          onFilesSelected={handleFilesSelected}
          accept={{ 'application/pdf': ['.pdf'] }}
          maxFiles={20}
          maxSizeMB={100}
        />

        {error && (
          <Alert variant="destructive" onDismiss={() => setError(null)}>
            {error}
          </Alert>
        )}

        {files.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Files to merge (drag to reorder)</h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-muted rounded-lg group"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                    moveFile(fromIndex, index);
                  }}
                >
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} • {pageCounts[file.name] || '?'} pages
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => moveFile(index, index - 1)}
                      disabled={index === 0}
                      className="p-1 hover:bg-background rounded transition-colors disabled:opacity-30"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveFile(index, index + 1)}
                      disabled={index === files.length - 1}
                      className="p-1 hover:bg-background rounded transition-colors disabled:opacity-30"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 hover:bg-destructive/10 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      {files.length >= 2 && (
        <CardFooter className="flex justify-between flex-wrap gap-4">
          <p className="text-sm text-muted-foreground">
            {files.length} file{files.length > 1 ? 's' : ''} selected
          </p>
          <div className="flex gap-2">
            {!mergedPdf && (
              <Button onClick={handlePreview} disabled={processing} variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            )}
            {mergedPdf ? (
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download Merged PDF
              </Button>
            ) : (
              <Button onClick={handleMerge} disabled={processing}>
                {processing ? 'Merging...' : 'Merge PDFs'}
              </Button>
            )}
          </div>
        </CardFooter>
      )}

      {processing && <LoadingOverlay message="Merging PDFs..." />}

      {showPreview && previewPdf && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border-2 border-primary rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-muted/50">
              <h3 className="text-lg font-semibold">Preview Merged PDF</h3>
              <Button variant="outline" size="sm" onClick={() => setShowPreview(false)}>
                Close
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-muted/30 min-h-[500px]">
              <iframe
                ref={previewRef}
                src={URL.createObjectURL(previewPdf)}
                className="w-full h-[600px] border-2 border-border rounded-lg bg-white"
                title="PDF Preview"
              />
            </div>
            <div className="flex justify-end gap-2 p-4 border-t bg-muted/50">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Back
              </Button>
              {/*<Button onClick={handleMerge} disabled={processing}>
                {processing ? 'Merging...' : 'Merge & Download'}
              </Button>*/}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PDFMerger;

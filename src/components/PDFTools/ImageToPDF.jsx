import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Common/Card';
import Button from '../Common/Button';
import FileUpload from '../Common/FileUpload';
import Alert from '../Common/Alert';
import LoadingOverlay from '../Common/LoadingOverlay';
import { formatFileSize } from '../../utils/fileUtils';
import { Download, Image as ImageIcon, Trash2, GripVertical, Eye, RotateCcw } from 'lucide-react';
import jsPDF from 'jspdf';

const ImageToPDF = () => {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [previews, setPreviews] = useState({});
  const [previewPdf, setPreviewPdf] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef(null);
  
  // Settings
  const [pageSize, setPageSize] = useState('a4');
  const [quality, setQuality] = useState('medium');
  const [fitMode, setFitMode] = useState('fit');
  const [orientation, setOrientation] = useState('portrait');

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
    setError(null);
    setPdfBlob(null);
    setPreviewPdf(null);
    setShowPreview(false);

    // Generate previews
    selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => ({
          ...prev,
          [file.name]: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPdfBlob(null);
    setPreviewPdf(null);
  };

  const handleReset = () => {
    setFiles([]);
    setPreviews({});
    setPdfBlob(null);
    setPreviewPdf(null);
    setError(null);
    setPageSize('a4');
    setQuality('medium');
    setFitMode('fit');
    setOrientation('portrait');
  };

  // Regenerate preview when files or settings change
  const regeneratePreview = () => {
    if (files.length > 0) {
      handlePreview();
    }
  };

  useEffect(() => {
    regeneratePreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, pageSize, quality, fitMode, orientation]);

  const handlePreview = async () => {
    if (files.length === 0) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { width: pageWidth, height: pageHeight } = getPageSize();
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format: pageSize
      });

      const scale = getQualityScale();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (i > 0) {
          pdf.addPage();
        }

        const imgData = previews[file.name];
        if (!imgData) continue;

        const img = new Image();
        img.src = imgData;
        
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        let imgWidth, imgHeight, x, y;

        if (fitMode === 'fit') {
          const imgRatio = img.width / img.height;
          const pageRatio = pageWidth / pageHeight;
          
          if (imgRatio > pageRatio) {
            imgWidth = pageWidth;
            imgHeight = pageWidth / imgRatio;
          } else {
            imgHeight = pageHeight;
            imgWidth = pageHeight * imgRatio;
          }
          x = (pageWidth - imgWidth) / 2;
          y = (pageHeight - imgHeight) / 2;
        } else if (fitMode === 'stretch') {
          imgWidth = pageWidth;
          imgHeight = pageHeight;
          x = 0;
          y = 0;
        } else {
          imgWidth = (img.width * 0.264583) / scale;
          imgHeight = (img.height * 0.264583) / scale;
          x = (pageWidth - imgWidth) / 2;
          y = (pageHeight - imgHeight) / 2;
        }

        pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight, undefined, 'FAST');
      }

      const blob = pdf.output('blob');
      setPreviewPdf(blob);
    } catch (err) {
      setError('Failed to generate preview. Please try again.');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const moveFile = (fromIndex, toIndex) => {
    const newFiles = [...files];
    const [movedFile] = newFiles.splice(fromIndex, 1);
    newFiles.splice(toIndex, 0, movedFile);
    setFiles(newFiles);
  };

  const getPageSize = () => {
    const sizes = {
      a4: { width: 210, height: 297 },
      letter: { width: 216, height: 279 },
      legal: { width: 216, height: 356 }
    };
    const size = sizes[pageSize] || sizes.a4;
    if (orientation === 'landscape') {
      return { width: size.height, height: size.width };
    }
    return size;
  };

  const getQualityScale = () => {
    const scales = {
      low: 0.5,
      medium: 1,
      high: 2
    };
    return scales[quality] || 1;
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      setError('Please select at least 1 image file');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { width: pageWidth, height: pageHeight } = getPageSize();
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format: pageSize
      });

      const scale = getQualityScale();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (i > 0) {
          pdf.addPage();
        }

        const imgData = previews[file.name];
        if (!imgData) continue;

        const img = new Image();
        img.src = imgData;
        
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        let imgWidth, imgHeight, x, y;

        if (fitMode === 'fit') {
          const imgRatio = img.width / img.height;
          const pageRatio = pageWidth / pageHeight;
          
          if (imgRatio > pageRatio) {
            imgWidth = pageWidth;
            imgHeight = pageWidth / imgRatio;
          } else {
            imgHeight = pageHeight;
            imgWidth = pageHeight * imgRatio;
          }
          x = (pageWidth - imgWidth) / 2;
          y = (pageHeight - imgHeight) / 2;
        } else if (fitMode === 'stretch') {
          imgWidth = pageWidth;
          imgHeight = pageHeight;
          x = 0;
          y = 0;
        } else {
          // Original size
          imgWidth = (img.width * 0.264583) / scale; // Convert pixels to mm
          imgHeight = (img.height * 0.264583) / scale;
          x = (pageWidth - imgWidth) / 2;
          y = (pageHeight - imgHeight) / 2;
        }

        pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight, undefined, 'FAST');
      }

      const blob = pdf.output('blob');
      setPdfBlob(blob);
      setPreviewPdf(blob);
    } catch (err) {
      setError('Failed to convert images to PDF. Please try again.');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'images.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card id="image-to-pdf">
      <CardHeader>
        <CardTitle>Image to PDF</CardTitle>
        <CardDescription>
          Convert JPG and PNG images to PDF. Customize page size, quality, and fit mode.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FileUpload
          onFilesSelected={handleFilesSelected}
          accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }}
          maxFiles={50}
          maxSizeMB={50}
        />

        {error && (
          <Alert variant="destructive" onDismiss={() => setError(null)}>
            {error}
          </Alert>
        )}

        {files.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <label className="text-sm font-medium mb-2 block">Page Size</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value)}
                  className="w-full p-2 rounded-md border bg-background"
                >
                  <option value="a4">A4</option>
                  <option value="letter">Letter</option>
                  <option value="legal">Legal</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Orientation</label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value)}
                  className="w-full p-2 rounded-md border bg-background"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Quality</label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full p-2 rounded-md border bg-background"
                >
                  <option value="low">Low (Smaller file)</option>
                  <option value="medium">Medium</option>
                  <option value="high">High (Better quality)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Fit Mode</label>
              <div className="flex gap-2">
                {['fit', 'stretch', 'original'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setFitMode(mode)}
                    className={`px-4 py-2 rounded-md border transition-colors ${
                      fitMode === mode
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background hover:bg-muted'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Images to convert (drag to reorder)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="relative group"
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('text/plain', index)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                        moveFile(fromIndex, index);
                      }}
                    >
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                        {previews[file.name] ? (
                          <img
                            src={previews[file.name]}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => removeFile(index)}
                          className="p-1 bg-destructive/80 rounded-full hover:bg-destructive"
                        >
                          <Trash2 className="h-3 w-3 text-white" />
                        </button>
                      </div>
                      <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-1 bg-background/80 rounded-full cursor-move">
                          <GripVertical className="h-3 w-3" />
                        </div>
                      </div>
                      <p className="text-xs mt-1 truncate">{file.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {previewPdf && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">PDF Preview</h3>
                  <div className="bg-muted/30 rounded-lg p-4 min-h-[400px]">
                    <iframe
                      ref={previewRef}
                      src={URL.createObjectURL(previewPdf)}
                      className="w-full h-[500px] border-2 border-border rounded-lg bg-white"
                      title="PDF Preview"
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
      {files.length > 0 && (
        <CardFooter className="flex justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {files.length} image{files.length > 1 ? 's' : ''} selected
            </p>
            <Button onClick={handleReset} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
          <div className="flex gap-2">
            {pdfBlob ? (
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            ) : (
              <Button onClick={handleConvert} disabled={processing}>
                {processing ? 'Converting...' : 'Convert to PDF'}
              </Button>
            )}
          </div>
        </CardFooter>
      )}

      {processing && <LoadingOverlay message="Converting images to PDF..." />}
    </Card>
  );
};

export default ImageToPDF;

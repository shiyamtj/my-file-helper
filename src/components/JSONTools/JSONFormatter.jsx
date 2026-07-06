import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Common/Card';
import Button from '../Common/Button';
import Alert from '../Common/Alert';
import { formatJSON, validateJSON, minifyJSON, extractJSONPath } from '../../utils/jsonUtils';
import { Copy, Check, Download, Upload, FileText } from 'lucide-react';

const JSONFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState('format'); // format, minify, validate, path
  const [pathQuery, setPathQuery] = useState('');
  const [pathResult, setPathResult] = useState(null);

  const handleFormat = () => {
    setError(null);
    try {
      const formatted = formatJSON(input, indent);
      setOutput(formatted);
      setPathResult(null);
    } catch (err) {
      setError('Invalid JSON: ' + err.message);
      setOutput('');
    }
  };

  const handleMinify = () => {
    setError(null);
    try {
      const minified = minifyJSON(input);
      setOutput(minified);
      setPathResult(null);
    } catch (err) {
      setError('Invalid JSON: ' + err.message);
      setOutput('');
    }
  };

  const handleValidate = () => {
    setError(null);
    const result = validateJSON(input);
    if (result.valid) {
      setOutput('✓ Valid JSON');
      setPathResult(null);
    } else {
      setError('Invalid JSON: ' + result.error);
      setOutput('');
    }
  };

  const handlePathExtract = () => {
    setError(null);
    try {
      const result = extractJSONPath(input, pathQuery);
      if (result.success) {
        setPathResult(JSON.stringify(result.result, null, 2));
        setOutput('');
      } else {
        setError('Error: ' + result.error);
        setPathResult(null);
      }
    } catch (err) {
      setError('Invalid JSON or path: ' + err.message);
      setPathResult(null);
    }
  };

  const handleCopy = () => {
    const textToCopy = pathResult || output;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textToCopy = pathResult || output;
    const blob = new Blob([textToCopy], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'path' ? 'path-result.json' : 'formatted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setInput(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
    setPathResult(null);
    setPathQuery('');
  };

  return (
    <Card id="json-tools">
      <CardHeader>
        <CardTitle>JSON Tools</CardTitle>
        <CardDescription>
          Format, validate, minify, and extract data from JSON using JSONPath queries.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mode Selection */}
        <div className="flex flex-wrap gap-2">
          {['format', 'minify', 'validate', 'path'].map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setError(null);
                setPathResult(null);
              }}
              className={`px-4 py-2 rounded-md border transition-colors capitalize ${
                mode === m
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background hover:bg-muted'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Input Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Input JSON</label>
            <div className="flex gap-2">
              <label className="cursor-pointer">
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </label>
              <Button variant="outline" size="sm" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            className="w-full h-48 p-3 rounded-md border bg-background font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* JSONPath Input */}
        {mode === 'path' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">JSONPath Query</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={pathQuery}
                onChange={(e) => setPathQuery(e.target.value)}
                placeholder="$.store.book[*].author"
                className="flex-1 p-2 rounded-md border bg-background font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button onClick={handlePathExtract}>Extract</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Examples: $.store.book[0].title, $..author, $.store.book[*].price
            </p>
          </div>
        )}

        {/* Indent Selection for Format Mode */}
        {mode === 'format' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Indentation</label>
            <div className="flex gap-2">
              {[2, 4].map((spaces) => (
                <button
                  key={spaces}
                  onClick={() => setIndent(spaces)}
                  className={`px-4 py-2 rounded-md border transition-colors ${
                    indent === spaces
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background hover:bg-muted'
                  }`}
                >
                  {spaces} spaces
                </button>
              ))}
              <button
                onClick={() => setIndent('\t')}
                className={`px-4 py-2 rounded-md border transition-colors ${
                  indent === '\t'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-muted'
                }`}
              >
                Tab
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {mode === 'format' && <Button onClick={handleFormat}>Format</Button>}
          {mode === 'minify' && <Button onClick={handleMinify}>Minify</Button>}
          {mode === 'validate' && <Button onClick={handleValidate}>Validate</Button>}
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" onDismiss={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Output Display */}
        {(output || pathResult) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                {mode === 'path' ? 'Path Result' : 'Output'}
              </label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <pre className="w-full h-64 p-3 rounded-md border bg-muted overflow-auto font-mono text-sm">
              {pathResult || output}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JSONFormatter;

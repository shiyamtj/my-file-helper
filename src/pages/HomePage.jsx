import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Common/Card';
import { Link } from 'react-router-dom';
import { FileText, Image as ImageIcon, Code } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Free File Utilities</h2>
        <p className="text-muted-foreground">
          Process your files securely in your browser. No signup required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/pdf-merge">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <FileText className="h-12 w-12 text-primary mb-4" />
              <CardTitle>PDF Merge</CardTitle>
              <CardDescription>
                Combine multiple PDF files into a single document with drag-and-drop reordering.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/image-to-pdf">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <ImageIcon className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Image to PDF</CardTitle>
              <CardDescription>
                Convert JPG and PNG images to PDF with customizable page size, quality, and fit modes.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/json-tools">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <Code className="h-12 w-12 text-primary mb-4" />
              <CardTitle>JSON Tools</CardTitle>
              <CardDescription>
                Format, validate, minify, and extract data from JSON using JSONPath queries.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;

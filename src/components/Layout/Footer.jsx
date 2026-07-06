import { Shield, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-muted/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Privacy First</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              All processing happens in your browser. Your files never leave your device.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Merge PDFs</li>
              <li>• Convert Images to PDF</li>
              <li>• Format & Validate JSON</li>
              <li>• JSON Path Extraction</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Open Source</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Free to use, no signup required. Hosted on GitHub Pages.
            </p>
            <a
              href="https://github.com/shiyamtj/my-file-helper"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>Built with React, TailwindCSS, and client-side processing libraries.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

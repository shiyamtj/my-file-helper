# File Utilities

A modern, client-side file processing web application built with React. Merge PDFs, convert images to PDF, and format JSON - all securely in your browser with no server uploads.

## Features

- **PDF Merge**: Combine multiple PDF files into a single document with drag-and-drop reordering
- **Image to PDF**: Convert JPG/PNG images to PDF with customizable page size, quality, and fit modes
- **JSON Tools**: Format, validate, minify, and extract data using JSONPath queries
- **100% Client-Side**: All processing happens in your browser - your files never leave your device
- **No Signup Required**: Free to use without any registration
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

## Tech Stack

- React 18 with Vite
- TailwindCSS for styling
- pdf-lib for PDF manipulation
- jspdf for image-to-PDF conversion
- jsonpath-plus for JSON path extraction
- react-dropzone for file uploads

## Local Development

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/my-file-helper.git
cd my-file-helper
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## GitHub Pages Deployment

### Initial Setup

1. **Create a GitHub Repository**
   - Go to [GitHub](https://github.com) and create a new public repository named `my-file-helper`
   - Initialize it with a README (you can replace it with this one)

2. **Push Your Code**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/my-file-helper.git
   git push -u origin main
   ```

3. **Update package.json**
   - Replace `your-username` in the `homepage` field with your actual GitHub username:
   ```json
   "homepage": "https://your-username.github.io/my-file-helper"
   ```

4. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to **Settings** > **Pages**
   - Under **Build and deployment**, select **GitHub Actions** as the source
   - The workflow file (`.github/workflows/deploy.yml`) will automatically deploy your site

5. **Automatic Deployment**
   - Every push to the `main` branch will trigger a new deployment
   - Your site will be available at `https://your-username.github.io/my-file-helper`

### Manual Deployment (Alternative)

If you prefer not to use GitHub Actions:

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Update package.json homepage field with your GitHub username

3. Deploy:
```bash
npm run deploy
```

## Privacy & Security

- **Client-Side Processing**: All file processing happens entirely in your browser using JavaScript libraries
- **No Server Uploads**: Your files are never sent to any server
- **No Tracking**: No analytics or tracking scripts
- **Open Source**: All code is publicly available for review

## File Size Limits

- Warning for files >50MB (processing may take longer)
- Blocks files >100MB (browser processing limitations)

## Usage

### PDF Merge

1. Select the "PDF Merge" tab
2. Drag and drop PDF files or click to select
3. Reorder files by dragging or using the up/down arrows
4. Click "Merge PDFs" to combine
5. Download the merged PDF

### Image to PDF

1. Select the "Image to PDF" tab
2. Upload JPG or PNG images
3. Configure settings:
   - Page size (A4, Letter, Legal)
   - Orientation (Portrait/Landscape)
   - Quality (Low/Medium/High)
   - Fit mode (Fit/Stretch/Original)
4. Reorder images by dragging
5. Click "Convert to PDF"
6. Download the generated PDF

### JSON Tools

1. Select the "JSON Tools" tab
2. Choose a mode:
   - **Format**: Pretty-print JSON with custom indentation
   - **Minify**: Remove whitespace
   - **Validate**: Check JSON syntax
   - **Path**: Extract data using JSONPath queries
3. Paste or upload your JSON
4. For Path mode, enter a JSONPath query (e.g., `$.store.book[*].author`)
5. Click the action button
6. Copy or download the result

## JSONPath Examples

- `$.store.book[0].title` - Get first book title
- `$..author` - Get all authors
- `$.store.book[*].price` - Get all book prices
- `$.store.book[?(@.price < 10)]` - Filter books under $10

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for any purpose.

## Acknowledgments

- [pdf-lib](https://pdf-lib.js.org/) for PDF manipulation
- [jspdf](https://github.com/parallax/jsPDF) for PDF generation
- [jsonpath-plus](https://github.com/s3u/JSONPath) for JSONPath queries
- [TailwindCSS](https://tailwindcss.com/) for styling

import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PDFMergePage from './pages/PDFMergePage';
import ImageToPDFPage from './pages/ImageToPDFPage';
import JSONToolsPage from './pages/JSONToolsPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pdf-merge" element={<PDFMergePage />} />
          <Route path="/image-to-pdf" element={<ImageToPDFPage />} />
          <Route path="/json-tools" element={<JSONToolsPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;

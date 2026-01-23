import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';

import TextTools from './pages/TextTools';

import PDFTools from './pages/PDFTools';

import BPMNModeler from './pages/BPMNModeler';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="text-editor" element={<TextTools />} />
            <Route path="pdf-tools" element={<PDFTools />} />
            <Route path="bpmn" element={<BPMNModeler />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

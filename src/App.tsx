import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProjectList from './pages/ProjectList';
import AdminProject from "./pages/AdminProject.tsx";

const theme = createTheme({
  palette: {
    primary: {
      main: '#374151', // Charcoal (Main Background)
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0D9488', // Teal Green (Button/Point)
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#374151', // 배경색을 차콜로 지정
      paper: '#4B5563',   // 카드 등 요소는 살짝 밝은 회색
    },
    text: {
      primary: '#FFFFFF',   // 메인 텍스트: 화이트
      secondary: '#9CA3AF', // 보조 텍스트: 연회색
    },
  },
  typography: {
    fontFamily: 'Pretendard, -apple-system, sans-serif',
  },
});

const App: React.FC = () => {
  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<ProjectList />} />
                <Route path="/admin/projects/new" element={<AdminProject />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </ThemeProvider>
  );
};

export default App;
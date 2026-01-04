import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, CircularProgress } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProjectList from './pages/ProjectList';
import AdminProject from "./pages/AdminProject.tsx";
import AdminSettings from "./pages/AdminSettings.tsx";
import Login from "./pages/Login.tsx";
import ProtectedRoute from './components/ProtectedRoute';
import api from './services/api';
import type { SiteConfig } from './types';

const App: React.FC = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. 서버로부터 사이트 설정(색상, 타이틀 등)을 불러옵니다.
    api.get<SiteConfig>('/config')
        .then(res => {
          setConfig(res.data);
        })
        .catch(err => {
          console.error("사이트 설정을 불러오지 못했습니다. 기본 테마를 사용합니다.", err);
        })
        .finally(() => {
          setLoading(false);
        });
  }, []);

  // 2. 불러온 설정값을 바탕으로 MUI 테마를 동적으로 생성합니다.
  const theme = useMemo(() => {
    return createTheme({
      palette: {
        primary: {
          main: config?.primaryColor || '#374151', // DB에 저장된 메인 색상
          contrastText: '#FFFFFF',
        },
        secondary: {
          main: config?.secondaryColor || '#0D9488', // DB에 저장된 포인트 색상
          contrastText: '#FFFFFF',
        },
        background: {
          default: config?.primaryColor || '#374151',
          paper: '#4B5563',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#9CA3AF',
        },
      },
      typography: {
        fontFamily: 'Pretendard, -apple-system, sans-serif',
      },
      components: {
        // Nav 색상 변경을 위해 AppBar 등에 커스텀 스타일을 적용할 수 있습니다.
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: config?.navColor || 'transparent',
            }
          }
        }
      }
    });
  }, [config]);

  if (loading) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#374151' }}>
          <CircularProgress color="secondary" />
        </Box>
    );
  }

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Navbar 내부에서 config 정보를 받아 메뉴를 동적으로 보여줄 수 있습니다. */}
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<Home config={config} />} />
                <Route path="/projects" element={<ProjectList />} />
                <Route path="/login" element={<Login />} /> {/* 로그인 경로 추가 */}

                {/* 관리자 전용 경로 보호 */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/admin/projects/new" element={<AdminProject />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                </Route>
              </Routes>
            </Box>
          </Box>
        </Router>
      </ThemeProvider>
  );
};

export default App;
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
import ProjectDetail from "./pages/ProjectDetail.tsx";

const App: React.FC = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 1. 관리자 인증 상태를 App 수준에서 관리합니다.
  // 초기값은 localStorage의 비밀번호 존재 여부에 따라 결정됩니다.
  const [isAdmin, setIsAdmin] = useState<boolean>(!!localStorage.getItem('admin_password'));

  useEffect(() => {
    // 서버로부터 사이트 설정을 불러옵니다.
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

  // MUI 테마 설정
  const theme = useMemo(() => {
    return createTheme({
      palette: {
        primary: {
          main: config?.primaryColor || '#374151',
          contrastText: '#FFFFFF',
        },
        secondary: {
          main: config?.secondaryColor || '#0D9488',
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
            {/* 2. Navbar에 isAdmin 상태와 상태 변경 함수를 전달합니다. */}
            <Navbar isAdmin={isAdmin} setIsAdmin={setIsAdmin} />

            <Box component="main" sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<Home config={config} />} />
                <Route path="/projects" element={<ProjectList />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />

                {/* 3. Login 페이지에 setIsAdmin을 전달하여 로그인 시 상태를 업데이트하게 합니다. */}
                <Route path="/login" element={<Login setIsAdmin={setIsAdmin} />} />

                {/* 관리자 전용 경로 보호 */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/admin/projects/new" element={<AdminProject />} />
                  <Route path="/admin/projects/edit/:id" element={<AdminProject />} />
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
import React from 'react';
import { Box, Typography, Button, Container, Fade, Avatar, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { SiteConfig } from '../types';

interface HomeProps {
    config: SiteConfig | null;
}

const Home: React.FC<HomeProps> = ({ config }) => {
    // DB에 저장된 값이 없을 경우 사용할 기본 문구 및 이미지
    const mainTitle = config?.mainTitle || "머릿속의 아이디어가 \n살아 움직이는 실체가 될 때까지";
    const subTitle = config?.subTitle || "상상한 것을 코드로 구현하고 개선하는 과정에서 \n보람을 느끼는 개발자 이승엽입니다.";
    const mainImage = config?.mainImageUrl || "";

    return (
        <Box
            sx={{
                bgcolor: 'background.default',
                minHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                py: { xs: 8, md: 0 }
            }}
        >
            <Container maxWidth="lg">
                <Fade in={true} timeout={1500}>
                    <Stack
                        direction={{ xs: 'column', md: 'row-reverse' }} // 모바일은 세로, 데스크톱은 사진이 오른쪽
                        spacing={{ xs: 6, md: 10 }}
                        alignItems="center"
                        justifyContent="center"
                    >
                        {/* 1. 사진 영역 */}
                        <Box sx={{ flexShrink: 0 }}>
                            <Avatar
                                src={mainImage}
                                alt="Profile"
                                sx={{
                                    width: { xs: 250, md: 350 },
                                    height: { xs: 250, md: 350 },
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                                    border: '4px solid',
                                    borderColor: 'secondary.main'
                                }}
                            >
                                {/* 이미지가 없을 때 보여줄 대체 아이콘이나 텍스트 */}
                                {!mainImage && "SY"}
                            </Avatar>
                        </Box>

                        {/* 2. 텍스트 영역 */}
                        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                            <Typography
                                variant="h2"
                                sx={{
                                    fontWeight: 900,
                                    color: 'text.primary',
                                    mb: 4,
                                    wordBreak: 'keep-all',
                                    whiteSpace: 'pre-line', // \n 줄바꿈 반영
                                    fontSize: { xs: '2.5rem', md: '3.5rem' }
                                }}
                            >
                                {mainTitle}
                            </Typography>

                            <Typography
                                variant="h5"
                                color="text.secondary"
                                sx={{
                                    mb: 6,
                                    fontWeight: 400,
                                    lineHeight: 1.6,
                                    whiteSpace: 'pre-line',
                                    fontSize: { xs: '1rem', md: '1.25rem' }
                                }}
                            >
                                {subTitle}
                            </Typography>

                            <Button
                                variant="contained"
                                color="secondary"
                                size="large"
                                component={RouterLink}
                                to="/projects"
                                sx={{
                                    px: 6,
                                    py: 1.8,
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    borderRadius: '4px',
                                    '&:hover': {
                                        backgroundColor: '#0A766D',
                                        boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
                                    }
                                }}
                            >
                                나의 구현물 보기
                            </Button>
                        </Box>
                    </Stack>
                </Fade>
            </Container>
        </Box>
    );
};

export default Home;
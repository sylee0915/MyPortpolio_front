import React from 'react';
import { Box, Typography, Button, Container, Fade } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <Box
            sx={{
                bgcolor: 'background.default',
                minHeight: '90vh',
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <Container maxWidth="md">
                <Fade in={true} timeout={1500}>
                    <Box>
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 900,
                                color: 'text.primary',
                                mb: 4,
                                wordBreak: 'keep-all'
                            }}
                        >
                            머릿속의 아이디어가 <br />
                            살아 움직이는 실체가 될 때까지, <br />
                            <Typography
                                component="span"
                                variant="inherit"
                                sx={{ color: 'secondary.main' }}
                            >
                                집요하게
                            </Typography> 구현합니다.
                        </Typography>

                        <Typography
                            variant="h5"
                            color="text.secondary"
                            sx={{
                                mb: 6,
                                fontWeight: 400,
                                lineHeight: 1.6,
                                fontSize: { xs: '1.1rem', md: '1.5rem' }
                            }}
                        >
                            상상한 것을 코드로 구현하고, 직접 조작하며 개선하는 과정에서 <br />
                            가장 큰 보람을 느끼는 주니어 개발자
                            이승엽입니다. <br />
                            Spring Boot와 React를 통해 아이디어를 현실로 만듭니다.
                        </Typography>

                        <Button
                            variant="contained"
                            color="secondary"  // 테마의 포인트 컬러(Teal) 적용
                            size="large"
                            component={RouterLink}
                            to="/projects"
                            sx={{
                                mt: 4,
                                px: 6,           // 가로 여백을 늘려 더 든든한 느낌
                                py: 1.8,
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                borderRadius: '4px', // 살짝 둥근 모서리로 세련미 추가
                                boxShadow: 'none',   // 미니멀한 느낌을 위해 그림자 제거
                                '&:hover': {
                                    backgroundColor: '#0A766D', // 호버 시 조금 더 어두운 틸 그린
                                    boxShadow: '0px 4px 12px rgba(0,0,0,0.2)', // 호버 시에만 입체감
                                }
                            }}
                        >
                            나의 구현물 보기
                        </Button>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default Home;
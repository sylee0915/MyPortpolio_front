import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, CardActions, Button, Box, CircularProgress } from '@mui/material';
import { projectService } from '../services/api';
import type { Project } from '../types';

const ProjectList: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        projectService.getAll()
            .then(res => setProjects(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
        </Box>
    );

    return (
        <Container sx={{ py: 8 }} maxWidth="lg">
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 5 }}>
                Featured Projects
            </Typography>
            <Grid container spacing={4}>
                {projects.map((project) => (
                    <Grid item key={project.projectId} xs={12} sm={6} md={4}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={project.thumbnailUrl || 'https://via.placeholder.com/400x200'}
                                alt={project.title}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                                    {project.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {project.description}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ p: 2 }}>
                                {project.githubUrl && (
                                    <Button size="small" href={project.githubUrl} target="_blank">
                                        GitHub
                                    </Button>
                                )}
                                {project.demoUrl && (
                                    <Button size="small" variant="outlined" href={project.demoUrl} target="_blank">
                                        Demo
                                    </Button>
                                )}
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ProjectList;
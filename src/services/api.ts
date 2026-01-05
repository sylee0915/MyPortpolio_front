import axios, { type AxiosResponse } from 'axios';
import type { Project, ProjectRequest, Skill, SiteConfig } from '../types';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const password = localStorage.getItem('admin_password');
    if (password) {
        config.headers['X-Admin-Password'] = password;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 403 || error.response.status === 401)) {
            alert('인증이 만료되었거나 권한이 없습니다. 다시 로그인해주세요.');
            localStorage.removeItem('admin_password');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    verify: (): Promise<AxiosResponse<string>> => api.get<string>('/admin/verify'),
};

export const projectService = {
    getAll: (): Promise<AxiosResponse<Project[]>> => api.get<Project[]>('/projects'),
    getById: (id: number): Promise<AxiosResponse<Project>> => api.get<Project>(`/projects/${id}`),
    create: (data: ProjectRequest): Promise<AxiosResponse<Project>> =>
        api.post<Project>('/admin/projects', data),
    // 프로젝트 수정 API 추가
    update: (id: number, data: ProjectRequest): Promise<AxiosResponse<Project>> =>
        api.put<Project>(`/admin/projects/${id}`, data),
    // 프로젝트 삭제 API 추가
    delete: (id: number): Promise<AxiosResponse<void>> =>
        api.delete<void>(`/admin/projects/${id}`),
};

export const skillService = {
    getAll: (): Promise<AxiosResponse<Skill[]>> => api.get<Skill[]>('/skills'),
    // 관리자용 기술 스택 직접 추가
    add: (data: { name: string; category: string }): Promise<AxiosResponse<Skill>> =>
        api.post<Skill>('/admin/skills', data),
    // 관리자용 기술 스택 직접 삭제
    delete: (id: number): Promise<AxiosResponse<void>> =>
        api.delete<void>(`/admin/skills/${id}`),
};

export const configService = {
    get: (): Promise<AxiosResponse<SiteConfig>> => api.get<SiteConfig>('/config'),
    update: (data: SiteConfig): Promise<AxiosResponse<string>> => api.put<string>('/admin/config', data),
};

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
export const uploadImageToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    try {
        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData);
        if (response.data.success) {
            return response.data.data.url;
        } else {
            throw new Error('이미지 업로드에 실패했습니다.');
        }
    } catch (error) {
        console.error('ImgBB Upload Error:', error);
        throw error;
    }
};

export default api;
import axios, { type AxiosResponse } from 'axios';
import type { Project, ProjectRequest, Skill, ContactRequest } from '../types';

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

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

export const projectService = {
    getAll: (): Promise<AxiosResponse<Project[]>> => api.get<Project[]>('/projects'),

    // 단일 프로젝트 조회
    getById: (id: number): Promise<AxiosResponse<Project>> =>
        api.get<Project>(`/projects/${id}`),

    // 관리자 전용 프로젝트 등록
    create: (data: ProjectRequest): Promise<AxiosResponse<Project>> =>
        api.post<Project>('/projects/admin', data),
};

export const skillService = {
    // 기술 스택 조회
    getAll: (): Promise<AxiosResponse<Skill[]>> => api.get<Skill[]>('/skills'),
};

export const contactService = {
    // 연락처 메시지 전송
    send: (data: ContactRequest): Promise<AxiosResponse<string>> => api.post<string>('/contacts', data),
};

export const uploadImageToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData);
        if (response.data.success) {
            return response.data.data.url; // 업로드된 이미지의 직접 URL 반환
        } else {
            throw new Error('이미지 업로드에 실패했습니다.');
        }
    } catch (error) {
        console.error('ImgBB Upload Error:', error);
        throw error;
    }
};


export default api;
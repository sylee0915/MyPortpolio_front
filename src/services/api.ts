import axios, { type AxiosResponse } from 'axios';
import type { Project, ProjectRequest, Skill, ContactRequest, SiteConfig } from '../types';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const password = localStorage.getItem('admin_password');
    if (password) {
        config.headers['X-Admin-Password'] = password; // 모든 요청에 관리자 비번 헤더 추가
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // 서버에서 권한 없음(403) 또는 인증 실패(401) 응답이 온 경우
        if (error.response && (error.response.status === 403 || error.response.status === 401)) {
            alert('인증이 만료되었거나 권한이 없습니다. 다시 로그인해주세요.');
            localStorage.removeItem('admin_password'); // 저장된 잘못된 비번 삭제
            window.location.href = '/login'; // 로그인 페이지로 강제 이동
        }
        return Promise.reject(error);
    }
);

// 관리자 인증 관련
export const authService = {
    verify: (): Promise<AxiosResponse<string>> => api.get<string>('/admin/verify'),
};

export const projectService = {
    getAll: (): Promise<AxiosResponse<Project[]>> => api.get<Project[]>('/projects'),
    getById: (id: number): Promise<AxiosResponse<Project>> => api.get<Project>(`/projects/${id}`),
    create: (data: ProjectRequest): Promise<AxiosResponse<Project>> =>
        api.post<Project>('/admin/projects', data),
};

export const skillService = {
    getAll: (): Promise<AxiosResponse<Skill[]>> => api.get<Skill[]>('/skills'),
};

export const contactService = {
    send: (data: ContactRequest): Promise<AxiosResponse<string>> => api.post<string>('/contacts', data),
};

export const configService = {
    get: (): Promise<AxiosResponse<SiteConfig>> => api.get<SiteConfig>('/config'),
    // 관리자 전용 설정 업데이트
    update: (data: SiteConfig): Promise<AxiosResponse<string>> => api.put<string>('/admin/config', data),
};

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

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
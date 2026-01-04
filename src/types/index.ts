// src/types/index.ts

/**
 * 기술 스택 정보 인터페이스
 */
export interface Skill {
    skillId: number;
    name: string;
    category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Other';
    iconUrl?: string;
}

/**
 * 프로젝트 정보 인터페이스
 * 백엔드 DTO(ProjectResponseDto)의 필드명 'id'와 일치하도록 수정되었습니다.
 */
export interface Project {
    projectId?: number;
    title: string;
    description: string;         // 프로젝트 개요
    period: string;              // 제작 기간
    teamSize: string;            // 제작 인원
    content: string;             // 상세 내용
    githubUrl?: string;
    demoUrl?: string;            // 배포 사이트 주소
    thumbnailUrl?: string;
    erdImageUrl?: string;        // ERD 다이어그램
    architectureImageUrl?: string; // 기술 아키텍처
    skills: string[];            // 기술 이름 리스트
}

/**
 * 프로젝트 등록 및 수정 요청을 위한 인터페이스
 */
export interface ProjectRequest {
    title: string;
    description: string;
    period: string;
    teamSize: string;
    content: string;
    githubUrl: string;
    demoUrl: string;
    thumbnailUrl: string;
    erdImageUrl: string;
    architectureImageUrl: string;
    skillIds: number[];          // 백엔드에서 ID 리스트를 받으므로 number[]
}

/**
 * 연락처 전송 데이터 인터페이스
 */
export interface ContactRequest {
    senderName: string;
    email: string;
    subject: string;
    message: string;
}

/**
 * 사이트 환경 설정 인터페이스
 * 메인 페이지 콘텐츠 및 테마 색상 관리를 위해 필드가 확장되었습니다.
 */
export interface SiteConfig {
    id?: number;
    mainTitle: string;           // 메인 타이틀 문구
    subTitle: string;            // 서브 타이틀 문구
    mainImageUrl: string;        // 메인 프로필 사진 URL
    primaryColor: string;        // 메인 배경색 (Hex)
    secondaryColor: string;      // 포인트 색상 (Hex)
    navColor: string;            // 네비게이션 바 색상
}
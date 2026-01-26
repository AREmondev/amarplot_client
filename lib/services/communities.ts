import apiClient from "@/lib/api/axios";

// Types
export interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  coverImage?: string;
  image?: string;
  members: number;
  posts: number;
  location?: string;
  tags?: string[];
  rating?: number;
  growth?: string;
  lastActivity?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  images?: string[];
  tags?: string[];
  likes: number;
  comments: number;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CommunityMember {
  id: string;
  userId: string;
  communityId: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface CreateCommunityRequest {
  name: string;
  description: string;
  category: string;
  coverImage?: File;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  images?: string[];
  tags?: string[];
}

// Community Service
export const communitiesService = {
  // Core Community Management
  async createCommunity(formData: FormData): Promise<Community> {
    const response = await apiClient.post('/community', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getAllCommunities(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort?: string;
  }): Promise<{ communities: Community[]; total: number; page: number; limit: number }> {
    const response = await apiClient.get('/community', { params });
    return response.data;
  },

  async getCommunityById(id: string): Promise<Community> {
    const response = await apiClient.get(`/community/${id}`);
    return response.data;
  },

  async joinCommunity(id: string): Promise<{ message: string }> {
    const response = await apiClient.post(`/community/${id}/join`);
    return response.data;
  },

  async leaveCommunity(id: string): Promise<{ message: string }> {
    const response = await apiClient.post(`/community/${id}/leave`);
    return response.data;
  },

  async getUserCommunities(): Promise<Community[]> {
    const response = await apiClient.get('/community/my-communities');
    return response.data;
  },

  async updateCommunity(id: string, data: Partial<CreateCommunityRequest>): Promise<Community> {
    const response = await apiClient.patch(`/community/${id}`, data);
    return response.data;
  },

  async deleteCommunity(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/community/${id}`);
    return response.data;
  },

  // Community Posts
  async createPost(communityId: string, data: CreatePostRequest): Promise<CommunityPost> {
    const response = await apiClient.post(`/community/${communityId}/posts`, data);
    return response.data;
  },

  async getCommunityPosts(communityId: string, params?: {
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<{ posts: CommunityPost[]; total: number; page: number; limit: number }> {
    const response = await apiClient.get(`/community/${communityId}/posts`, { params });
    return response.data;
  },

  async getPostById(communityId: string, postId: string): Promise<CommunityPost> {
    const response = await apiClient.get(`/community/${communityId}/posts/${postId}`);
    return response.data;
  },

  async updatePost(communityId: string, postId: string, data: Partial<CreatePostRequest>): Promise<CommunityPost> {
    const response = await apiClient.patch(`/community/${communityId}/posts/${postId}`, data);
    return response.data;
  },

  async deletePost(communityId: string, postId: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/community/${communityId}/posts/${postId}`);
    return response.data;
  },

  async togglePostLike(communityId: string, postId: string): Promise<{ liked: boolean; likes: number }> {
    const response = await apiClient.post(`/community/${communityId}/posts/${postId}/like`);
    return response.data;
  },

  // Community Members
  async getCommunityMembers(communityId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<{ members: CommunityMember[]; total: number; page: number; limit: number }> {
    const response = await apiClient.get(`/community/${communityId}/members`, { params });
    return response.data;
  },
};
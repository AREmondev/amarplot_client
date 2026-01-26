import api from './axios';

export interface Community {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private';
  category: string;
  location: string;
  image?: string;
  coverImage?: string;
  members: number;
  postsCount: number;
  isJoined?: boolean;
  userRole?: 'admin' | 'moderator' | 'member';
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  rules?: string[];
  settings?: {
    allowPosts: boolean;
    requireApproval: boolean;
    allowInvites: boolean;
  };
}

export interface CommunityPost {
  id: string;
  communityId: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    verified?: boolean;
  };
  title: string;
  content: string;
  images?: string[];
  tags?: string[];
  category?: string;
  views: number;
  likes: number;
  comments: number;
  reactions: {
    like: number;
    heart: number;
    bookmark: number;
  };
  userReaction?: 'like' | 'heart' | 'bookmark' | null;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityMember {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    verified?: boolean;
  };
  role: 'admin' | 'moderator' | 'member';
  joinedAt: string;
  isActive: boolean;
  permissions?: string[];
}

export interface CreateCommunityRequest {
  name: string;
  description: string;
  type: 'public' | 'private';
  category: string;
  location: string;
  image?: File;
  coverImage?: File;
  tags?: string[];
  rules?: string[];
  settings?: {
    allowPosts: boolean;
    requireApproval: boolean;
    allowInvites: boolean;
  };
}

export interface CreatePostRequest {
  communityId: string;
  title: string;
  content: string;
  images?: File[];
  tags?: string[];
  category?: string;
}

export const communitiesService = {
  // Community CRUD Operations
  getAllCommunities: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    location?: string;
    type?: 'public' | 'private';
    sortBy?: 'name' | 'members' | 'posts' | 'created' | 'activity';
    sortOrder?: 'asc' | 'desc';
  }) => {
    const response = await api.get('/communities', { params });
    return response.data;
  },

  getCommunityById: async (id: string) => {
    const response = await api.get(`/communities/${id}`);
    return response.data;
  },

  createCommunity: async (data: CreateCommunityRequest) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });
    const response = await api.post('/communities', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateCommunity: async (id: string, data: Partial<CreateCommunityRequest>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined) {
        formData.append(key, value);
      }
    });
    const response = await api.put(`/communities/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteCommunity: async (id: string) => {
    const response = await api.delete(`/communities/${id}`);
    return response.data;
  },

  // Member Management
  getCommunityMembers: async (communityId: string, params?: {
    page?: number;
    limit?: number;
    role?: 'admin' | 'moderator' | 'member';
    search?: string;
  }) => {
    const response = await api.get(`/communities/${communityId}/members`, { params });
    return response.data;
  },

  joinCommunity: async (communityId: string) => {
    const response = await api.post(`/communities/${communityId}/join`);
    return response.data;
  },

  leaveCommunity: async (communityId: string) => {
    const response = await api.post(`/communities/${communityId}/leave`);
    return response.data;
  },

  inviteMember: async (communityId: string, data: { email?: string; userId?: string; message?: string }) => {
    const response = await api.post(`/communities/${communityId}/invite`, data);
    return response.data;
  },

  removeMember: async (communityId: string, userId: string) => {
    const response = await api.delete(`/communities/${communityId}/members/${userId}`);
    return response.data;
  },

  updateMemberRole: async (communityId: string, userId: string, role: 'admin' | 'moderator' | 'member') => {
    const response = await api.put(`/communities/${communityId}/members/${userId}/role`, { role });
    return response.data;
  },

  // Post Management
  getCommunityPosts: async (communityId: string, params?: {
    page?: number;
    limit?: number;
    category?: string;
    sortBy?: 'created' | 'updated' | 'likes' | 'comments' | 'views';
    sortOrder?: 'asc' | 'desc';
    pinned?: boolean;
  }) => {
    const response = await api.get(`/communities/${communityId}/posts`, { params });
    return response.data;
  },

  createPost: async (data: CreatePostRequest) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'images' && Array.isArray(value)) {
        value.forEach((file, index) => {
          formData.append(`images[${index}]`, file);
        });
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });
    const response = await api.post('/communities/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updatePost: async (postId: string, data: Partial<CreatePostRequest>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'images' && Array.isArray(value)) {
        value.forEach((file, index) => {
          formData.append(`images[${index}]`, file);
        });
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined) {
        formData.append(key, value);
      }
    });
    const response = await api.put(`/communities/posts/${postId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deletePost: async (postId: string) => {
    const response = await api.delete(`/communities/posts/${postId}`);
    return response.data;
  },

  pinPost: async (postId: string) => {
    const response = await api.post(`/communities/posts/${postId}/pin`);
    return response.data;
  },

  unpinPost: async (postId: string) => {
    const response = await api.post(`/communities/posts/${postId}/unpin`);
    return response.data;
  },

  lockPost: async (postId: string) => {
    const response = await api.post(`/communities/posts/${postId}/lock`);
    return response.data;
  },

  unlockPost: async (postId: string) => {
    const response = await api.post(`/communities/posts/${postId}/unlock`);
    return response.data;
  },

  // Post Interactions
  likePost: async (postId: string) => {
    const response = await api.post(`/communities/posts/${postId}/like`);
    return response.data;
  },

  unlikePost: async (postId: string) => {
    const response = await api.delete(`/communities/posts/${postId}/like`);
    return response.data;
  },

  reactToPost: async (postId: string, reaction: 'like' | 'heart' | 'bookmark') => {
    const response = await api.post(`/communities/posts/${postId}/react`, { reaction });
    return response.data;
  },

  removeReaction: async (postId: string) => {
    const response = await api.delete(`/communities/posts/${postId}/react`);
    return response.data;
  },

  // Comments
  getPostComments: async (postId: string, params?: {
    page?: number;
    limit?: number;
    sortBy?: 'created' | 'likes';
    sortOrder?: 'asc' | 'desc';
  }) => {
    const response = await api.get(`/communities/posts/${postId}/comments`, { params });
    return response.data;
  },

  createComment: async (postId: string, data: { content: string; parentId?: string }) => {
    const response = await api.post(`/communities/posts/${postId}/comments`, data);
    return response.data;
  },

  updateComment: async (commentId: string, data: { content: string }) => {
    const response = await api.put(`/communities/comments/${commentId}`, data);
    return response.data;
  },

  deleteComment: async (commentId: string) => {
    const response = await api.delete(`/communities/comments/${commentId}`);
    return response.data;
  },

  likeComment: async (commentId: string) => {
    const response = await api.post(`/communities/comments/${commentId}/like`);
    return response.data;
  },

  unlikeComment: async (commentId: string) => {
    const response = await api.delete(`/communities/comments/${commentId}/like`);
    return response.data;
  },

  // User's Communities
  getMyJoinedCommunities: async (params?: {
    page?: number;
    limit?: number;
    role?: 'admin' | 'moderator' | 'member';
    active?: boolean;
  }) => {
    const response = await api.get('/user/me/communities', { params });
    return response.data;
  },

  // Search and Discovery
  searchCommunities: async (query: string, params?: {
    page?: number;
    limit?: number;
    category?: string;
    location?: string;
    type?: 'public' | 'private';
  }) => {
    const response = await api.get('/communities/search', { params: { q: query, ...params } });
    return response.data;
  },

  getFeaturedCommunities: async (params?: {
    limit?: number;
    category?: string;
    location?: string;
  }) => {
    const response = await api.get('/communities/featured', { params });
    return response.data;
  },

  getRecommendedCommunities: async (params?: {
    limit?: number;
    based_on?: 'location' | 'interests' | 'activity';
  }) => {
    const response = await api.get('/communities/recommended', { params });
    return response.data;
  },

  // Analytics and Stats
  getCommunityStats: async (communityId: string) => {
    const response = await api.get(`/communities/${communityId}/stats`);
    return response.data;
  },

  getCommunityActivity: async (communityId: string, params?: {
    period?: 'day' | 'week' | 'month' | 'year';
    type?: 'posts' | 'comments' | 'members' | 'all';
  }) => {
    const response = await api.get(`/communities/${communityId}/activity`, { params });
    return response.data;
  },
};

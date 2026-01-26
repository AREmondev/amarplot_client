
export const users = [
  { id: 1, name: 'Admin User', avatar: '/placeholder-user.jpg', verified: true, role: 'Admin' },
  { id: 2, name: 'Moderator Mike', avatar: '/placeholder-user.jpg', verified: true, role: 'Moderator' },
  { id: 3, name: 'Member Mary', avatar: '/placeholder-user.jpg', verified: false, role: 'Member' },
  { id: 4, name: 'Newbie Nick', avatar: '/placeholder-user.jpg', verified: false, role: 'Member' },
];

export const posts = [
  {
    id: 1,
    communityId: "1",
    authorId: 1,
    createdAt: '2024-07-20T10:00:00Z',
    updatedAt: '2024-07-20T10:00:00Z',
    title: 'Welcome to the Dhaka Rent community!',
    content: 'This is the first post in the community. Feel free to introduce yourselves, share listings, or ask for advice. Let\'s keep it friendly and helpful!',
    tags: ['welcome', 'rules', 'introductions'],
    views: 1250,
    comments: [
        {
            id: 1,
            authorId: 2,
            createdAt: '2024-07-20T11:00:00Z',
            content: 'Glad to be here! Looking forward to finding a new place.',
        },
        {
            id: 2,
            authorId: 3,
            createdAt: '2024-07-20T12:00:00Z',
            content: 'Thanks for creating this community!',
        },
    ],
    reactions: { like: 150, heart: 30, bookmark: 12 },
    userReaction: null,
    isPinned: true,
    isLocked: false,
    category: 'Announcements',
  },
  {
    id: 2,
    communityId: "1",
    authorId: 3,
    createdAt: '2024-07-21T14:30:00Z',
    updatedAt: '2024-07-21T14:30:00Z',
    title: 'Looking for a 2-bedroom flat in Gulshan',
    content: 'Hi everyone, my family is looking for a 2-bedroom apartment to rent in the Gulshan area. Our budget is around BDT 40,000 per month. Any leads would be appreciated!',
    tags: ['looking-for', 'gulshan', '2bhk'],
    views: 800,
    comments: [],
    reactions: { like: 45, heart: 5, bookmark: 3 },
    userReaction: 'like',
    isPinned: false,
    isLocked: false,
    category: 'Housing Wanted',
  },
  {
    id: 3,
    communityId: "2",
    authorId: 2,
    createdAt: '2024-07-22T11:00:00Z',
    updatedAt: '2024-07-22T11:00:00Z',
    title: 'For Sale: 3-bedroom condo in Agrabad',
    content: 'A beautiful 3-bedroom condominium is available for sale in Agrabad, Chittagong. Fully furnished with modern amenities. Please DM for price and viewing schedule.',
    tags: ['for-sale', 'agrabad', 'condo'],
    views: 950,
    comments: [],
    reactions: { like: 75, heart: 15, bookmark: 8 },
    userReaction: null,
    isPinned: false,
    isLocked: false,
    category: 'Property for Sale',
  }
];

export const communities = [
  {
    id: "1",
    name: "Dhaka Rent",
    type: "Public",
    description: "A community for renting apartments in Dhaka. Share your listings, find roommates, and get advice from fellow renters.",
    members: 1250,
    postsCount: 2,
    image: "/placeholder.jpg",
    membersList: users.slice(0, 3),
    posts: posts.filter(p => p.communityId === "1").map(post => ({
      ...post,
      author: users.find(u => u.id === post.authorId)
    }))
  },
  {
    id: "2",
    name: "Chittagong Buy & Sell",
    type: "Private",
    description: "A community for buying and selling properties in Chittagong. Post your properties for sale or find your dream home.",
    members: 875,
    postsCount: 1,
    image: "/placeholder.jpg",
    membersList: users.slice(1, 4),
     posts: posts.filter(p => p.communityId === "2").map(post => ({
      ...post,
      author: users.find(u => u.id === post.authorId)
    }))
  },
  {
    id: "3",
    name: "Sylhet Property Investors",
    type: "Public",
    description: "A group for property investors in Sylhet to discuss market trends, share investment opportunities, and network.",
    members: 450,
    postsCount: 0,
    image: "/placeholder.jpg",
    membersList: [users[0], users[3]],
    posts: []
  }
];

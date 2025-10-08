import axios from 'axios';

// Define API instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://dummyjson.com',
});

// ----------- Types -----------

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  birthDate: string;
  image: string;
  address: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  company: {
    name: string;
    department: string;
    title: string;
  };
}

export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

// Add this to your API file
export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface TodosResponse {
  todos: Todo[];
  total: number;
  skip: number;
  limit: number;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
  reactions: number;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

// ----------- API Calls -----------

const loginUser = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>('/auth/login', {
    username,
    password,
  });
  return res.data;
};

const getUserById = async (id: number): Promise<User> => {
  const res = await api.get<User>(`/users/${id}`);
  return res.data;
};
const getUsers = async (): Promise<UsersResponse> => {
  const res = await api.get<UsersResponse>('/users?sortBy=id');
  return res.data;
};

const getTodosByUser = async (userId: number): Promise<TodosResponse> => {
  const res = await api.get<TodosResponse>(`/todos?userId=${userId}`);
  return res.data;
};

const getPostsByUser = async (userId: number): Promise<PostsResponse> => {
  const res = await api.get<PostsResponse>(`/posts?userId=${userId}`);
  return res.data;
};

export { getPostsByUser, getTodosByUser, getUserById, getUsers, loginUser };

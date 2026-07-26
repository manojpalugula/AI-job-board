import axios from 'axios';

const api=axios.create({baseURL:import.meta.env.VITE_API_URL||'/api',headers:{'Content-Type':'application/json'}});
api.interceptors.request.use(config=>{const token=localStorage.getItem('orbit_token');if(token)config.headers.Authorization=`Bearer ${token}`;return config});
export const authApi={register:data=>api.post('/auth/register',data),login:data=>api.post('/auth/login',data)};
export const jobApi={list:params=>api.get('/jobs',{params}),get:id=>api.get(`/jobs/${id}`),mine:()=>api.get('/jobs/mine'),create:data=>api.post('/jobs',data)};
export const applicationApi={apply:jobId=>api.post(`/jobs/${jobId}/applications`),forJob:jobId=>api.get(`/jobs/${jobId}/applications`),updateStatus:(id,status)=>api.patch(`/applications/${id}`,{status})};
export const userApi={me:() => api.get('/users/me'),updateProfile:data=>api.patch('/users/me',data),list:params=>api.get('/users',{params}),selectCandidate:id=>api.post(`/users/${id}/select`)};
export const aiApi={generate:brief=>api.post('/ai/generate',{brief})};
export const apiMessage=error=>error.response?.data?.message||error.response?.data?.issues?.[0]?.message||'Unable to reach the server. Please try again.';
export default api;

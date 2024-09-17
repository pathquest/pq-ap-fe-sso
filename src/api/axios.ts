import { auth } from '@/auth'
import {
  ForgotPasswordOptions,
  GenerateOtpOptions,
  ReauthenticationProps,
  SetPasswordOptions,
  SignInOptions,
  SignUpOptions,
  SocialSignInOptions,
  ValidateOtpOptions,
} from '@/models/auth'
import axios, { AxiosResponse } from 'axios'
import { getSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

const API_SSO = process.env.API_SSO
const API_PROFILE = process.env.API_PROFILE
const API_MANAGE = process.env.API_MANAGE

const responseBody = (response: AxiosResponse) => response.data
let cachedSession = null;
let sessionPromise: any = null;

const fetchSession = async () => {
  if (!sessionPromise) {
    sessionPromise = (async () => {
      try {
        if (typeof getSession === 'function') {
          cachedSession = await getSession();
        } else {
          cachedSession = await auth();
        }
        return cachedSession;
      } finally {
        sessionPromise = null;
      }
    })();
  }
  return sessionPromise;
};

export const invalidateSessionCache = () => {
  cachedSession = null;
};

axios.interceptors.request.use(
  async (config) => {
    const session = await fetchSession();

    if (session && 'user' in session) {
      config.headers.Authorization = `bearer ${session.user.access_token}`;
      config.headers.CompanyId = session.user.CompanyId;
    }
    return config;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/signin';
      return Promise.reject('Unauthorized');
    }
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      cachedSession = null; // Clear cached session on 401 error

      let session: any;

      if (typeof getSession === 'function') {
        session = await getSession();
      } else {
        session = await auth();
      }

      if (!session) {
        return redirect('/signin');
      }

      cachedSession = session; // Cache the new session

      // Retry the request with the new session
      return axios(error.config);
    }

    return Promise.reject(error);
  }
);

const requests = {
  get: (url: string, params?: URLSearchParams) => axios.get(url, { params }).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
  postForm: (url: string, data: FormData) =>
    axios
      .post(url, data, {
        headers: { 'Content-type': 'multipart/form-data' },
      })
      .then(responseBody),
  putForm: (url: string, data: FormData) =>
    axios
      .put(url, data, {
        headers: { 'Content-type': 'multipart/form-data' },
      })
      .then(responseBody),
}

const Auth = {
  login: (data: SignInOptions) => requests.post(`${API_SSO}/auth/token`, data),
  register: (data: SignUpOptions) => requests.post(`${API_SSO}/auth/register`, data),
  socialLogin: (data: SocialSignInOptions) => requests.post(`${API_SSO}/auth/social-login`, data),
  forgotPassword: (data: ForgotPasswordOptions) => requests.post(`${API_SSO}/auth/forgotpassword`, data),
  getQboConnectUrl: () => requests.get(`${API_SSO}/auth/getqboconnecturl`),
  generateOtp: (data: GenerateOtpOptions) => requests.post(`${API_SSO}/auth/generateotp`, data),
  validateOtp: (data: ValidateOtpOptions) => requests.post(`${API_SSO}/auth/validateotp`, data),
  setPassword: (data: SetPasswordOptions) => requests.post(`${API_SSO}/auth/setpassword`, data),
  reauthentication: (data: ReauthenticationProps) => requests.post(`${API_SSO}/auth/reauthentication`, data),
}


const APIs = {
  /* PROFILE */
  getUserProfile: () => requests.get(`${API_PROFILE}/user/getuserprofile`),
  getUserConfig: () => requests.get(`${API_MANAGE}/user/getuserconfig`),
  qboLogin: (url: string) => requests.get(`${API_SSO}/auth${url}`),
  getProducts: () => requests.get(`${API_PROFILE}/product/getproducts`),
  getIndustryTypes: () => requests.get(`${API_PROFILE}/organization/getindustrytypes`),
  getUserProducts: (data: any) => requests.post(`${API_PROFILE}/product/mapuserproducts`, data),
  organizationSave: (data: any) => requests.post(`${API_PROFILE}/organization/save`, data),

  /* AUTH */
  updatePassword: (data: any) => requests.post(`${API_PROFILE}/auth/updatepassword`, data),

  /* SSO */
  getQboConnectUrl: () => requests.get(`${API_SSO}/auth/getqboconnecturl`),
  login: (data: SignInOptions) => requests.post(`${API_SSO}/auth/token`, data),
  generateOtp: (data: GenerateOtpOptions) => requests.post(`${API_SSO}/auth/generateotp`, data),
  register: (data: SignUpOptions) => requests.post(`${API_SSO}/auth/register`, data),
  setPassword: (data: SetPasswordOptions) => requests.post(`${API_SSO}/auth/setpassword`, data),
  forgotPassword: (data: ForgotPasswordOptions) => requests.post(`${API_SSO}/auth/forgotpassword`, data),
  socialLogin: (data: SocialSignInOptions) => requests.post(`${API_SSO}/auth/social-login`, data),

}

const agent = {
  Auth,
  // User,
  APIs,
}

export default agent
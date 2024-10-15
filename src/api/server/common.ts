import agent from '../axios'

export const handleResponse = (response: any) => {
  if (response?.ResponseStatus === 'Success') {
    return response.ResponseData
  }
}

export async function getUserProfile() {
  const response = await agent.APIs.getUserProfile()
  return handleResponse(response)
}

// export const apUrl = process.env.SSO_SUCCESS_REDIRECT_URI
export const apUrl = 'http://localhost:3001'


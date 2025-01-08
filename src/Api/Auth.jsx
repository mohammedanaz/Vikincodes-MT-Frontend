import {noAuthInstance} from "../Axios/Instances"

const AuthApi = {
    login: async (data) => {
        const response = await noAuthInstance.post("accounts/login/", data);
        return response.data; 
    },
    signup: async (data) => {
        const response = await noAuthInstance.post("accounts/register/", data);
        return response.data; 
    },
  };
  
  export default AuthApi;
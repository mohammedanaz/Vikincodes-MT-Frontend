import instance from "../Axios/Instances"

const ProductApi = {
    listProduct: async () => {
        const response = await instance.get("products/list-products/");
        return response.data; 
    },
    addNewProduct: async (data) => {
        const response = await instance.post("products/create/", data,{
            headers:{
                "Content-Type": "multipart/form-data",
            }
        });
        return response.data; 
    },
  };
  
  export default ProductApi;
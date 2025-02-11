import axiosInstance from "./axioinstance";

//function to fetch interview categories
const fetchInterCategories =async(companyId,page,limit) =>{

    try {
        const response=await axiosInstance.get(`/categories/${companyId}/${page}/${limit}`);
        // console.log(response);
        return response;
    } catch (error) {
        console.log(error);
    }
}

const createCategory = async (data)=>{
    try {
        const response=await axiosInstance.post(`/categories`,data)
        return response;
    } catch (error) {
        console.log(error);
    }
}

const deleteCategory = async (categoryId) => {
    try {
        const response = await axiosInstance.delete(`/categories/${categoryId}`)
        return response;
    } catch (error) {
        console.log(error);
        throw error;  
    }
}

const updateCategory = async (categoryId, data) => {
    try {
      const response = await axiosInstance.patch(`/categories/${categoryId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  };

export const getInterviewCategoryCompanyById = async (companyId) => {
    try{
        const response = await axiosInstance.get(`/categories/categories/${companyId}`);
        return response;
    } catch(error){
        console.log('Error fetching category:', error);
        throw error;
    }
}

export const getInterviewCategoryByInterviewId = async (sessionId) => {
    try{
        const response = await axiosInstance.get(`/categories/category-assigned/${sessionId}`);
        return response;
    } catch(error){
        console.log('Error fetching category:', error);
        throw error;
    }
}

export const addNoteForCategory = async (categoryScoreId, data) => {
    try{
        const response = await axiosInstance.patch(`/categories/category-score/${categoryScoreId}`);
        return response;
    } catch(error){
        console.log('Error updating category:', error);
        throw error;
    }
}
  

export {fetchInterCategories,createCategory,deleteCategory,updateCategory};
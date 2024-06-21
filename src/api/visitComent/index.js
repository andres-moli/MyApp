import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleGraphQLErrors } from "../../function/erros.function";
import { URL_API_GRAPHQL } from '../../constants';
import axios from "axios";
export const QueryTask = async (variables) => {
    const token = await AsyncStorage.getItem("userToken"); // Reemplaza con tu endpoint GraphQL
    const query = `
      query VisitComents($where: FindVisitComentWhere) {
        visitComents(where: $where) {
          description
          createdAt
          visit {
            id
          }
          id
        }
      }
    `;
  
    try {
    const response = await axios.post(
        URL_API_GRAPHQL, 
        { 
            query, 
            variables
        },
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    if (response.data.errors) {
        handleGraphQLErrors(response.data.errors)
        return []
    }
      return response.data.data.visitComents;
    } catch (error) {
        handleGraphQLErrors(error)
        return [];
    }
};

export const updateTaskStatus = async (updateInput) => {
    const token = await AsyncStorage.getItem("userToken");
    const mutation = `
      mutation UpdateVisitComent($updateInput: UpdateVisitComentInput!) {
        updateVisitComent(updateInput: $updateInput) {
          id
        }
      }
    `;
  
    try {
    const response = await axios.post(
        URL_API_GRAPHQL, 
        { 
            query: mutation, variables: { updateInput } 
        }
        ,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    if (response.data.errors) {
        handleGraphQLErrors(response.data.errors)
        return null
    }
      return response.data.data.updateVisitComent;
    } catch (error) {
        handleGraphQLErrors(error)
        return null;
    }
  };
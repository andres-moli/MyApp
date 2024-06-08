import axios from 'axios';
import { URL_API_GRAPHQL } from '../../constants';
import AsyncStorage from "@react-native-async-storage/async-storage";

export const QueryClients = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await axios.post(URL_API_GRAPHQL, {
      query: `
        query Clients {
          clients {
            id
            createdAt
            updatedAt
            deletedAt
            name
            numberDocument
            email
            telefono
            celular
          }
        }
      `
    }, 
    {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    );

    return response.data.data.clients;
  } catch (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
};

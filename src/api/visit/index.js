import axios from 'axios';
import Toast from 'react-native-toast-message';
import { URL_API_GRAPHQL } from '../../constants';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { handleGraphQLErrors } from '../../function/erros.function';
const FIND_ALL_VISIT_DASHBOARD_QUERY = `
query findAllVisitDashboard {
  findAllVisitDashboard {
    earrings {
      dateVisit
      id
      status
      description
      client {
        name
      }
    }
    realized {
      client {
        name
      }
      dateVisit
    }
  }
}
`;

export async function QueryVisitDashboardData() {
  try {
    
    const token = await AsyncStorage.getItem("userToken");
    const response = await axios.post(URL_API_GRAPHQL, {
      query: FIND_ALL_VISIT_DASHBOARD_QUERY,
    }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (response.data.errors) {
      Toast.show({
        type: 'error',
        text1: 'GraphQL Error',
        text2: response.data.errors[0].message,
      });
      return null;
    }

    return response.data.data.findAllVisitDashboard;
  } catch (error) {
    if (error.response) {
      Toast.show({
        type: 'error',
        text1: 'Response Error',
        text2: error.message,
      });
    } else if (error.request) {
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Could not connect to the server. Please check your network connection and server URL.',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    }
    return null;
  }
}
export const QueryTypeVisit = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await axios.post(URL_API_GRAPHQL, {
      query: `
      query VisitTypes{
        visitTypes{
          id
          createdAt
          updatedAt
          deletedAt
          name
          description
          status
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

    return response.data.data.visitTypes;
  } catch (error) {
    console.error('Error fetching visitTypes:', error);
    return [];
  }
};
export const CreateVisit = async (createInput) => {
  try {
    const {id} = await JSON.parse(await AsyncStorage.getItem("userData"))
    const token = await AsyncStorage.getItem("userToken");
    const response = await axios.post(URL_API_GRAPHQL, {
      query: `
        mutation CreateVisit($createInput: CreateVisitInput!) {
          createVisit(createInput: $createInput) {
            id
            client {
              name
            }
          }
        }
      `,
      variables: {
        createInput: {
          ...createInput,
          userId: id
        },
      },
      
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
    }
    });
    console.log(response.data.errors)
    if (response.data.errors) {
      handleGraphQLErrors(response.data.errors)
      return null
    }
    return response;
  } catch (err) {
    handleGraphQLErrors(err)
    return null
  }
};

export const UpdateVisit = async (updateInput) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await axios.post(URL_API_GRAPHQL, {
      query: `
        mutation UpdateVisit($updateInput: UpdateVisitInput!) {
          updateVisit(updateInput: $updateInput) {
            id
          }
        }
      `,
      variables: {
        updateInput: updateInput
      },
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`
    }
    });
    if (response.data.errors) {
      handleGraphQLErrors(response.data.errors)
      return null
    }
    return response
  }catch(err) {
    handleGraphQLErrors(err)
    return null
  }
}
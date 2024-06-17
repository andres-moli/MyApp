import axios from 'axios';
import { URL_API_GRAPHQL } from '../../constants';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleGraphQLErrors } from '../../function/erros.function';

export const QueryClients = async () => {
  const token = await AsyncStorage.getItem("userToken");
  try {
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

export const fetchClients = async (pagination) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await axios.post(URL_API_GRAPHQL, {
      query: `
        query Clients($pagination: Pagination) {
          clients(pagination: $pagination) {
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
      `,
      variables: { pagination },
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    );
    if (response.data.errors) {
      handleGraphQLErrors(response.data.errors)
      return null
    }
    return response.data.data.clients;
  }catch(err){
    handleGraphQLErrors(err)
    return null
  }
};

export const createClient = async (createInput) => {
  const token = await AsyncStorage.getItem("userToken");
  const response = await axios.post(URL_API_GRAPHQL, {
    query: `
      mutation CreateClient($createInput: CreateClientInput!) {
        createClient(createInput: $createInput) {
          id
          name
          numberDocument
          celular
          createdAt
          city {
            name
          }
          department {
            name
          }
        }
      }
    `,
    variables: { createInput },
  },  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data.data.createClient;
};

export const fetchDepartments = async () => {
  const token = await AsyncStorage.getItem("userToken");
  const response = await axios.post(URL_API_GRAPHQL, {
    query: `
      query Departments($orderBy: OrderTypes) {
        departments(orderBy: $orderBy) {
          id
          name
        }
      }
    `,
  },  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data.data.departments;
};

export const fetchCities = async (departmentId) => {
  try {
    console.log(departmentId)
    const token = await AsyncStorage.getItem("userToken");
    const response = await axios.post(URL_API_GRAPHQL, {
      query: `
        query Cities($orderBy: OrderTypes, $departmentId: ID) {
          cities(orderBy: $orderBy, departmentId: $departmentId) {
            id
            name
          }
        }
      `,
      variables: { orderBy: 'ASC', departmentId },
    },  {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.data.cities;
  }catch(err){
    return null
  }

};

export const createClientContact = async (contactData) => {
  const token = await AsyncStorage.getItem("userToken");
  const response = await axios.post(URL_API_GRAPHQL, {
    query: `
      mutation CreateClientContact($createInput: CreateClientContactInput!) {
        createClientContact(createInput: $createInput) {
          id
          createdAt
          updatedAt
          deletedAt
          name
          numberDocument
          celular
          email
          position
          telefono
          client {
            id
            name
            numberDocument
          }
        }
      }
    `,
    variables: { createInput: contactData },
  },{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data.data.createClientContact;
};

export const fetchClientDetails = async (clientId) => {
  try{
    const token = await AsyncStorage.getItem("userToken");
    const response = await axios.post(URL_API_GRAPHQL, {
      query: `
  query Contact($clientAndContactId: ID!) {
    clientAndContact(id: $clientAndContactId) {
      contact {
        celular
        createdAt
        deletedAt
        email
        id
        name
        numberDocument
        position
        telefono
        updatedAt
      }
      client {
                id
            name
            numberDocument
            email
            telefono
            celular
            createdAt
            updatedAt
            deletedAt  
      }
    }
  }
      `,
      variables: { clientAndContactId: clientId },
    },{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data.errors) {
      handleGraphQLErrors(response.data.errors)
      return null
    }
    return {
      client: response.data.data.clientAndContact.client,
      contact: response.data.data?.clientAndContact?.contact || [],
    };
  }catch(err){
    console.log(err)
    handleGraphQLErrors(err)
    return null
  }
};
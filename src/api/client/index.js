import axios from 'axios';
import { URL_API_GRAPHQL } from '../../constants';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleGraphQLErrors } from '../../function/erros.function';

export const QueryClients = async () => {
  const token = await AsyncStorage.getItem("userToken");
  const {id} = await JSON.parse(await AsyncStorage.getItem("userData"))
  try {
    const response = await axios.post(URL_API_GRAPHQL, {
      query: `
        query Clients($where: FindClientWhere) {
          clients(where: $where) {
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
      variables: { 
        where: {
          user: {
            _eq: id
          }
        } 
      },
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
    const {id} = await JSON.parse(await AsyncStorage.getItem("userData"))
    const response = await axios.post(URL_API_GRAPHQL, {
      query: `
        query Clients($pagination: Pagination, $where: FindClientWhere) {
          clients(pagination: $pagination, where: $where) {
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
      variables: { 
        pagination,  
        where: {
          user: {
            _eq: id
          }
        } 
      },
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
  try {
    const token = await AsyncStorage.getItem("userToken");
    const {id} = await JSON.parse(await AsyncStorage.getItem("userData"))
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
      variables: { createInput: {...createInput, userId: id}  },
    },  {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data.errors) {
      handleGraphQLErrors(response.data.errors)
      return null
    }
    return true;
  }catch (err){
    handleGraphQLErrors(err)
    return null
  }
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
  try{
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
    if (response.data.errors) {
      handleGraphQLErrors(response.data.errors)
      return null
    }
    return response.data.data.createClientContact;
  }catch(err){
    handleGraphQLErrors(err)
    return null
  }
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
        position
        telefono
        updatedAt
      }
      client {
        id
        createdAt
        updatedAt
        deletedAt
        name
        numberDocument
        email
        telefono
        address
        type
        vertical
        descripcion
        celular
        department {
          id
          createdAt
          updatedAt
          deletedAt
          code
          name
        }
        city {
          id
          createdAt
          updatedAt
          deletedAt
          code
          name
        }
        user {
          name
          id
          email
        }
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
    handleGraphQLErrors(err)
    return null
  }
};

export const UpdateClientMutation = async (updateInput,id) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await axios.post(URL_API_GRAPHQL, {
      query: `
      mutation UpdateClient($updateInput: UpdateClientInput!) {
        updateClient(updateInput: $updateInput) {
          id
        }
      }
      `,
      variables: { updateInput: {id,...updateInput} },
    },  {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data.errors) {
      handleGraphQLErrors(response.data.errors)
      return null
    }
    return true;
  }catch(err){
    handleGraphQLErrors(err)
    return null
  }
}
export const UpdateClienteContactMutation = async (updateInput) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await axios.post(URL_API_GRAPHQL, {
      query: `
      mutation UpdateClientContact($updateInput: UpdateClientContactInput!) {
        updateClientContact(updateInput: $updateInput) {
          id
        }
      }
      `,
      variables: { updateInput },
    },  {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data.errors) {
      handleGraphQLErrors(response.data.errors)
      return null
    }
    return true;
  }catch(err){
    handleGraphQLErrors(err)
    return null
  }
}
export const DeleteClientContact = async (id) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await axios.post(URL_API_GRAPHQL, {
      query: `
      mutation RemoveClientContact($removeClientContactId: ID!) {
        removeClientContact(id: $removeClientContactId) {
          id
        }
      }
      `,
      variables: { removeClientContactId: id },
    },  {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data.errors) {
      handleGraphQLErrors(response.data.errors)
      return null
    }
    return true;
  }catch(err){
    handleGraphQLErrors(err)
    return null
  }
}
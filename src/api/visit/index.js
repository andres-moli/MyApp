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
      type {
        name
      }
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
    console.log(response.data.errors)
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

// Función para realizar la petición
export const QueryVisitOne = async (visitId) => {
  const token = await AsyncStorage.getItem("userToken");
  const GET_VISIT_QUERY = `
  query Visit($visitId: ID!) {
    visit(id: $visitId) {
      id
      createdAt
      updatedAt
      deletedAt
      description
      location
      latitude
      longitude
      dateVisit
      status
      isProyect
      client {
        name
        id
        address
        celular
        email
        type
        numberDocument
      }
      type {
        id
        createdAt
        updatedAt
        deletedAt
        name
        description
        status
      }
    }
  }
`;
  try {
    const response = await axios.post(URL_API_GRAPHQL, {
      query: GET_VISIT_QUERY,
      variables: { visitId },
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

    return response.data.data.visit;
  } catch (error) {
    handleGraphQLErrors(error)
    return null
  }
};

export const QueryLastVisitByClient = async (clientId) => {
  const token = await AsyncStorage.getItem("userToken");

  try {
    const response = await axios.post(URL_API_GRAPHQL, {
      query: `query Visits($pagination: Pagination, $where: FindVisitWhere, $orderBy: [FindVisitOrderBy!]) {
  visits(pagination: $pagination, where: $where, orderBy: $orderBy) {
    id
    description
    dateVisit
  }
}`,
      variables: {
        "pagination": {
          "skip": 0,
          "take": 1
        },
        "where": {
          "client": {
            "_eq": clientId
          }
        },
        "orderBy": [
          {
            "dateVisit": "DESC"
          }
        ]
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
      return []
    }

    return response.data.data.visits;
  } catch (error) {
    handleGraphQLErrors(error)
    return []
  }
}
// Función para obtener las visitas
export const QueryVisitByUser = async (data) => {
  const {id} = await JSON.parse(await AsyncStorage.getItem("userData"))
  const token = await AsyncStorage.getItem("userToken");
  const where = { user: { _eq: id }, dateVisit: {
    _between: data.dateRange
  } };
  // Define la consulta GraphQL
  const GET_VISITS_QUERY = `
  query Visits($pagination: Pagination, $where: FindVisitWhere, $orderBy: [FindVisitOrderBy!]) {
    visits(pagination: $pagination, where: $where, orderBy: $orderBy) {
      id
      createdAt
      updatedAt
      deletedAt
      description
      location
      dateVisit
      status
      isProyect
      client {
        name
        id
      }
      type {
        name
      }
      user {
        name
        id
      }
    }
  }
  `;
  try {
    const response = await axios.post(URL_API_GRAPHQL, {
      query: GET_VISITS_QUERY,
      variables: { pagination: data.pagination, where,  orderBy: [
        {
          dateVisit: "DESC"
        }
      ] },
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

    return response.data.data.visits;
  } catch (error) {
    handleGraphQLErrors(error)
    return null
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
export const CreateVisitComment = async (createInput) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await axios.post(URL_API_GRAPHQL, {
      query: `
        mutation CreateVisitComent($createInput: CreateVisitComentInput!) {
          createVisitComent(createInput: $createInput) {
            description
            id
            type
            visit {
              description
              id
              latitude
            }
            user {
              email
              id
            }
          }
        }
      `,
      variables: {
        createInput: createInput
      },
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data.errors) {
      handleGraphQLErrors(response.data.errors);
      return null;
    }
    return response;
  } catch (err) {
    handleGraphQLErrors(err);
    return null;
  }
}

export const QueryVisitComments = async (visitId) => {
  const token = await AsyncStorage.getItem("userToken");
  try {
    const response = await axios.post(URL_API_GRAPHQL, {
      query: `
        query VisitComents($orderBy: [FindVisitComentOrderBy!], $where: FindVisitComentWhere) {
          visitComents(orderBy: $orderBy, where: $where) {
            user {
              name
            }
            description
            type
            createdAt
            id
            date
          }
        }
      `,
      variables: {
        orderBy: [
          { createdAt: "ASC" }
        ],
        where: {
          visit: {
            _eq: visitId
          }
        }
      }
    },    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data.errors) {
      handleGraphQLErrors(response.data.errors);
      return [];
    }

    return response.data.data.visitComents;
  } catch (error) {
    handleGraphQLErrors(error);
    return [];
  }
};

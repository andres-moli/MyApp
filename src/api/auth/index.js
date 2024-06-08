import axios from 'axios';
import { URL_API_GRAPHQL } from '../../constants';
import { handleGraphQLErrors } from '../../function/erros.function';
const SIGNIN_MUTATION = `
  mutation Signin($signinInput: SigninInput!) {
    signin(signinInput: $signinInput) {
      token
      user {
        name
        identificationNumber
        id
        email
      }
    }
  }
`;

export async function QuerySignIn(email, password) {
  const variables = {
    signinInput: {
      email,
      password
    }
  };
  try {
    const response = await axios.post(URL_API_GRAPHQL, {
      query: SIGNIN_MUTATION,
      variables: variables
    });
    if (response.data.errors) {
        handleGraphQLErrors(response.data.errors)
        return null
    }
    const { token, user } = response.data.data.signin;
    return { token, user };
  } catch (err) {
    handleGraphQLErrors(err)
    return null
  }
}


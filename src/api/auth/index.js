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
        phoneNumber
      }
    }
  }
`;

const VERIFYTOKEN = `
query ValidateUserToken($validateTokenInput: ValidateTokenInput!) {
  validateUserToken(validateTokenInput: $validateTokenInput) {
      name
      identificationNumber
      id
      email
  }
}
`

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
    alert(err.message)
    return null
  }
}

export async function VerifyTokenQuery(token){
  const variables = {
    validateTokenInput: {
      token
    }
  };
  try {
    const response = await axios.post(URL_API_GRAPHQL, {
      query: VERIFYTOKEN,
      variables: variables
    });
    if (response.data.errors) {
      return false
    }
    return response.data.data.validateUserToken
  } catch (err) {
    return false
  }
}


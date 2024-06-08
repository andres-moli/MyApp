import Toast from 'react-native-toast-message';
export function handleGraphQLErrors(errors) {
    if (!errors) return;
    if (Array.isArray(errors)) {
      for (const error of errors) {
        if (error.message.includes('Unauthorized')) {
          Toast.show({
            type: 'error',
            text1: 'Unauthorized',
            text2: 'You are not authorized to perform this action. Redirecting to login.',
          });
          return;
        } else {
          Toast.show({
            type: 'error',
            text1: 'GraphQL Error',
            text2: error.message,
          });
        }
      }
    } else {
      if (errors.message && errors.message.includes('Unauthorized')) {
        Toast.show({
          type: 'error',
          text1: 'Unauthorized',
          text2: 'You are not authorized to perform this action. Redirecting to login.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'GraphQL Error',
          text2: errors.message,
        });
      }
    }
  }
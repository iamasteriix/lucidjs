import * as yup from 'yup';


export const getVerifyTokenSchema = {
  query: yup.object({ token: yup.string().required(), }),
};

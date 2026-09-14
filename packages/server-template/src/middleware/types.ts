import type { Schema } from 'yup';


export type ValidationSchemaOptions = Partial<{
  params: Schema;
  body: Schema;
  query: Schema;
}>;

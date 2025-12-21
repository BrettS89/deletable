import { AnySchema } from 'ajv';

export const createComparisonObject = (primitiveType: string | string[]) => {
  return {
    type: 'object',
    additionalProperties: false,
    properties: {
      $gt: { type: primitiveType, nullable: true },
      $lt: { type: primitiveType, nullable: true },
      $gte: { type: primitiveType, nullable: true },
      $lte: { type: primitiveType, nullable: true },
      $ne: { type: primitiveType, nullable: true },
    },
  };
};

export const createFieldSchema = (primitiveType: string | string[]) => ({
  anyOf: [
    { type: primitiveType },
    createComparisonObject(primitiveType),
  ]
});

export const baseQuerySchema = {
  $limit: { type: 'integer', nullable: true, minimum: 0, default: 10 },
  $skip: { type: 'integer', nullable: true, minimum: 0, default: 0 },
  $sort: {
    type: 'object',
    additionalProperties: { type: 'integer', enum: [1, -1] },
    nullable: true
  }
};

export type BaseQueryObject = {
  $limit?: number;
  $skip?: number;
  $sort?: { [field: string]: 1 | -1 };
  $or?: {
    [field: string]: QueryField;
  }[]
};

export type ComparisonObject = {
  $gt?: string | number | boolean | null;
  $lt?: string | number | boolean | null;
  $gte?: string | number | boolean | null;
  $lte?: string | number | boolean | null;
  $ne?: string | number | boolean | null;
};

export type ComparisonObject2<T> = {
  $gt?: T;
  $lt?: T;
  $gte?: T;
  $lte?: T;
  $ne?: T;
};

export type QueryField = number | boolean | string | null | ComparisonObject
export type QueryField2<T extends string | number | boolean | null> = T | ComparisonObject2<T>

export type Or<T> = {
  $or: {
    [K in keyof T]: { [P in K]: T[P] } & { [P in Exclude<keyof T, K>]?: never }
  }[keyof T][];
}

type Fields = {
  [field: string]: {
    type: string | string[];
  }
}

export const createQuerySchema = (fields: Fields): AnySchema => {
  const resolvedSchema: Record<string, any> = {};

  for (let field in fields) {
    resolvedSchema[field] = createFieldSchema(fields[field].type);
  }

  return {
    type: 'object',
    additionalProperties: false,
    properties: {
      ...resolvedSchema,
      $or: {
        type: 'array',
        items: {
          type: 'object',
          maxProperties: 1,
          properties: {
            ...resolvedSchema,
          },
        }
      },
      $limit: { type: 'integer', nullable: true, minimum: 0, default: 10 },
      $skip: { type: 'integer', nullable: true, minimum: 0, default: 0 },
      $sort: {
        type: 'object',
        additionalProperties: { type: 'integer', enum: [1, -1] },
        nullable: true
      }
    },
  };
};

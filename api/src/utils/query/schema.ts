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
    [field: string]: number | boolean | string | null | ComparisonObject
  }[]
};

export type ComparisonObject = {
  $gt?: string | number | boolean | null;
  $lt?: string | number | boolean | null;
  $gte?: string | number | boolean | null;
  $lte?: string | number | boolean | null;
  $ne?: string | number | boolean | null;
};

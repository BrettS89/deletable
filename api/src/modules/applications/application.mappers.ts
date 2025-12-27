import { Application } from './types/application.domain';
import { ApplicationResponseDto } from './types/application.dto';

export const toApplicationDto = (application: Application): ApplicationResponseDto => {
  return {
    ...application,
    created_at: application.created_at.toISOString(),
    updated_at: application.updated_at.toISOString(),
  };
};

export const toApplicationApiKeyDto = () => {

};

import { RoleModel } from './types/role.domain';
import { RoleResponseDto } from './types/role.dto';

export const toRoleResponseDto = (role: RoleModel): RoleResponseDto => {
  return {
    ...role,
    created_at: role.created_at.toISOString(),
    updated_at: role.updated_at.toISOString(),
  };
};

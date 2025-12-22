export type RoleResponseDto = {
  id: bigint;
  name: string;
  created_at: string;
  updated_at: string;
};

export type CreateRoleDto = {
  name: string;
};

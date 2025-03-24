export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BaseEntityWithUser extends BaseEntity {
  modifiedById: string;
}

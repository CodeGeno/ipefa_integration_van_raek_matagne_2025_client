export interface BaseEntity {
	createdAt: Date;
	updatedAt: Date;
}

export interface BaseEntityWithUser extends BaseEntity {
	modifiedById: string;
}

import { prisma } from "../../lib/prisma";

export const createAuditLog = async (data: {
	userId?: string;
	action: string;
	entity?: string;
	entityId?: string;
	description?: string;
}) => {
	return prisma.auditLog.create({
		data: {
			action: data.action,
			description: data.description,
			entity: data.entity,
			entityId: data.entityId,
			userId: data.userId as string,
		},
	});
};

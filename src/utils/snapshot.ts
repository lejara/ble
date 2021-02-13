import { nanoid } from 'nanoid';

import { SnapshotOutBaseLevel, SnapshotInBaseLevel } from 'src/models/Level';
import { SnapshotOutEntity } from 'src/models/Entity';
import { SerializedLevel, SerializedEntity } from 'src/types/snapshot';
import { BlockType } from 'src/types/entity';

export function entityPostProcessor({ id, ...stuff }: SnapshotOutEntity): SerializedEntity {
	// removing the ids can't be done in the Entity or the Vertex because it breacks the undo
	// function that need ids to be consistent
	if ('params' in stuff && 'vertices' in stuff.params) {
		return {
			...stuff,
			params: {
				...stuff.params,
				// @ts-ignore
				vertices: stuff.params.vertices.map(({ id: id_, ...stuff_ }) => ({
					...stuff_,
				})),
			},
		};
	}

	// @ts-ignore
	return {
		...stuff,
	};
}

export function levelPreProcessor(snapshot: SerializedLevel): SnapshotInBaseLevel {
	const entities = snapshot.entities.map((entity) => ({
		...entity,
		type: entity.type as BlockType,
		id: nanoid(),
	}));

	return {
		...snapshot,
		timings: snapshot.timings || [0, 0],
		entities,
	};
}

export function levelPostProcessor({ ...sn }: SnapshotOutBaseLevel): SerializedLevel {
	// removing the ids can't be done in the Entity or the Vertex because it breacks the undo
	// function that need ids to be consistent
	const level = {
		...sn,
		formatVersion: 0,
		entities: Object.values(sn.entities).map(entityPostProcessor),
	};
	// @ts-ignore
	return level;
}

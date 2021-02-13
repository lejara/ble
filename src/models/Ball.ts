import { types, Instance, getParent, SnapshotOut } from 'mobx-state-tree';
import { nanoid } from 'nanoid';

import { ILevel } from 'src/models/Level';
import { BlockType } from 'src/types/entity';
import { blockAliases } from 'src/aliases';
import StaticParams from 'src/models/StaticParams';
import PositionParams from 'src/models/PositionParams';
import RadiusParams from 'src/models/RadiusParams';

const BallParams = types.compose(
	StaticParams,
	PositionParams,
	RadiusParams,
);

const Ball = types.model({
	id: types.optional(types.identifier, nanoid),
	type: types.enumeration(Object.values(BlockType)),
	params: BallParams,
}).actions((self) => ({
	remove(): void {
		const parent = (getParent(self, 2) as ILevel);
		parent.removeEntity(self as IBall);
	},
})).views((self) => ({
	get displayName(): string {
		return `${blockAliases[self.type]} circle`;
	},
}));
export default Ball;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IBall extends Instance<typeof Ball> {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type SnapshotOutBall = SnapshotOut<typeof Ball>;

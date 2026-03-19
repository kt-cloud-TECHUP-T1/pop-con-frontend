import { authHandlers } from './auth';
import { queueHandlers } from './queue';

export const handlers = [...authHandlers, ...queueHandlers];

import { http } from '@google-cloud/functions-framework';
import { createApp } from './app';

const app = createApp();

// Register the Express app as the `api` HTTP function so that
// `functions-framework --target=api` serves it.
http('api', app);

export { app };

import express from 'express';

import routes from './routes';
import { globalErrors } from './middlewares/globalErrors';

const app = express();
const PORT = 3333;

app.use(routes);

app.use(globalErrors);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

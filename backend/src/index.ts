import express from 'express';
import routes from './routes';

const app = express();
const PORT = 3333;

app.use(routes);

app.get('/', (req, res) => res.send('Express + TypeScript Server'));

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

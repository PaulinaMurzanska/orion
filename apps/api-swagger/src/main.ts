import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import * as path from 'path';

const swaggerDocument = YAML.load(path.join(__dirname, './assets/swagger.yml'))

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3010;
const app = express();

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

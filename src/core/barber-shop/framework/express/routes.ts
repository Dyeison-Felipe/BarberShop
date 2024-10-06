import express from 'express';
import { BarberShopFirebaseRepository } from '../../repositories/firebase/barber-shop-firebase.repository.js';
import { db } from '../../../../shared/repositories/firebase/config.js';
import { BarberShopController } from '../../controller/barber-shop.controller.js';
import { BarberShopServiceImpl } from '../../service/implementations/barber-shop.service.js';
import { PaginationInput } from '../../../../shared/repositories/pagination.repository.js';
import { applyRoutes } from '../../../../shared/decorators/http/request-mapping.decorator.js';
import { ClientController } from '../../../client/controller/client.controller.js';
import { ClientServiceImpl } from '../../../client/service/implementation/client.service.js';
import { ClientFirebaseRepository } from '../../../client/repositories/firebase/client-firebase.repository.js';

const app = express();
app.use(express.json());

const port = 3333;

const barberShopRepository = new BarberShopFirebaseRepository(db);

const barberShopService = new BarberShopServiceImpl(barberShopRepository);

const barberShopController = new BarberShopController(barberShopService);

// -------------------------------------------------------------------------------

const clientRepository = new ClientFirebaseRepository(db)

const clientService = new ClientServiceImpl(clientRepository)

const clientController = new ClientController(clientService)

applyRoutes(app, barberShopController);

applyRoutes(app, clientController)

// app.get('/api/barber-shop/v1', async (req, res) => {
//   const pagination: PaginationInput = {
//     limit: +(req.query.limit ?? 24),
//     page: +(req.query.page ?? 1),
//   };
//   const result = await barberShopController.getBarberShop(pagination);
//   console.log('🚀 ~ app.get ~ result:', result);
//   res.status(200).json(result);
// });

app.listen(port, () => {
  console.log(`Server iss running http://localhost:${port}`);
});

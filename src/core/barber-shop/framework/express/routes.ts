import express from 'express'
import { BarberShopController } from '../../controller/barber-shop.controller';
import { BarberShopServiceImpl } from '../../service/implementations/barber-shop.service';
import { BarberShopFirebaseRepository } from '../../repositories/firebase/barber-shop-firebase.repository';
import { db } from '../../../../shared/repositories/firebase/config';

const app = express()

const port = 3333;



const barberShopRepository = new BarberShopFirebaseRepository(db)

const barberShopService = new BarberShopServiceImpl(barberShopRepository)

const barberShopController = new BarberShopController(barberShopService);

app.get('/api/barber-shop/v1', barberShopController.getBarberShop)

app.listen(port, () => {
  console.log(`Server iss running http://localhost:${port}`)
});

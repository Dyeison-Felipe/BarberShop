import { snapshot } from "node:test";
import { PaginationInput, PaginationOutput } from "../../../../shared/repositories/pagination.repository";
import { BarberShop } from "../../entities/barber-shop.entity";
import { BarberShopList, BarberShopRepository } from "../barber-shop.repository";

export class BarberShopFirebaseRepository implements BarberShopRepository{
  constructor(private readonly firebaseRepository: FirebaseFirestore.Firestore )  {}
  async getBarbersShop(pagination: PaginationInput): Promise<PaginationOutput<BarberShopList>> {
    const snapshot = await this.firebaseRepository.collection("Barber-Shop").get();

    let barberShopList = []
    snapshot.forEach((element) => {
      console.log(element.data())
    });

    return {
      data: [],
      meta: {
        itemCount: 3,
        totalItems: 4,
        itemsPerPage: 5,
        totalPages: 6,
        currentPage: 7
      }
    }

  }
  createBarberShop(barberShop: BarberShop): Promise<BarberShop | null> {
    throw new Error("Method not implemented.");
  }
}
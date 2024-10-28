export type FavoriteListProps = {
  id: string;
  barberShopId: string;
  clientId: string;
};

export type CreateFavorite = {
  barberShopId: string;
  clientId: string;
};

export class FavoriteList {
  private constructor(private props: FavoriteListProps) {}

  get id() {
    return this.props.id;
  }

  get barberShopId() {
    return this.props.barberShopId;
  }

  get clientId() {
    return this.props.clientId;
  }

  static createClientFavorite(createFavorite: CreateFavorite): FavoriteList {
    return new FavoriteList({
      id: crypto.randomUUID().toString(),
      barberShopId: createFavorite.barberShopId,
      clientId: createFavorite.clientId,
    });
  }

  toObject() {
    return {
      id: this.id,
      barberShopId: this.barberShopId,
      clientId: this.clientId,
    };
  }
}

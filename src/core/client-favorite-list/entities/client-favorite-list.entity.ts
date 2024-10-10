export type FavoriteListProps = {
  barberShopId: string;
  clientId: string;
};

export class FavoriteList {
  private constructor(private readonly props: FavoriteListProps) {}

  get barberShopId() {
    return this.props.barberShopId;
  }

  get clientId() {
    return this.props.clientId;
  }
}

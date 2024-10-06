export type FavoriteListProps = {
  barberShopId: string;
}

export class FavoriteList {
  private constructor(private readonly props: FavoriteListProps) {}

  get barberShopId() {
    return this.props.barberShopId;
  }
}
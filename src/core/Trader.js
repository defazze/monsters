export default class {
  constructor(playerInventory, traderInventory) {
    this.playerInventory = playerInventory;
    this.traderInventory = traderInventory;
  }

  buy(itemInfo) {
    this.trade(
      this.playerInventory,
      this.traderInventory,
      itemInfo,
      itemInfo.cost
    );
  }

  sell(itemInfo) {
    this.trade(
      this.traderInventory,
      this.playerInventory,
      itemInfo,
      itemInfo.cost / 2
    );
  }

  trade(buyer, seller, itemInfo, price) {
    const existingItem = seller.Items.find(i => i == itemInfo);
    if (existingItem) {
      if (buyer.gold.count >= price) {
        seller.remove(itemInfo);
        buyer.add(itemInfo);
        seller.addGold(price);
        buyer.removeGold(price);
      }
    }
  }
}

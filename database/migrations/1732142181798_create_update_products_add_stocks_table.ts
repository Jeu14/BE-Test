import { BaseSchema } from '@adonisjs/lucid/schema'

export default class UpdateProductsAddStock extends BaseSchema {
  protected tableName = 'products';

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('stock').notNullable().defaultTo(0);
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('stock');
    });
  }
}
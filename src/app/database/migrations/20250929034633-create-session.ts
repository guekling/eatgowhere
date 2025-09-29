import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('sessions', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal('gen_random_uuid()'),
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
      values: ['active', 'ended'],
      defaultValue: 'active'
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    ended_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('now()'),
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('now()'),
    },
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('sessions');
}
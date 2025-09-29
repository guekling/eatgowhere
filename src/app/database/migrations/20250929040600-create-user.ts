import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('users', {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal('gen_random_uuid()'),
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    session_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    role: {
      type: DataTypes.TEXT,
      allowNull: false,
      values: ['initiator', 'participant'],
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
  await queryInterface.dropTable('users');
};
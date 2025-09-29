import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.addConstraint('users', {
    type: 'foreign key',
    fields: ['session_id'],
    references: {
      table: 'sessions',
      field: 'id',
    },
    name: 'users_session_id_fkey',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });

  await queryInterface.addConstraint('sessions', {
    fields: ['created_by'],
    type: 'foreign key',
    references: {
      table: 'users',
      field: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    name: 'sessions_created_by_fkey',
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeConstraint('users', 'users_session_id_fkey');
  await queryInterface.removeConstraint('sessions', 'sessions_created_by_fkey');
}
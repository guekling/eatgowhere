import { QueryInterface, DataTypes, Sequelize } from "sequelize";

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable("restaurants", {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    submitted_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    session_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    chosen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("now()"),
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("now()"),
    },
  });

  await queryInterface.addConstraint("restaurants", {
    fields: ["submitted_by"],
    type: "foreign key",
    references: {
      table: "users",
      field: "id",
    },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    name: "restaurants_submitted_by_fkey",
  });

  await queryInterface.addConstraint("restaurants", {
    fields: ["session_id"],
    type: "foreign key",
    references: {
      table: "sessions",
      field: "id",
    },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    name: "restaurants_session_id_fkey",
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable("restaurants");
}

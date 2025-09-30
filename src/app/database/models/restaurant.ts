import { Model, DataTypes, Sequelize, Optional } from "sequelize";

export interface RestaurantAttributes {
  id: string;
  name: string;
  submitted_by: string;
  session_id: string;
  chosen: boolean;
  created_at: Date;
  updated_at: Date;
}

export type RestaurantCreationAttributes = Optional<
  RestaurantAttributes,
  "id" | "chosen" | "created_at" | "updated_at"
>;

export class Restaurant extends Model<
  RestaurantAttributes,
  RestaurantCreationAttributes
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static associate(models: any) {
    // A restaurant belongs to a session
    Restaurant.belongsTo(models.Session, {
      foreignKey: "session_id",
      as: "session",
    });

    // A restaurant can be created by a user
    Restaurant.hasOne(models.Session, {
      foreignKey: "created_by",
      as: "createdSession",
    });
  }
}

export default function (sequelize: Sequelize) {
  Restaurant.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      submitted_by: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      session_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "sessions",
          key: "id",
        },
      },
      chosen: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("now()"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Restaurant",
      tableName: "restaurants",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Restaurant;
}

import { UserRoles } from "@/app/lib/types";
import { Model, DataTypes, Sequelize, Optional } from "sequelize";

export interface UserAttributes {
  id: string;
  username: string;
  session_id: string;
  role: UserRoles;
  created_at: Date;
  updated_at: Date;
}

export type UserCreationAttributes = Optional<
  UserAttributes,
  "id" | "created_at" | "updated_at"
>;

export class User extends Model<UserAttributes, UserCreationAttributes> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static associate(models: any) {
    // A user belongs to a session
    User.belongsTo(models.Session, {
      foreignKey: "session_id",
      as: "session",
    });

    // A user can create a session
    User.hasOne(models.Session, {
      foreignKey: "created_by",
      as: "createdSession",
    });
  }
}

export default function (sequelize: Sequelize) {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      session_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "sessions",
          key: "id",
        },
      },
      role: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          isIn: [["initiator", "participant"]],
        },
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
      modelName: "User",
      tableName: "users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return User;
}

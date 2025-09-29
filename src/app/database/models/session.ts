import { SessionStatus } from '@/app/lib/types';
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

export interface SessionAttributes {
  id: string;
  status: SessionStatus;
  created_by?: string;
  ended_at?: Date;
  created_at: Date;
  updated_at: Date
}

export type SessionCreationAttributes = Optional<
  SessionAttributes, 'id' | 'ended_at' | 'created_by' | 'updated_at'
>;

export class Session extends Model<SessionAttributes, SessionCreationAttributes> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static associate(models: any) {
    // A session has many users
    Session.hasMany(models.User, {
      foreignKey: 'session_id',
    });

    // A session is created by a user
    Session.belongsTo(models.User, {
      foreignKey: 'created_by',
    });
  }
}

export default function (sequelize: Sequelize) {
  Session.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
      },
      status: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          isIn: [['active', 'ended']],
        },
        defaultValue: 'active'
      },
      created_by: {
        type: DataTypes.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      ended_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('now()'),
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('now()'),
      },
    },
    {
      sequelize,
      modelName: 'Session',
      tableName: 'sessions',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Session;
}

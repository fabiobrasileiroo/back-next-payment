import { PrismaClient, Prisma } from '@prisma/client'
import { Product } from '../@types/productTypes'

const prisma = new PrismaClient()


interface Settings {
  userSettings: {
    profileImageUrl: string | null;
    role: string;
    passwordReset: {
      enabled: boolean;
      expiresAt: Date | null;
    };
  };
  companySettings: {
    name: string;
    document: string;
    units: Array<{
      unitName: string;
      pixKey: string | null;
    }>;
  } | null;
  paymentSettings: {
    defaultPaymentMethod: string;
    statuses: string[];
  };
  proposalSettings: {
    currentProposal: {
      status: string;
      proposalValue: number;
    };
  } | null;
  appDefaults: {
    orderStatuses: string[];
    paymentStatuses: string[];
  };
}

export const getUserSettings = async (userId: number): Promise<Settings> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      company: {
        include: {
          units: true,
        },
      },
      proposal: true,
    },
  });

  if (!user) throw new Error('User not found');

  const settings: Settings = {
    userSettings: {
      profileImageUrl: user.imageUrl,
      role: user.role,
      passwordReset: {
        enabled: !!user.passwordResetToken,
        expiresAt: user.passwordResetExpires,
      },
    },
    companySettings: user.company
      ? {
          name: user.company.name,
          document: user.company.document,
          units: user.company.units.map(unit => ({
            unitName: unit.name,
            pixKey: unit.pixKey,
          })),
        }
      : null,
    paymentSettings: {
      defaultPaymentMethod: 'Credit Card',
      statuses: ['PROCESSING', 'PAID', 'FAILED'],
    },
    proposalSettings: user.proposal
      ? {
          currentProposal: {
            status: user.proposal.status,
            proposalValue: user.proposal.proposalValue,
          },
        }
      : null,
    appDefaults: {
      orderStatuses: ['PENDING', 'PAID', 'FAILED'],
      paymentStatuses: ['PROCESSING', 'PAID', 'FAILED'],
    },
  };

  return settings;
};

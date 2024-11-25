import { Request, Response } from 'express';
import { getUserSettings } from '../services/settingsService';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient()

export const getSettings = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user.id; // Assuming `req.user` is populated by authentication middleware
    const settings = await getUserSettings(userId);
    res.status(200).json(settings);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};


export const updateProfileImage = async (req: any, res: Response): Promise<void> => {
  const { profileImageUrl } = req.body;
  const userId = req.user.id;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { imageUrl: profileImageUrl },
    });

    res.status(200).json({ message: 'Profile image updated successfully', user: updatedUser });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
// ja tenho essa logica
// export const initiatePasswordReset = async (req: any, res: Response): Promise<void> => {
//   const userId = req.user.id;

//   try {
//     const token = crypto.randomBytes(32).toString('hex');
//     const expires = new Date(Date.now() + 3600000); // Token valid for 1 hour.

//     await prisma.user.update({
//       where: { id: userId },
//       data: {
//         passwordResetToken: token,
//         passwordResetExpires: expires,
//       },
//     });

//     res.status(200).json({ message: 'Password reset initiated', token });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };



export const addUnit = async (req: any, res: Response): Promise<void> => {
  const { name, pixKey } = req.body;
  const companyId = req.user.companyId;

  try {
    const newUnit = await prisma.unit.create({
      data: { name, pixKey, companyId },
    });

    res.status(201).json({ message: 'Unit added successfully', unit: newUnit });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateUnit = async (req: Request, res: Response): Promise<void> => {
  const { unitId } = req.params;
  const { name, pixKey } = req.body;

  try {
    const updatedUnit = await prisma.unit.update({
      where: { id: parseInt(unitId) },
      data: { name, pixKey },
    });

    res.status(200).json({ message: 'Unit updated successfully', unit: updatedUnit });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteUnit = async (req: Request, res: Response): Promise<void> => {
  const { unitId } = req.params;

  try {
    await prisma.unit.delete({ where: { id: parseInt(unitId) } });
    res.status(200).json({ message: 'Unit deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

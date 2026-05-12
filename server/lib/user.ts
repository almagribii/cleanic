import { getPrisma } from "./prisma";

/**
 * Utility functions untuk auth
 */

/**
 * Cari user berdasarkan ID
 */
export async function getUserById(userId: string) {
  return getPrisma().user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      points: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

/**
 * Cari user berdasarkan email
 */
export async function getUserByEmail(email: string) {
  return getPrisma().user.findUnique({
    where: { email },
  });
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  data: {
    name?: string;
    image?: string;
  },
) {
  return getPrisma().user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      points: true,
    },
  });
}

/**
 * Update user password
 */
export async function updateUserPassword(
  userId: string,
  hashedPassword: string,
) {
  return getPrisma().user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
}

/**
 * Tambah points ke user
 */
export async function addUserPoints(userId: string, points: number) {
  return getPrisma().user.update({
    where: { id: userId },
    data: {
      points: {
        increment: points,
      },
    },
  });
}

/**
 * Delete user dan semua relasi
 */
export async function deleteUser(userId: string) {
  return getPrisma().user.delete({
    where: { id: userId },
  });
}

/**
 * Get user dengan semua relasi
 */
export async function getUserWithRelations(userId: string) {
  return getPrisma().user.findUnique({
    where: { id: userId },
    include: {
      scans: true,
      reports: true,
      votes: true,
      conversations: true,
      sessions: true,
      accounts: true,
    },
  });
}

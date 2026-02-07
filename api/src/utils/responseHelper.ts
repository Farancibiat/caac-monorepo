import { Response } from 'express';
import { MESSAGES } from '@/constants/messages';

type AllMessageCategories = {
  [K in keyof typeof MESSAGES]: keyof typeof MESSAGES[K]
}[keyof typeof MESSAGES];

export const sendMessage = <T extends AllMessageCategories>(
  res: Response,
  category: T,
  data?: any
): Response => {
  const statusCode = findStatusCodeForCategory(category);
  const message = MESSAGES[statusCode][category as keyof typeof MESSAGES[typeof statusCode]];
  const isError = statusCode >= 400;
  
  return res.status(statusCode).json({
    [isError ? 'error' : 'message']: message, 
    ...(data && { data }),
  });
};

function findStatusCodeForCategory(category: AllMessageCategories): keyof typeof MESSAGES {
  for (const [statusCode, categories] of Object.entries(MESSAGES)) {
    if (category in categories) {
      return parseInt(statusCode) as keyof typeof MESSAGES;
    }
  }
  throw new Error(`Category "${category}" not found in any status code`);
}
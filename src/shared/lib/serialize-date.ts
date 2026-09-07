export const serializeDate = (date: Date): string => date.toISOString();

export const deserializeDate = (serialized: string): Date => {
  const date = new Date(serialized);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`"${serialized}" is not a valid ISO date string.`);
  }

  return date;
};

export const readEnv = (key: string): string => {
  const normalizedKey = key.startsWith("FIREBASE_") ? key : `FIREBASE_${key}`;

  return (
    process.env[`NEXT_PUBLIC_${normalizedKey}`] ||
    process.env[`REACT_APP_${normalizedKey}`] ||
    process.env[`NEXT_PUBLIC_${key}`] ||
    process.env[`REACT_APP_${key}`] ||
    ""
  );
};

export default readEnv;

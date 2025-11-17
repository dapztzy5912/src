export function generateDeviceId(): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  
  const generatePart = (length: number): string => {
    return Array.from({ length }, () => 
      characters[Math.floor(Math.random() * characters.length)]
    ).join('');
  };

  const part1 = generatePart(8);
  const part2 = generatePart(4);
  const part3 = generatePart(4);
  const part4 = generatePart(4);
  const part5 = generatePart(12);

  return `${part1}-${part2}-${part3}-${part4}-${part5}`;
}

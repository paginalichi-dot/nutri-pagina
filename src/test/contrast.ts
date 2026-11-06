const WEIGHTS = [0.2126, 0.7152, 0.0722];

function linear(channel: number): number {
  const srgb = channel / 255;
  return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  return WEIGHTS.reduce((sum, weight, index) => sum + weight * linear(parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16)), 0);
}

export function contrastRatio(first: string, second: string): number {
  const [a, b] = [luminance(first), luminance(second)];
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

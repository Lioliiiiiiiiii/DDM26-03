import { TechnologyImpactDistributionItem } from '@/types/matrix';

export function aggregateDistribution(
  distributions: TechnologyImpactDistributionItem[][],
  preferredOrder?: string[]
): TechnologyImpactDistributionItem[] {
  const countsByLabel = new Map<string, number>();
  const labelOrder: string[] = [];

  distributions.forEach((distribution) => {
    distribution.forEach((item) => {
      if (!countsByLabel.has(item.label)) {
        labelOrder.push(item.label);
      }
      countsByLabel.set(item.label, (countsByLabel.get(item.label) ?? 0) + item.count);
    });
  });

  const orderedLabels = preferredOrder?.length ? preferredOrder : labelOrder;
  const total = Array.from(countsByLabel.values()).reduce((sum, count) => sum + count, 0);

  return orderedLabels.map((label) => {
    const count = countsByLabel.get(label) ?? 0;

    return {
      label,
      count,
      percentage: total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0
    };
  });
}

import prisma from "../prisma.client.js";


export const enforceVisibilityLimitForSeller = async (userId: string, maxGlobal: number, maxPerCat: number) => {
  // Global check
  const visibleProducts = await prisma.product.findMany({
    where: { userId, isVisible: true },
    orderBy: { visibleMarkedAt: "desc" },
  });

  if (visibleProducts.length > maxGlobal) {
    const toUnmark = visibleProducts.slice(maxGlobal);
    await prisma.product.updateMany({
      where: { id: { in: toUnmark.map((p: any) => p.id) } },
      data: { isVisible: false, visibleMarkedAt: null },
    });
  }

  // Per-category check
  const grouped = await prisma.product.groupBy({
    by: ["categoryId"],
    where: { userId, isVisible: true },
    _count: { _all: true },
  });

  for (const g of grouped) {
    if (g._count._all > maxPerCat) {
      const extra = await prisma.product.findMany({
        where: { userId, isVisible: true, categoryId: g.categoryId },
        orderBy: { visibleMarkedAt: "desc" },
        skip: maxPerCat,
      });
      await prisma.product.updateMany({
        where: { id: { in: extra.map((p: any) => p.id) } },
        data: { isVisible: false, visibleMarkedAt: null },
      });
    }
  }
}
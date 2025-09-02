import cron from "node-cron";
import prisma from "../prisma.client.js";
import { enforceVisibilityLimitForSeller } from '../helper/enforce.listing.visibility.js';

cron.schedule("0 * * * *", async () => {
  try {
    const now = new Date();
    const expiredUsers = await prisma.user.findMany({
      where: { subscriptionExpiresAt: { lt: now } },
      include: { subscriptionPlan: true },
    });

    if (!expiredUsers.length) return;

    const freePlan = await prisma.subscriptionPlan.findFirst({ where: { name: "Free" }, include: {maxVisiblePerCat: true} });
    if (!freePlan) return console.warn("Free plan missing");
    if (!freePlan.maxVisiblePerCat) {
      console.log('No free plan setup')
      return;
    }
    for (const user of expiredUsers) {
      await prisma.user.update({
        where: { id: user.id },
        data: { subscriptionPlanId: freePlan.id, subscriptionExpiresAt: null },
      });

      await enforceVisibilityLimitForSeller(user.id, freePlan.maxVisibleProducts, freePlan.maxVisiblePerCat.maxVisible);
    }
  } catch (err: any) {
    console.error("expiry job error:", err);
  }
});
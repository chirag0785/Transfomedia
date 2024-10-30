// seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create sample subscriptions
    await prisma.subscription.createMany({
        data: [
            {
                planName: "free",
                price: 0,
                features: [
                    'grayscale',
                    'replace background',
                    'smart crop',
                    'generative restore',
                    'social-share',
                    'video uploads',
                  ],
                creditsIssued:10,
                price_id:'price_1QCFkBHsoAoo18IYSXu1GCV8'
            },
            {
                planName: "standard",
                price: 40,
                features: [
                    'grayscale',
                    'replace background',
                    'smart crop',
                    'generative restore',
                    'social-share',
                    'video uploads',
                  ],
                creditsIssued:30
            },
            {
                planName: "pro",
                price: 120,
                features: [
                    'grayscale',
                    'replace background',
                    'smart crop',
                    'generative restore',
                    'social-share',
                    'video uploads',
                  ],
                creditsIssued:80
            }
        ]
    });

    console.log('Seeding completed!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

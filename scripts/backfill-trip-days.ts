import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const trips = await prisma.trip.findMany({
    include: { places: true },
  });

  let dayCount = 0;
  let placeCount = 0;

  for (const trip of trips) {
    const existingDays = await prisma.tripDay.count({ where: { tripId: trip.id } });
    if (existingDays > 0) continue;

    if (trip.places.length === 0) continue;

    const day = await prisma.tripDay.create({
      data: {
        dayNumber: 1,
        title: "Day 1",
        tripId: trip.id,
      },
    });
    dayCount++;

    const result = await prisma.place.updateMany({
      where: { tripId: trip.id, dayId: null },
      data: { dayId: day.id },
    });
    placeCount += result.count;
  }

  console.log(`Created ${dayCount} default days`);
  console.log(`Assigned ${placeCount} places to days`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

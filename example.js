import { createRoxy } from '@roxyapi/sdk';

const roxy = createRoxy(process.env.ROXY_API_KEY);

/**
 * Chinese Almanac API: the Tong Shu reading of one day, then a bounded date
 * selection scan across a planning window. Day officer, lunar mansion, clash
 * animal and the yi and ji lists come back as structured fields, so a date
 * picker can show why a day was chosen. No coordinates are needed.
 */
async function main() {
  const day = await roxy.chineseAstrology.getAlmanacDay({ path: { date: '2026-10-11' } });
  if (day.error) throw new Error(day.error.error);
  const d = day.data;

  console.log(`Almanac for ${d.date}`);
  console.log(`  Lunar date    ${d.lunar.year}-${d.lunar.month}-${d.lunar.day}`);
  console.log(`  Day pillar    ${d.dayPillar.id} ${d.dayPillar.chinese}, ${d.dayPillar.naYin}`);
  console.log(`  Day officer   ${d.dayOfficer.chinese} ${d.dayOfficer.name} (${d.dayOfficer.quality})`);
  console.log(`  Mansion       ${d.mansion.number} ${d.mansion.chinese} ${d.mansion.name}`);
  console.log(`  Clashes with  ${d.clashAnimal}`);
  console.log(`  Favours       ${d.favours.join(', ')}`);

  // Date selection over a planning window, dropping the days that clash with the Rat.
  const search = await roxy.chineseAstrology.lookupAuspiciousDays({
    body: {
      activity: 'wedding',
      startDate: '2026-10-01',
      endDate: '2026-11-15',
      avoidAnimal: 'rat',
    },
  });
  if (search.error) throw new Error(search.error.error);
  const s = search.data;

  console.log(`\n${s.activityLabel} dates, ${s.startDate} to ${s.endDate}`);
  console.log(`  ${s.total} favoured of ${s.daysSearched} days searched, protecting the ${s.avoidAnimal}`);
  for (const c of s.days) {
    console.log(`  ${c.date}  ${c.dayOfficer.name}  mansion ${c.mansion.name}  clashes ${c.clashAnimal}`);
  }
}

main().catch(console.error);

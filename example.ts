import { createRoxy } from '@roxyapi/sdk';

const roxy = createRoxy(process.env.ROXY_API_KEY!);

/**
 * Chinese Almanac API: the Tong Shu reading of one day, then a bounded date
 * selection scan across a planning window. The day view returns the lunisolar
 * date, the year, month and day pillars with their Na Yin, the jian chu day
 * officer, the lunar mansion on duty, the clash animal, and the activities the
 * officer favours or opposes. The search returns the same object for every
 * favoured day in the range, so a caller can show the reasoning behind a date
 * rather than a bare verdict. No coordinates: the Chinese calendar is evaluated
 * at a fixed reference meridian, so a lunar date is the same worldwide.
 */
async function main() {
  const date = '2026-10-11';

  const day = await roxy.chineseAstrology.getAlmanacDay({ path: { date } });
  if (day.error) throw new Error(day.error.error);
  const d = day.data;

  console.log(`Almanac for ${d.date}`);
  console.log(`  Lunar date      ${d.lunar.year}-${d.lunar.month}-${d.lunar.day}` +
    `${d.lunar.isLeapMonth ? ' (leap month)' : ''}, month of ${d.lunar.monthLength} days`);
  console.log(`  Pillars         year ${d.yearPillar.id} ${d.yearPillar.chinese}` +
    `, month ${d.monthPillar.id} ${d.monthPillar.chinese}` +
    `, day ${d.dayPillar.id} ${d.dayPillar.chinese}`);
  console.log(`  Day Na Yin      ${d.dayPillar.naYin} (${d.dayPillar.naYinElement})`);
  console.log(`  Day officer     ${d.dayOfficer.id} ${d.dayOfficer.chinese} ` +
    `${d.dayOfficer.name}, ${d.dayOfficer.quality}`);
  console.log(`                  ${d.dayOfficer.meaning}`);
  console.log(`  Lunar mansion   ${d.mansion.number} ${d.mansion.chinese} ${d.mansion.name}` +
    `, ${d.mansion.palace} palace, ${d.mansion.planet}, ${d.mansion.animal}`);
  console.log(`  Clashes with    ${d.clashAnimal}`);
  console.log(`  Favours         ${d.favours.join(', ') || 'nothing listed'}`);
  console.log(`  Avoids          ${d.avoids.join(', ') || 'nothing listed'}`);

  // Date selection: scan a planning window for the days a wedding is favoured on,
  // dropping every day that clashes with the Rat so a guest born in a Rat year is
  // not asked to attend on their clash day.
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

  console.log(`\n${s.activityLabel} dates between ${s.startDate} and ${s.endDate}`);
  console.log(`  ${s.daysSearched} days searched, protecting the ${s.avoidAnimal}, ${s.total} favoured`);
  for (const candidate of s.days) {
    console.log(`  ${candidate.date}  ${candidate.dayOfficer.chinese} ` +
      `${candidate.dayOfficer.name.padEnd(9)} mansion ${String(candidate.mansion.number).padStart(2)} ` +
      `${candidate.mansion.name.padEnd(12)} clashes ${candidate.clashAnimal}`);
  }
}

main().catch(console.error);

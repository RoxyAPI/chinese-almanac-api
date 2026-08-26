# AGENTS.md for Chinese Almanac API

This repo teaches AI coding agents (Cursor, Claude Code, Aider, Codex, Windsurf, RooCode, Gemini CLI) how to use the RoxyAPI Chinese almanac endpoints: the Tong Shu day view and auspicious date selection.

## Endpoints
- Almanac day: `GET https://roxyapi.com/api/v2/chinese-astrology/calendar/day/{date}`
  - Operation ID: `getAlmanacDay` matches the SDK method name in camelCase
  - MCP tool: `get_chinese_astrology_calendar_day_date`
- Date selection: `POST https://roxyapi.com/api/v2/chinese-astrology/calendar/auspicious-days`
  - Operation ID: `lookupAuspiciousDays` matches the SDK method name in camelCase
  - MCP tool: `post_chinese_astrology_calendar_auspicious_days`
- Auth: `X-API-Key` header
- Domain: `chinese-astrology` (one of 14+ in the RoxyAPI catalog)
- MCP server: `https://roxyapi.com/mcp/chinese-astrology`, Streamable HTTP

## TypeScript SDK
```ts
import { createRoxy } from '@roxyapi/sdk';
const roxy = createRoxy(process.env.ROXY_API_KEY!);

const day = await roxy.chineseAstrology.getAlmanacDay({ path: { date: '2026-10-11' } });

const search = await roxy.chineseAstrology.lookupAuspiciousDays({
  body: {
    activity: 'wedding',
    startDate: '2026-10-01',
    endDate: '2026-11-15',
    avoidAnimal: 'rat',
  },
});
```

## Python SDK
```python
import os
from roxy_sdk import create_roxy
roxy = create_roxy(os.environ["ROXY_API_KEY"])

day = roxy.chinese_astrology.get_almanac_day(date="2026-10-11")

search = roxy.chinese_astrology.lookup_auspicious_days(
    activity="wedding",
    start_date="2026-10-01",
    end_date="2026-11-15",
    avoid_animal="rat",
)
```

## Setup step (coordinates not required)
Neither endpoint takes a latitude or a longitude, and no endpoint in this domain requires one. The Chinese lunisolar calendar is defined at a fixed UTC+8 reference meridian, so a lunar date, a pillar, a day officer and a mansion are the same worldwide for a given Gregorian date. Do not call `/location/search` for these endpoints. Pass the date, or the activity plus the range, directly.

## Request fields
Almanac day:
- `date` (path, required): Gregorian date YYYY-MM-DD, evaluated at the reference meridian. Years 1900 to 2100
- `lang` (query, optional): `en`, `tr`, `de`, `es`, `hi`, `pt`, `fr`, `ru`, `zh-Hans`, `zh-Hant`. Defaults to `en`

Date selection:
- `activity` (body, required): one of `wedding`, `travel`, `moving-house`, `opening-business`, `signing-contracts`, `construction`, `groundbreaking`, `burial`, `medical-treatment`, `praying`. Matching folds case and punctuation, so `moving-house` and `MOVING_HOUSE` both resolve
- `startDate` (body, required): first date of the range, inclusive, YYYY-MM-DD
- `endDate` (body, required): last date of the range, inclusive. The range may not exceed 93 days
- `avoidAnimal` (body, optional): `rat`, `ox`, `tiger`, `rabbit`, `dragon`, `snake`, `horse`, `goat`, `monkey`, `rooster`, `dog`, `pig`. Days that clash with this animal are dropped from the results
- `lang` (query, optional): same ten codes as above

## Response top level keys
Almanac day:
- `date`: the Gregorian date at the reference meridian
- `lunar`: `year`, `month`, `day`, `isLeapMonth`, `monthLength`, `date`
- `yearPillar`, `monthPillar`, `dayPillar`: each `id` (stem-branch pinyin), `number` (1 to 60), `stem`, `branch`, `chinese`, `naYin`, `naYinElement`
- `dayOfficer`: `id`, `name`, `chinese`, `pinyin`, `quality`, `meaning`, plus `nameLocalized` when `lang` is not `en`
- `mansion`: `number` (1 to 28), `name`, `chinese`, `pinyin`, `palace`, `planet`, `animal`
- `clashAnimal`: English animal id, plus `clashAnimalLocalized` when `lang` is not `en`
- `favours`, `avoids`: activity identifier arrays, English kebab case

Date selection:
- `activity`, `activityLabel`, `startDate`, `endDate`, `daysSearched`, `total`
- `avoidAnimal`: echoed only when one was sent, absent rather than null
- `days[]`: the favoured days in date order, each the same object the day view returns

## Domain rules
- Coordinates are never needed in this domain. Never call `/location/search` for these endpoints.
- The search range is capped at 93 days, which is a quarter. A longer range returns 400 with the day count in the message, rather than being silently trimmed. Page a longer plan into consecutive quarters.
- `total` is the count after the clash filter, not the number of days searched. Read `daysSearched` for the range size.
- `id`, `stem`, `branch`, `palace`, `quality`, `clashAnimal`, and every entry of `favours` and `avoids` are stable English machine values in every language. Branch on those. The `*Localized` siblings and `name`, `meaning`, `activityLabel` are the display strings, and the `Localized` ones are absent when `lang` is `en`.
- `mansion.number` is the mansion identifier, not the pinyin: three mansions share the pinyin wei and two share bi, so a pinyin key is not unique.
- The year and month pillars here are attributed by whole days, which is what an almanac prints. The day a solar term falls on belongs to the new period for its whole length, however late in the day the term arrives. A chart built from a birth TIME uses the term instant instead, so it can differ inside that one day.
- A leap month repeats the number of the month it follows and is flagged by `lunar.isLeapMonth`. Never assume twelve months in a year.
- `avoidAnimal` is how a date is chosen around the people attending. Filtering for the Rat drops 2026-10-11 out of a wedding search, because that day clashes with the Rat.

## Related endpoints
- `GET /chinese-astrology/calendar/monthly` (`getMonthlyAlmanac`): every day of a month with pillars, officer, mansion and clash animal, plus the solar terms inside the month. One call instead of thirty
- `GET /chinese-astrology/calendar/solar-terms/{year}` (`listSolarTerms`): the 24 solar terms of a solar year as exact instants, Li Chun to Li Chun. Settles where a month pillar boundary falls
- `POST /chinese-astrology/calendar/lunar-date` (`calculateLunarDate`): convert a Gregorian date to the lunisolar calendar or convert a lunar date back, leap months included

## Verified
2026-Q3 against `https://roxyapi.com/api/v2/openapi.json`. Re-fetch the spec for ground truth before changing this file.

## Discovery
- Full catalog: https://roxyapi.com/AGENTS.md
- LLM index: https://roxyapi.com/llms.txt
- Methodology: https://roxyapi.com/methodology

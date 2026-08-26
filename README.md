[![Chinese Almanac API](banner.png)](https://roxyapi.com/products/chinese-astrology-api)

# Chinese Almanac API

> Chinese almanac API for the Tong Shu day view and auspicious date selection. Day officer, 28 lunar mansions, lunisolar date, clash animal, and the favours and avoids lists as structured fields, plus a bounded search that returns the favourable days for a named activity. One key covers 14+ spiritual domains. MCP-first, nine translated locales including Simplified and Traditional Chinese.

[![Get API Key](https://img.shields.io/badge/Get_API_Key-RoxyAPI-14b8a6?style=for-the-badge&logo=key&logoColor=white)](https://roxyapi.com/pricing)
[![Try Live](https://img.shields.io/badge/Try_API_Live-Free_in_browser-22c55e?style=for-the-badge&logo=swagger&logoColor=white)](https://roxyapi.com/api-reference)
[![Methodology](https://img.shields.io/badge/Methodology-Gold_standard_tests-f59e0b?style=for-the-badge&logo=readthedocs&logoColor=white)](https://roxyapi.com/methodology)
[![MCP Server](https://img.shields.io/badge/MCP_Server-Streamable_HTTP-8b5cf6?style=for-the-badge&logo=anthropic&logoColor=white)](https://roxyapi.com/docs/mcp)
[![SDK](https://img.shields.io/badge/SDK-TypeScript_+_Python_+_PHP_+_C%23_+_Go_+_WordPress-3b82f6?style=for-the-badge&logo=npm&logoColor=white)](https://roxyapi.com/docs/sdk)

## What is Chinese Almanac API

The Tong Shu is the Chinese almanac, the book a lunar calendar day is read out of before a wedding, a move, or a shop opening is booked. This repo ships working TypeScript, JavaScript, and Python samples against two RoxyAPI endpoints that put it behind a typed call.

The first returns the almanac reading of a single day: its lunisolar date, the year, month and day pillars with their Na Yin, the day officer from the twelve jian chu sequence, which of the 28 lunar mansions is on duty, the zodiac animal the day clashes with, and the activities the officer favours or opposes. The day officer is the layer a printed almanac reaches its verdict from first, and the response says exactly what it rules on rather than reducing the day to a single score.

The second is the date selection half, and it is where the reading turns into a decision. Send an activity, a start date and an end date, and the auspicious date API scans the window and returns every day the activity is favoured on, each with the same full reading attached. Add an animal to protect and the days that clash with it drop out, which is how a date is chosen around the people attending rather than in the abstract.

One subscription unlocks 14+ spiritual domains: Western astrology, Vedic astrology, Forecast, Human Design, Chinese astrology, Feng Shui, numerology, tarot, biorhythm, I Ching, crystals, dreams, angel numbers, and location. The lunisolar calendar underneath is computed by Roxy Ephemeris from the exact solar term and new moon instants, at the UTC+8 reference meridian the Chinese calendar is defined on, so a lunar calendar day is the same worldwide instead of shifting with the caller timezone.

## Why this API

| Property | Value |
|----------|-------|
| Coverage | 14+ spiritual domains in one subscription |
| Calculation | Roxy Ephemeris, evaluated at the UTC+8 reference meridian with leap months handled |
| Structured fields | Day officer, lunar mansion, clash animal, favours and avoids, all typed, never prose to parse |
| Languages | English plus nine translated locales, including Simplified and Traditional Chinese |
| MCP server | `https://roxyapi.com/mcp/chinese-astrology` (Streamable HTTP, no local setup) |
| SDKs | TypeScript on npm `@roxyapi/sdk`, Python on PyPI `roxy-sdk`, PHP on Packagist `roxyapi/sdk`, C# on NuGet `RoxyApi.Sdk`, Go `github.com/RoxyAPI/sdk-go`, WordPress plugin `roxyapi` |
| Pricing | One key, flat per call, from $39/mo |
| Licensing | Personal and commercial use, including closed source apps. No AGPL or GPL entanglement. [Full terms](https://roxyapi.com/policy/license) |
| Last verified | 2026-Q3 |

## Quick start

1. Get a key at [roxyapi.com/pricing](https://roxyapi.com/pricing)
2. Pick a language below
3. Copy the snippet, run, ship

No coordinates and no location lookup. The Chinese calendar is defined at a fixed reference meridian, so a date is all either endpoint needs.

### cURL

```bash
# The almanac reading of one lunar calendar day
curl https://roxyapi.com/api/v2/chinese-astrology/calendar/day/2026-10-11 \
  -H "X-API-Key: $ROXY_API_KEY"

# Date selection: the favoured wedding days in a planning window,
# skipping every day that clashes with the Rat
curl -X POST https://roxyapi.com/api/v2/chinese-astrology/calendar/auspicious-days \
  -H "X-API-Key: $ROXY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "activity": "wedding",
    "startDate": "2026-10-01",
    "endDate": "2026-11-15",
    "avoidAnimal": "rat"
  }'
```

### Python

```python
import os
from roxy_sdk import create_roxy

roxy = create_roxy(os.environ["ROXY_API_KEY"])

# The almanac reading of one lunar calendar day
day = roxy.chinese_astrology.get_almanac_day(date="2026-10-11")
print(day["date"], day["dayOfficer"]["name"], day["mansion"]["name"])
print("favours:", ", ".join(day["favours"]))

# Date selection across a planning window, protecting the Rat
search = roxy.chinese_astrology.lookup_auspicious_days(
    activity="wedding",
    start_date="2026-10-01",
    end_date="2026-11-15",
    avoid_animal="rat",
)
print(search["total"], "favoured of", search["daysSearched"], "days searched")
for c in search["days"]:
    print(c["date"], c["dayOfficer"]["name"], "clashes", c["clashAnimal"])
```

### JavaScript (Node)

```js
import { createRoxy } from '@roxyapi/sdk';

const roxy = createRoxy(process.env.ROXY_API_KEY);

// The almanac reading of one lunar calendar day
const day = await roxy.chineseAstrology.getAlmanacDay({ path: { date: '2026-10-11' } });
if (day.error) throw new Error(day.error.error);
console.log(day.data.date, day.data.dayOfficer.name, day.data.mansion.name);
console.log('favours:', day.data.favours.join(', '));

// Date selection across a planning window, protecting the Rat
const search = await roxy.chineseAstrology.lookupAuspiciousDays({
  body: {
    activity: 'wedding',
    startDate: '2026-10-01',
    endDate: '2026-11-15',
    avoidAnimal: 'rat',
  },
});
if (search.error) throw new Error(search.error.error);
console.log(search.data.total, 'favoured of', search.data.daysSearched, 'days searched');
search.data.days.forEach(c => console.log(c.date, c.dayOfficer.name, 'clashes', c.clashAnimal));
```

### TypeScript

```ts
import { createRoxy } from '@roxyapi/sdk';

const roxy = createRoxy(process.env.ROXY_API_KEY!);

// The almanac reading of one lunar calendar day
const day = await roxy.chineseAstrology.getAlmanacDay({ path: { date: '2026-10-11' } });
if (day.error) throw new Error(day.error.error);
const d = day.data;
console.log(`${d.date}  officer ${d.dayOfficer.chinese} ${d.dayOfficer.name} (${d.dayOfficer.quality})`);
console.log(`mansion ${d.mansion.number} ${d.mansion.name}, clashes ${d.clashAnimal}`);
console.log(`favours ${d.favours.join(', ')}`);

// Date selection across a planning window, protecting the Rat
const search = await roxy.chineseAstrology.lookupAuspiciousDays({
  body: {
    activity: 'wedding',
    startDate: '2026-10-01',
    endDate: '2026-11-15',
    avoidAnimal: 'rat',
  },
});
if (search.error) throw new Error(search.error.error);
for (const c of search.data.days) {
  console.log(`${c.date}  ${c.dayOfficer.name}  mansion ${c.mansion.name}  clashes ${c.clashAnimal}`);
}
```

## Request schema

### Almanac day

`GET /chinese-astrology/calendar/day/{date}`

| Field | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `date` | path | string | yes | Gregorian date in YYYY-MM-DD format, evaluated at the reference meridian. Years 1900 to 2100 |
| `lang` | query | string | no | Response language. One of `en`, `tr`, `de`, `es`, `hi`, `pt`, `fr`, `ru`, `zh-Hans`, `zh-Hant`. Defaults to `en` |

### Date selection

`POST /chinese-astrology/calendar/auspicious-days`

| Field | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `activity` | body | string | yes | Activity to choose a date for. One of `wedding`, `travel`, `moving-house`, `opening-business`, `signing-contracts`, `construction`, `groundbreaking`, `burial`, `medical-treatment`, `praying`. Matching folds case and punctuation, so `moving-house` and `MOVING_HOUSE` both resolve |
| `startDate` | body | string | yes | First date of the range to search, inclusive. YYYY-MM-DD |
| `endDate` | body | string | yes | Last date of the range to search, inclusive. The range may not exceed 93 days, which is a quarter, because date selection happens inside a planning window rather than across a lifetime |
| `avoidAnimal` | body | string | no | Zodiac animal to protect. Days that clash with this animal are dropped from the results. One of `rat`, `ox`, `tiger`, `rabbit`, `dragon`, `snake`, `horse`, `goat`, `monkey`, `rooster`, `dog`, `pig` |
| `lang` | query | string | no | Response language, same ten codes as above. Defaults to `en` |

## Response shape

### Almanac day

`GET /chinese-astrology/calendar/day/2026-10-11`

```json
{
  "date": "2026-10-11",
  "lunar": {
    "year": 2026,
    "month": 9,
    "day": 2,
    "isLeapMonth": false,
    "monthLength": 30,
    "date": "2026-10-11"
  },
  "yearPillar": {
    "id": "bing-wu",
    "number": 43,
    "stem": "bing",
    "branch": "wu",
    "chinese": "丙午",
    "naYin": "Water of the Sky River",
    "naYinElement": "Water"
  },
  "monthPillar": {
    "id": "wu-xu",
    "number": 35,
    "stem": "wu",
    "branch": "xu",
    "chinese": "戊戌",
    "naYin": "Wood of the Level Ground",
    "naYinElement": "Wood"
  },
  "dayPillar": {
    "id": "wu-wu",
    "number": 55,
    "stem": "wu",
    "branch": "wu",
    "chinese": "戊午",
    "naYin": "Fire in the Sky",
    "naYinElement": "Fire"
  },
  "dayOfficer": {
    "id": "cheng",
    "name": "Complete",
    "chinese": "成",
    "pinyin": "chéng",
    "quality": "auspicious",
    "meaning": "The day things come off. The most broadly favourable of the twelve, and the usual first choice when a date has to carry a marriage, an opening or a move."
  },
  "mansion": {
    "number": 25,
    "name": "Star",
    "chinese": "星",
    "pinyin": "Xīng",
    "palace": "vermilion-bird",
    "planet": "Sun",
    "animal": "Horse"
  },
  "clashAnimal": "rat",
  "favours": ["wedding", "opening-business", "signing-contracts", "moving-house"],
  "avoids": []
}
```

| Field | Type | Description |
|-------|------|-------------|
| `date` | string | The Gregorian date of the day, at the reference meridian |
| `lunar` | object | The lunisolar date: `year`, `month`, `day`, `isLeapMonth`, `monthLength`, and the Gregorian `date` it covers. A leap month repeats the number of the month it follows, and a lunar month never has 31 days |
| `yearPillar` | object | Sexagenary year pillar of the day, attributed by whole days, so the day Li Chun falls on belongs to the new year for its whole length |
| `monthPillar` | object | Sexagenary month pillar, and the pillar the day officer is counted from. Attributed by whole days, so the day a minor solar term falls on belongs to the new month even when the term arrives late in the evening |
| `dayPillar` | object | Sexagenary day pillar. Each pillar carries `id` (stem-branch, always English pinyin), `number` (1 to 60), `stem`, `branch`, `chinese`, `naYin`, and `naYinElement` |
| `dayOfficer` | object | The jian chu officer on duty: `id` (one of jian chu man ping ding zhi po wei cheng shou kai bi), `name`, `chinese`, `pinyin`, `quality` (`auspicious` or `inauspicious`), and `meaning`, which says what the day actually rules on |
| `dayOfficer.nameLocalized` | string | Display name of the officer in the requested language. Absent when `lang` is `en`, so an English response is unchanged |
| `mansion` | object | The lunar mansion on duty: `number` (1 to 28, counted from the Horn, and the identifier, because three mansions share the pinyin wei), `name`, `chinese`, `pinyin`, `palace`, `planet`, and `animal` |
| `clashAnimal` | string | The zodiac animal the day clashes with, six branches from the day branch. A stable English machine value |
| `clashAnimalLocalized` | string | Display name of the clashing animal in the requested language. Absent when `lang` is `en` |
| `favours` | array | Activity identifiers the officer favours, always English kebab case, so they stay safe to compare against |
| `avoids` | array | Activity identifiers the officer opposes, same identifiers as `favours` |

### Date selection

`POST /chinese-astrology/calendar/auspicious-days`

```json
{
  "activity": "wedding",
  "activityLabel": "Wedding",
  "startDate": "2026-10-01",
  "endDate": "2026-11-15",
  "daysSearched": 46,
  "avoidAnimal": "rat",
  "total": 4,
  "days": [
    {
      "date": "2026-10-06",
      "lunar": {
        "year": 2026,
        "month": 8,
        "day": 26,
        "isLeapMonth": false,
        "monthLength": 29,
        "date": "2026-10-06"
      },
      "dayPillar": {
        "id": "gui-chou",
        "number": 50,
        "stem": "gui",
        "branch": "chou",
        "chinese": "癸丑",
        "naYin": "Wood of the Mulberry",
        "naYinElement": "Wood"
      },
      "dayOfficer": {
        "id": "ding",
        "name": "Settle",
        "chinese": "定",
        "pinyin": "dìng",
        "quality": "auspicious",
        "meaning": "A day that fixes things in place. Anything meant to hold, a marriage, a contract, a business opened to stay open, is at home here. Anything meant to move is not."
      },
      "mansion": {
        "number": 20,
        "name": "Turtle Beak",
        "chinese": "觜",
        "pinyin": "Zī",
        "palace": "white-tiger",
        "planet": "Fire",
        "animal": "Monkey"
      },
      "clashAnimal": "goat",
      "favours": ["wedding", "signing-contracts", "opening-business"],
      "avoids": ["travel"]
    }
  ]
}
```

Every entry in `days` is the full almanac day object above, `yearPillar` and `monthPillar` included, trimmed here for length.

| Field | Type | Description |
|-------|------|-------------|
| `activity` | string | Echo of the activity searched for, folded to its canonical identifier |
| `activityLabel` | string | Display label for the activity in the requested language |
| `startDate` | string | Echo of the first date of the range |
| `endDate` | string | Echo of the last date of the range |
| `daysSearched` | number | Number of days in the range, counting both ends |
| `avoidAnimal` | string | Echo of the animal protected. Absent when none was sent, rather than null |
| `total` | number | Number of favoured days found, counted after the clash filter, not the number of days searched |
| `days` | array | The favoured days in date order, each the same object the day view returns |

## Common use cases

| Use case | Endpoint flow |
|----------|---------------|
| Chinese wedding dates for a season | POST to `/calendar/auspicious-days` with `activity` of `wedding` and the planning window, render `days[]` as pickable cards |
| Date selection around the guests | Pass `avoidAnimal` so the days that clash with the bride, the groom, or an elder drop out before anyone sees the list |
| Tong Shu day card in a calendar app | GET `/calendar/day/{date}` for the tapped day, show `dayOfficer`, `mansion`, `clashAnimal`, and the favours and avoids lists |
| Shop or office opening date | POST with `activity` of `opening-business`, read `dayOfficer.meaning` to explain each candidate |
| Moving and travel date picker | POST with `activity` of `moving-house` or `travel`, then confirm the chosen day with the day view |
| Lunar birthday and festival reminders | POST to `/calendar/lunar-date` to convert either direction, with leap months handled rather than skipped |
| Month grid for an almanac page | GET `/calendar/monthly` for every day of a month plus the solar terms inside it, one call instead of thirty |
| Localized almanac widget | Add `?lang=zh-Hans` or `?lang=zh-Hant`, keep switching on the English `id` fields, and display the localized siblings |

## Related endpoints in this domain

- `GET /chinese-astrology/calendar/monthly` (`getMonthlyAlmanac`) - every day of one month with its pillars, officer, mansion and clash animal, plus the solar terms that fall inside it. The month grid a calendar widget renders in one call instead of thirty
- `GET /chinese-astrology/calendar/solar-terms/{year}` (`listSolarTerms`) - all 24 solar terms of a solar year as exact instants, Li Chun to Li Chun. This is the call that settles where a month pillar boundary falls
- `POST /chinese-astrology/calendar/lunar-date` (`calculateLunarDate`) - convert a Gregorian date to the lunisolar calendar or convert a lunar date back, in one endpoint, leap months included

## Use this in your AI agent

Connect Claude, GPT, Gemini, or Cursor to RoxyAPI through the remote MCP server. No Docker. No self hosting. The full MCP tool catalog for this domain is at `https://roxyapi.com/mcp/chinese-astrology`.

```json
{
  "mcpServers": {
    "chinese-astrology": {
      "url": "https://roxyapi.com/mcp/chinese-astrology",
      "headers": { "X-API-Key": "$ROXY_API_KEY" }
    }
  }
}
```

The two tools this repo demos are `get_chinese_astrology_calendar_day_date` and `post_chinese_astrology_calendar_auspicious_days`. See [docs/mcp](https://roxyapi.com/docs/mcp) for Claude Desktop, Cursor, Windsurf, VS Code, and Claude Code setup.

## For AI coding agents

This repo ships an [AGENTS.md](AGENTS.md) execution playbook. Cursor, Claude Code, Aider, Codex, Windsurf, RooCode, and Gemini CLI will pick it up automatically. Top level overview lives at [roxyapi.com/AGENTS.md](https://roxyapi.com/AGENTS.md).

## Resources

- [Methodology and gold standard tests](https://roxyapi.com/methodology)
- [Full API reference](https://roxyapi.com/api-reference) interactive Scalar UI
- [TypeScript SDK on npm](https://www.npmjs.com/package/@roxyapi/sdk)
- [Python SDK on PyPI](https://pypi.org/project/roxy-sdk/)
- [PHP SDK on Packagist](https://packagist.org/packages/roxyapi/sdk)
- [C# SDK on NuGet](https://www.nuget.org/packages/RoxyApi.Sdk)
- [Go SDK on pkg.go.dev](https://pkg.go.dev/github.com/RoxyAPI/sdk-go)
- [WordPress plugin](https://wordpress.org/plugins/roxyapi/)
- [llms.txt](https://roxyapi.com/llms.txt) full LLM citation index
- [Top level AGENTS.md](https://roxyapi.com/AGENTS.md)

## Other RoxyAPI samples

[![Transit Forecast API](https://img.shields.io/badge/Transit_Forecast_API-RoxyAPI-14b8a6?style=flat-square)](https://github.com/RoxyAPI/transit-forecast-api)
[![Moon Phase API](https://img.shields.io/badge/Moon_Phase_API-RoxyAPI-14b8a6?style=flat-square)](https://github.com/RoxyAPI/moon-phase-api)
[![Numerology API](https://img.shields.io/badge/Numerology_API-RoxyAPI-14b8a6?style=flat-square)](https://github.com/RoxyAPI/numerology-api)
[![Tarot API](https://img.shields.io/badge/Tarot_API-RoxyAPI-14b8a6?style=flat-square)](https://github.com/RoxyAPI/tarot-api)
[![Biorhythm API](https://img.shields.io/badge/Biorhythm_API-RoxyAPI-14b8a6?style=flat-square)](https://github.com/RoxyAPI/biorhythm-api)

## License

MIT for this sample repo. See [LICENSE](LICENSE).

**Catalog licensing:** Personal and commercial use, including closed source proprietary apps. No AGPL or GPL entanglement. RoxyAPI APIs and SDKs are safe to embed in commercial products. Full terms at [roxyapi.com/policy/license](https://roxyapi.com/policy/license).

## Contact

- Site: [roxyapi.com](https://roxyapi.com)
- Status: [roxyapi.com/api-reference](https://roxyapi.com/api-reference)

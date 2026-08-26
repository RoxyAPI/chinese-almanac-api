"""
Chinese Almanac API: the Tong Shu reading of one day, then a bounded date
selection scan across a planning window. The day view returns the lunisolar
date, the year, month and day pillars with their Na Yin, the jian chu day
officer, the lunar mansion on duty, the clash animal, and the activities the
officer favours or opposes. The search returns the same object for every
favoured day in the range, so a caller can show the reasoning behind a date
rather than a bare verdict. No coordinates: the Chinese calendar is evaluated
at a fixed reference meridian, so a lunar date is the same worldwide.
"""

import os

from roxy_sdk import create_roxy

roxy = create_roxy(os.environ["ROXY_API_KEY"])


def main():
    day = roxy.chinese_astrology.get_almanac_day(date="2026-10-11")

    lunar = day["lunar"]
    leap = " (leap month)" if lunar["isLeapMonth"] else ""
    officer = day["dayOfficer"]
    mansion = day["mansion"]

    print(f"Almanac for {day['date']}")
    print(f"  Lunar date      {lunar['year']}-{lunar['month']}-{lunar['day']}{leap}, "
          f"month of {lunar['monthLength']} days")
    print(f"  Pillars         year {day['yearPillar']['id']} {day['yearPillar']['chinese']}, "
          f"month {day['monthPillar']['id']} {day['monthPillar']['chinese']}, "
          f"day {day['dayPillar']['id']} {day['dayPillar']['chinese']}")
    print(f"  Day Na Yin      {day['dayPillar']['naYin']} ({day['dayPillar']['naYinElement']})")
    print(f"  Day officer     {officer['id']} {officer['chinese']} {officer['name']}, "
          f"{officer['quality']}")
    print(f"                  {officer['meaning']}")
    print(f"  Lunar mansion   {mansion['number']} {mansion['chinese']} {mansion['name']}, "
          f"{mansion['palace']} palace, {mansion['planet']}, {mansion['animal']}")
    print(f"  Clashes with    {day['clashAnimal']}")
    print(f"  Favours         {', '.join(day['favours']) or 'nothing listed'}")
    print(f"  Avoids          {', '.join(day['avoids']) or 'nothing listed'}")

    # Date selection: scan a planning window for the days a wedding is favoured on,
    # dropping every day that clashes with the Rat so a guest born in a Rat year is
    # not asked to attend on their clash day.
    search = roxy.chinese_astrology.lookup_auspicious_days(
        activity="wedding",
        start_date="2026-10-01",
        end_date="2026-11-15",
        avoid_animal="rat",
    )

    print(f"\n{search['activityLabel']} dates between "
          f"{search['startDate']} and {search['endDate']}")
    print(f"  {search['daysSearched']} days searched, "
          f"protecting the {search['avoidAnimal']}, {search['total']} favoured")
    for c in search["days"]:
        print(f"  {c['date']}  {c['dayOfficer']['chinese']} "
              f"{c['dayOfficer']['name']:<9} mansion {c['mansion']['number']:>2} "
              f"{c['mansion']['name']:<12} clashes {c['clashAnimal']}")


if __name__ == "__main__":
    main()

using System;
using System.Linq;
using System.Text.RegularExpressions;

namespace AppServer.Helpers
{
    /// <summary>
    /// Вспомагательные функции
    /// </summary>
    public static class MeasureHelper
    {
        public static string GetPartOfString(this string text, string startStr, string endStr)
        {
            return Regex.Match(text, $"{startStr}\\s(?<words>[:-;'\\w\\s]+)\\s{endStr}", RegexOptions.IgnoreCase)
                .Groups["words"]
                .Value;
        }

        /// <summary>
        /// 2022.03.31--13-13-43.txt -> DateTime
        /// </summary>
        public static DateTime GetCurrentDateTimeFromMeasureDate(string value)
        {
            try
            {
                // 2022.03.31--13-13-43
                var creationDate = string.IsNullOrWhiteSpace(value) ? "" : value.Replace(".txt", "");
                if (string.IsNullOrWhiteSpace(creationDate))
                {
                    return default;
                }

                var dateAndTime = creationDate.Split("--")
                    .Select((value, index) => value.Split(index == 0 ? '.' : '-').Select(value => Convert.ToInt32(value)).ToArray()).ToArray();
                return new DateTime(dateAndTime[0][2], dateAndTime[0][1], dateAndTime[0][0], dateAndTime[1][0],
                    dateAndTime[1][1], dateAndTime[1][2]);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
    }
}
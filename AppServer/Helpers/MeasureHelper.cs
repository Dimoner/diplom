using System;

namespace AppServer.Helpers
{
    /// <summary>
    /// Вспомагательные функции
    /// </summary>
    public static class MeasureHelper
    {
        public static string GetPartOfString(this string text, string startStr, string endStr)
        {
            var start = startStr.Length;
            var end = text.IndexOf(endStr, start, StringComparison.Ordinal);
            var description = text.Substring(start + 1, end - start - 1).Trim();
            return description;
        }
    }
}
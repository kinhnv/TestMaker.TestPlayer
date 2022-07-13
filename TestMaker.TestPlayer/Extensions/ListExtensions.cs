using System;
using System.Collections.Generic;
using System.Linq;

namespace TestMaker.TestPlayer.Extensions
{
    public static class ListExtensions
    {
        public static IEnumerable<T> RandomPosition<T>(this IEnumerable<T> enumrable)
        {
            return enumrable.Select(x => new
            {
                Order = new Random().Next(1, 100),
                Item = x
            }).OrderBy(a => a.Order).Select(x => x.Item);
        }
    }
}

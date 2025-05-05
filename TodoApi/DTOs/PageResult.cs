namespace TodoApi.DTOs
{
    public class PagedResult<T>
    {
        public IEnumerable<T> Items { get; set; } = Enumerable.Empty<T>();
        public int CurrentPage { get; set; }
        public int PageSize    { get; set; }
        public int TotalCount  { get; set; }
        public int TotalPages  => 
            (int)Math.Ceiling(TotalCount / (double)PageSize);
    }
}

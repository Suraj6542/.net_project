namespace TodoApi.Models;
using System.ComponentModel.DataAnnotations;
    public class TodoItem
    {
        public long Id { get; set; }
        
        public string? Title { get; set; }
        
        public string? Description { get; set; }
        public bool IsCompleted { get; set; }
    }


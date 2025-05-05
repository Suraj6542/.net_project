using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Models;
using TodoApi.DTOs;  // import the DTO

namespace TodoApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodosController : ControllerBase
{
    private readonly TodoContext _context;

    public TodosController(TodoContext context)
        => _context = context;

    // GET: api/todos?page=1&pageSize=5
    [HttpGet]
    public async Task<ActionResult<PagedResult<TodoItem>>> GetTodos(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 5)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 5;

        var totalCount = await _context.Todos.CountAsync();
        var items = await _context.Todos
            .OrderBy(t => t.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var result = new PagedResult<TodoItem>
        {
            Items       = items,
            CurrentPage = page,
            PageSize    = pageSize,
            TotalCount  = totalCount
        };

        return Ok(result);
    }

    // GET: api/todos/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<TodoItem>> GetTodo(long id)
    {
        var todo = await _context.Todos.FindAsync(id);
        if (todo is null)
            return NotFound();

        return todo;
    }

    // POST: api/todos
    [HttpPost]
    public async Task<ActionResult<TodoItem>> PostTodo(TodoItem todo)
    {
        if (string.IsNullOrWhiteSpace(todo.Title) ||
            string.IsNullOrWhiteSpace(todo.Description))
        {
            return BadRequest("Both Title and Description are required.");
        }

        _context.Todos.Add(todo);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetTodo),
            new { id = todo.Id },
            todo
        );
    }

    // PUT: api/todos/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> PutTodo(long id, TodoItem todo)
    {
        if (id != todo.Id)
            return BadRequest("URL id and payload id must match.");

        if (string.IsNullOrWhiteSpace(todo.Title) ||
            string.IsNullOrWhiteSpace(todo.Description))
        {
            return BadRequest("Both Title and Description are required.");
        }

        _context.Entry(todo).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.Todos.AnyAsync(e => e.Id == id))
                return NotFound();
            throw;
        }

        return NoContent();
    }

    // DELETE: api/todos/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTodo(long id)
    {
        var todo = await _context.Todos.FindAsync(id);
        if (todo is null)
            return NotFound();

        _context.Todos.Remove(todo);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
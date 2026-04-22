using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api_tasks_manager.Data;
using api_tasks_manager.Models;

namespace api_tasks_manager.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _context;

    public TasksController(AppDbContext context) => _context = context;

    // GET /api/tasks
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _context.Tasks.ToListAsync());

    // GET /api/tasks/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        return task is null ? NotFound() : Ok(task);
    }

    // POST /api/tasks
    [HttpPost]
    public async Task<IActionResult> Create(TaskItem task)
    {
        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = task.Id }, task);
    }

    // PUT /api/tasks/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, TaskItem updated)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task is null) return NotFound();

        task.Title = updated.Title;
        task.Description = updated.Description;
        task.IsCompleted = updated.IsCompleted;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE /api/tasks/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task is null) return NotFound();

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
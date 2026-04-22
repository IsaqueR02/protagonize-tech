using Microsoft.EntityFrameworkCore;
using api_tasks_manager.Models;

namespace api_tasks_manager.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<TaskItem> Tasks => Set<TaskItem>();
}
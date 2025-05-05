using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using TodoApi.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy
            .AllowAnyOrigin()      // or .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()      // <-- permits PUT, DELETE, OPTIONS, etc.
    );
});
// Configure EF Core with Pomelo MySQL
builder.Services.AddDbContext<TodoContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    )
);

builder.Services.AddControllers();
var app = builder.Build();
app.UseCors("AllowAll");
app.MapControllers();
app.Run();

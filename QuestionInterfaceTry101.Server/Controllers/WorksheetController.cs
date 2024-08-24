using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuestionInterfaceTry101.Server.Data;
using QuestionInterfaceTry101.Server.Model;
using System.Linq;
using System.Threading.Tasks;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class WorksheetController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public WorksheetController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    // GET: api/Worksheet
    [HttpGet]
    public async Task<IActionResult> GetWorksheets()
    {
        var user = await _userManager.GetUserAsync(User);
        var worksheets = await _context.Worksheets
            .Where(w => w.UserId == user.Id)
            .ToListAsync();

        return Ok(worksheets);
    }

    // GET: api/Worksheet/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetWorksheet(int id)
    {
        var user = await _userManager.GetUserAsync(User);
        var worksheet = await _context.Worksheets
            .Where(w => w.UserId == user.Id && w.WorksheetId == id)
            .FirstOrDefaultAsync();

        if (worksheet == null)
        {
            return NotFound();
        }

        return Ok(worksheet);
    }

    // POST: api/Worksheet
    [HttpPost]
    public async Task<IActionResult> CreateWorksheet([FromBody] WorksheetModel worksheet)
    {
        if (ModelState.IsValid)
        {
            var user = await _userManager.GetUserAsync(User);
            worksheet.UserId = user.Id;

            _context.Worksheets.Add(worksheet);
            await _context.SaveChangesAsync();

            return Ok(worksheet);
        }

        return BadRequest(ModelState);
    }

    // PUT: api/Worksheet/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateWorksheet(int id, [FromBody] WorksheetModel worksheet)
    {
        if (id != worksheet.WorksheetId)
        {
            return BadRequest();
        }

        var user = await _userManager.GetUserAsync(User);
        if (worksheet.UserId != user.Id)
        {
            return Unauthorized();
        }

        _context.Entry(worksheet).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Worksheets.Any(e => e.WorksheetId == id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // DELETE: api/Worksheet/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWorksheet(int id)
    {
        var user = await _userManager.GetUserAsync(User);
        var worksheet = await _context.Worksheets
            .Where(w => w.UserId == user.Id && w.WorksheetId == id)
            .FirstOrDefaultAsync();

        if (worksheet == null)
        {
            return NotFound();
        }

        _context.Worksheets.Remove(worksheet);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

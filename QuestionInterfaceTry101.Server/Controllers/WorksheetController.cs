using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using QuestionInterfaceTry101.Server.Data;
using QuestionInterfaceTry101.Server.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace QuestionInterfaceTry101.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorksheetController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public WorksheetController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<WorksheetModel>>> GetWorksheets()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return await _context.Worksheets
                                 .Where(w => w.ApplicationUserId == userId)
                                 .Include(w => w.qus)
                                 .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<WorksheetModel>> GetWorksheet(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var worksheet = await _context.Worksheets
                                          .Include(w => w.qus)
                                          .FirstOrDefaultAsync(w => w.WorksheetId == id && w.ApplicationUserId == userId);

            if (worksheet == null)
            {
                return NotFound();
            }

            return worksheet;
        }

        [HttpPost]
        public async Task<ActionResult<WorksheetModel>> PostWorksheet(WorksheetModel worksheet)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            worksheet.ApplicationUserId = userId;

            if (worksheet == null)
            {
                return BadRequest("Worksheet is null.");
            }

            int orderCounter = 1;
            foreach (var qus in worksheet.qus)
            {
                qus.Order = orderCounter++;
            }

            _context.Worksheets.Add(worksheet);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetWorksheet), new { id = worksheet.WorksheetId }, worksheet);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutWorksheet(int id, WorksheetModel worksheet)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized();
            }
            if (id != worksheet.WorksheetId || worksheet.ApplicationUserId != userId)
            {
                return BadRequest("Worksheet ID mismatch or unauthorized.");
            }

            var existingWorksheet = await _context.Worksheets
                                                  .Include(w => w.qus)
                                                  .FirstOrDefaultAsync(w => w.WorksheetId == id && w.ApplicationUserId == userId);
            if (existingWorksheet == null)
            {
                return NotFound("Worksheet not found.");
            }

            existingWorksheet.Title.Text = worksheet.Title.Text;
            existingWorksheet.Title.Config.Style = worksheet.Title.Config.Style;
            existingWorksheet.Title.Config.Styledegree = worksheet.Title.Config.Styledegree;

            existingWorksheet.FinalMessage.Text = worksheet.FinalMessage.Text;
            existingWorksheet.FinalMessage.Config.Style = worksheet.FinalMessage.Config.Style;
            existingWorksheet.FinalMessage.Config.Styledegree = worksheet.FinalMessage.Config.Styledegree;

            existingWorksheet.WorksheetType = worksheet.WorksheetType;

            existingWorksheet.qus.Clear();
            int orderCounter = 1;
            foreach (var qus in worksheet.qus)
            {
                qus.Order = orderCounter++;
                existingWorksheet.qus.Add(qus);
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WorksheetExists(id, userId))
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorksheet(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var worksheet = await _context.Worksheets
                .Include(w => w.qus)
                .FirstOrDefaultAsync(w => w.WorksheetId == id && w.ApplicationUserId == userId);

            if (worksheet == null)
            {
                return NotFound();
            }

            _context.qus.RemoveRange(worksheet.qus);
            _context.Worksheets.Remove(worksheet);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine(ex.InnerException?.Message ?? ex.Message);
                return StatusCode(500, "An error occurred while deleting the worksheet.");
            }

            return NoContent();
        }

        private bool WorksheetExists(int id, string userId)
        {
            return _context.Worksheets.Any(e => e.WorksheetId == id && e.ApplicationUserId == userId);
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuestionInterfaceTry101.Server.Data;
using QuestionInterfaceTry101.Server.Model;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace QuestionInterfaceTry101.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class WorksheetController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WorksheetController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get worksheets: Admins get all, others get only their own
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WorksheetModel>>> GetWorksheets()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = User.IsInRole("Admin");

            if (isAdmin)
            {
                return await _context.Worksheets.Include(w => w.qus).ToListAsync();
            }
            else
            {
                return await _context.Worksheets
                                     .Where(w => w.CreatedBy == userId)
                                     .Include(w => w.qus)
                                     .ToListAsync();
            }
        }

        // Get a specific worksheet by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<WorksheetModel>> GetWorksheet(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = User.IsInRole("Admin");

            var worksheet = await _context.Worksheets.Include(w => w.qus)
                                                     .FirstOrDefaultAsync(w => w.WorksheetId == id && (w.CreatedBy == userId || isAdmin));

            if (worksheet == null)
            {
                return NotFound();
            }

            return worksheet;
        }

        // Post a new worksheet
        [HttpPost]
        public async Task<ActionResult<WorksheetModel>> PostWorksheet(WorksheetModel worksheet)
        {
            if (worksheet == null)
            {
                return BadRequest("Worksheet is null.");
            }

            if (string.IsNullOrWhiteSpace(worksheet.CreatedBy))
            {
                worksheet.CreatedBy = User.FindFirst(ClaimTypes.Email)?.Value;
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

        // Update a worksheet
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWorksheet(int id, WorksheetModel worksheet)
        {
            if (id != worksheet.WorksheetId)
            {
                return BadRequest("Worksheet ID mismatch.");
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = User.IsInRole("Admin");

            var existingWorksheet = await _context.Worksheets
                                                  .Include(w => w.qus)
                                                  .FirstOrDefaultAsync(w => w.WorksheetId == id && (w.CreatedBy == userId || isAdmin));

            if (existingWorksheet == null)
            {
                return NotFound("Worksheet not found.");
            }

            // Update properties
            existingWorksheet.Title = worksheet.Title;
            existingWorksheet.FinalMessage = worksheet.FinalMessage;
            existingWorksheet.WorksheetType = worksheet.WorksheetType;

            // Clear and re-add questions
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
                if (!WorksheetExists(id))
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

        // Delete a worksheet
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorksheet(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = User.IsInRole("Admin");

            var worksheet = await _context.Worksheets
                                          .Include(w => w.qus)
                                          .FirstOrDefaultAsync(w => w.WorksheetId == id && (w.CreatedBy == userId || isAdmin));

            if (worksheet == null)
            {
                return NotFound();
            }

            // Manually delete related questions
            _context.qus.RemoveRange(worksheet.qus);
            _context.Worksheets.Remove(worksheet);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, "An error occurred while deleting the worksheet." + ex);
            }

            return NoContent();
        }

        private bool WorksheetExists(int id)
        {
            return _context.Worksheets.Any(e => e.WorksheetId == id);
        }
    }
}

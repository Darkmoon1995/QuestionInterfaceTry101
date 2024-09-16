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

        // GET: api/Worksheet
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WorksheetModel>>> GetWorksheets()
        {
            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var isAdmin = User.IsInRole("admin");

            if (isAdmin)
            {
                // Admin can view all worksheets
                return await _context.Worksheets.Include(w => w.qus).ToListAsync();
            }

            // Non-admins can only view their own worksheets
            return await _context.Worksheets
                .Where(w => w.CreatedBy == userEmail)
                .Include(w => w.qus)
                .ToListAsync();
        }

        // GET: api/Worksheet/5
        [HttpGet("{id}")]
        public async Task<ActionResult<WorksheetModel>> GetWorksheet(int id)
        {
            var worksheet = await _context.Worksheets.Include(w => w.qus)
                                                     .FirstOrDefaultAsync(w => w.WorksheetId == id);

            if (worksheet == null)
            {
                return NotFound();
            }

            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var isAdmin = User.IsInRole("admin");

            // Allow only admin or the creator to view the worksheet
            if (worksheet.CreatedBy != userEmail && !isAdmin)
            {
                return Forbid();
            }

            return worksheet;
        }

        // POST: api/Worksheet
        [HttpPost]
        public async Task<ActionResult<WorksheetModel>> PostWorksheet(WorksheetModel worksheet)
        {
            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            if (worksheet == null)
            {
                return BadRequest("Worksheet is null.");
            }

            // Set the creator email
            worksheet.CreatedBy = userEmail;

            // Auto-increment question order
            int orderCounter = 1;
            foreach (var qus in worksheet.qus)
            {
                qus.Order = orderCounter++;
            }

            _context.Worksheets.Add(worksheet);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetWorksheet), new { id = worksheet.WorksheetId }, worksheet);
        }

        // PUT: api/Worksheet/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWorksheet(int id, WorksheetModel worksheet)
        {
            if (id != worksheet.WorksheetId)
            {
                return BadRequest("Worksheet ID mismatch.");
            }

            var existingWorksheet = await _context.Worksheets
                                                  .Include(w => w.qus)
                                                  .FirstOrDefaultAsync(w => w.WorksheetId == id);
            if (existingWorksheet == null)
            {
                return NotFound();
            }

            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var isAdmin = User.IsInRole("admin");

            // Only allow the creator or admin to modify the worksheet
            if (existingWorksheet.CreatedBy != userEmail && !isAdmin)
            {
                return Forbid();
            }

            // Update worksheet properties
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

        // DELETE: api/Worksheet/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorksheet(int id)
        {
            var worksheet = await _context.Worksheets.Include(w => w.qus)
                                                     .FirstOrDefaultAsync(w => w.WorksheetId == id);

            if (worksheet == null)
            {
                return NotFound();
            }

            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var isAdmin = User.IsInRole("admin");

            // Only allow the creator or admin to delete the worksheet
            if (worksheet.CreatedBy != userEmail && !isAdmin)
            {
                return Forbid();
            }

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

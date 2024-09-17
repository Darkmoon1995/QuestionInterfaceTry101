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
            // Check if the user is in the Admin role
            var isAdmin = User.IsInRole("Admin");

            if (isAdmin)
            {
                // If the user is an Admin, return all worksheets
                return await _context.Worksheets.Include(w => w.qus).ToListAsync();
            }
            else
            {
                // Get the current user's email from the JWT claims
                var userEmail = User.FindFirstValue(ClaimTypes.Email);

                // Return only the worksheets owned by the current user
                return await _context.Worksheets
                                     .Where(w => w.OwnerEmail == userEmail)
                                     .Include(w => w.qus)
                                     .ToListAsync();
            }
        }

        // GET: api/Worksheet/5
        [HttpGet("{id}")]
        public async Task<ActionResult<WorksheetModel>> GetWorksheet(int id)
        {
            var isAdmin = User.IsInRole("Admin");
            var userEmail = User.FindFirstValue(ClaimTypes.Email);

            // Admin can access any worksheet; regular users can only access their own
            var worksheet = await _context.Worksheets.Include(w => w.qus)
                                                     .FirstOrDefaultAsync(w => w.WorksheetId == id && (isAdmin || w.OwnerEmail == userEmail));

            if (worksheet == null)
            {
                return NotFound("Worksheet not found or you do not have permission to access it.");
            }

            return worksheet;
        }

        // POST: api/Worksheet
        [HttpPost]
        public async Task<ActionResult<WorksheetModel>> PostWorksheet(WorksheetModel worksheet)
        {
            if (worksheet == null)
            {
                return BadRequest("Worksheet is null.");
            }

            // Get the email from the authenticated user's claims
            var ownerEmail = User.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(ownerEmail))
            {
                return Unauthorized("Could not determine the user's email.");
            }

            // Assign the authenticated user's email as the OwnerEmail
            worksheet.OwnerEmail = ownerEmail;

            // Set question order
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

            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            var isAdmin = User.IsInRole("Admin");

            var existingWorksheet = await _context.Worksheets
                                                  .Include(w => w.qus)
                                                  .FirstOrDefaultAsync(w => w.WorksheetId == id && (isAdmin || w.OwnerEmail == userEmail));

            if (existingWorksheet == null)
            {
                return NotFound("Worksheet not found or you do not have permission to edit it.");
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

        // DELETE: api/Worksheet/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorksheet(int id)
        {
            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            var isAdmin = User.IsInRole("Admin");

            var worksheet = await _context.Worksheets
                                          .Include(w => w.qus)
                                          .FirstOrDefaultAsync(w => w.WorksheetId == id && (isAdmin || w.OwnerEmail == userEmail));

            if (worksheet == null)
            {
                return NotFound("Worksheet not found or you do not have permission to delete it.");
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
                return StatusCode(500, "An error occurred while deleting the worksheet: " + ex.Message);
            }

            return NoContent();
        }

        private bool WorksheetExists(int id)
        {
            return _context.Worksheets.Any(e => e.WorksheetId == id);
        }
    }
}

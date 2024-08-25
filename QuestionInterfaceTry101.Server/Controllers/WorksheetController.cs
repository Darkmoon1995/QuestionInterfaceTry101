﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        public WorksheetController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<WorksheetModel>>> GetWorksheets()
        {
            return await _context.Worksheets.Include(w => w.qus).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<WorksheetModel>> GetWorksheet(int id)
        {
            var worksheet = await _context.Worksheets.Include(w => w.qus)
                                                     .FirstOrDefaultAsync(w => w.WorksheetId == id);

            if (worksheet == null)
            {
                return NotFound();
            }

            return worksheet;
        }
        [HttpPost]
        public async Task<ActionResult<WorksheetModel>> PostWorksheet(WorksheetModel worksheet)
        {
            if (worksheet == null)
            {
                return BadRequest("Worksheet is null.");
            }

            int orderCounter = 1;  // Initialize the order counter
            foreach (var qus in worksheet.qus)
            {
                qus.Order = orderCounter++;  // Increment the order for each question starting from 1
            }

            _context.Worksheets.Add(worksheet);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetWorksheet), new { id = worksheet.WorksheetId }, worksheet);
        }


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
                return NotFound("Worksheet not found.");
            }

            // Update the title and other properties
            existingWorksheet.Title.Text = worksheet.Title.Text;
            existingWorksheet.Title.Config.Style = worksheet.Title.Config.Style;
            existingWorksheet.Title.Config.Styledegree = worksheet.Title.Config.Styledegree;

            // Update the final message in the same way
            existingWorksheet.FinalMessage.Text = worksheet.FinalMessage.Text;
            existingWorksheet.FinalMessage.Config.Style = worksheet.FinalMessage.Config.Style;
            existingWorksheet.FinalMessage.Config.Styledegree = worksheet.FinalMessage.Config.Styledegree;

            // Update other properties of the worksheet
            existingWorksheet.WorksheetType = worksheet.WorksheetType;

            // Handle the questions
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



        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorksheet(int id)
        {
            var worksheet = await _context.Worksheets
                .Include(w => w.qus)
                .FirstOrDefaultAsync(w => w.WorksheetId == id);

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
                Console.WriteLine(ex.InnerException?.Message ?? ex.Message);
                return StatusCode(500, "An error occurred while deleting the worksheet.");
            }

            return NoContent();
        }


        private bool WorksheetExists(int id)
        {
            return _context.Worksheets.Any(e => e.WorksheetId == id);
        }
    }
}

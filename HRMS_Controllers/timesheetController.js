const { sql, poolPromise } = require('../config/db');
const {
    validatePaginationParams,
    buildPaginationMetadata,
    formatPaginatedResponse
} = require('../utils/paginationHelper');

const MAX_FUTURE_DAYS = 15;

// Helper to validate entry date
const validateEntryDate = (dateString, res) => {
    const entryDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    entryDate.setHours(0, 0, 0, 0);

    const maxAllowedDate = new Date(today);
    maxAllowedDate.setDate(today.getDate() + MAX_FUTURE_DAYS);

    if (entryDate > maxAllowedDate) {
        res.status(400).json({ error: `Timesheet entry cannot be more than ${MAX_FUTURE_DAYS} days in the future.` });
        return false;
    }
    return true;
};

/* ================================
   CREATE TIMESHEET ENTRY
================================ */
exports.createTimesheetEntry = async (req, res) => {
    try {
        const {
            ProjectID,
            EmployeeID,
            Date,
            TotalHours,
            TaskID,
            Task,
            Comment,
            Status,
            CreatedBy,
            Cateogary,
            ManagerComment
        } = req.body;

        if (!ProjectID || !EmployeeID || !Date || !TotalHours || !Status || !CreatedBy || !Cateogary) {
            return res.status(400).json({
                error: 'Missing required fields'
            });
        }

        if (!validateEntryDate(Date, res)) {
            return; // Exit if date is invalid
        }

        const pool = await poolPromise;

        await pool.request()
            .input('ProjectID', sql.Int, ProjectID)
            .input('EmployeeID', sql.Int, EmployeeID)
            .input('Date', sql.Date, Date)
            .input('TotalHours', sql.Decimal(4, 2), TotalHours)
            .input('TaskID', sql.NVarChar(255), TaskID || null)
            .input('Task', sql.NVarChar(255), Task || null)
            .input('Comment', sql.NVarChar(500), Comment || null)
            .input('Status', sql.NVarChar(50), Status)
            .input('CreatedBy', sql.NVarChar(50), CreatedBy)
            .input('Cateogary', sql.NVarChar(100), Cateogary)
            .input('ManagerComment', sql.NVarChar(500), ManagerComment || null)
            .query(`
                INSERT INTO HRMS_TimesheetEntries
                (ProjectID, EmployeeID, Date, TotalHours, TaskID, Task, Comment,
                 Status, CreatedBy, Cateogary, ManagerComment)
                VALUES
                (@ProjectID, @EmployeeID, @Date, @TotalHours, @TaskID, @Task,
                 @Comment, @Status, @CreatedBy, @Cateogary, @ManagerComment)
            `);

        res.json({ success: true });
    } catch (err) {
        console.error('Create Timesheet Error:', err);
        res.status(500).json({ error: 'Failed to create timesheet entry' });
    }
};

/* ================================
   GET TIMESHEETS (PAGINATED)
================================ */
exports.getTimesheetEntriesByEmployee = async (req, res) => {
    try {
        /* 🔹 Pagination from BODY */
        const page = parseInt(req.body.page) || 1;
        const limit = Math.min(parseInt(req.body.limit) || 10, 50);

        /* 🔹 Filters from BODY */
        const { EmployeeID, EmployeeIDs, month, year } = req.body;

        const { pageNum, limitNum, offset } =
            validatePaginationParams(page, limit);

        let whereClause = '';
        const params = [];

        /* 🔹 Employee Filter */
        if (Array.isArray(EmployeeIDs) && EmployeeIDs.length > 0) {
            const ids = EmployeeIDs.map((_, i) => `@EmpID${i}`).join(',');
            whereClause = `WHERE t.EmployeeID IN (${ids})`;
            EmployeeIDs.forEach((id, i) =>
                params.push({ name: `EmpID${i}`, type: sql.Int, value: id })
            );
        } else if (EmployeeID) {
            whereClause = `WHERE t.EmployeeID = @EmployeeID`;
            params.push({ name: 'EmployeeID', type: sql.Int, value: EmployeeID });
        }

        /* 🔹 Month / Year Filter (INDEX SAFE) */
        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 1);

            whereClause += whereClause ? ' AND ' : ' WHERE ';
            whereClause += 't.Date >= @startDate AND t.Date < @endDate';

            params.push(
                { name: 'startDate', type: sql.Date, value: startDate },
                { name: 'endDate', type: sql.Date, value: endDate }
            );
        }

        const pool = await poolPromise;

        /* 🔹 COUNT QUERY (SEPARATE REQUEST) */
        const countRequest = pool.request();
        params.forEach(p =>
            countRequest.input(p.name, p.type, p.value)
        );

        const countResult = await countRequest.query(`
            SELECT COUNT(*) AS totalCount
            FROM HRMS_TimesheetEntries t
            ${whereClause}
        `);

        const totalCount = countResult.recordset[0].totalCount;

        /* 🔹 DATA QUERY (SEPARATE REQUEST) */
        const dataRequest = pool.request();
        params.forEach(p =>
            dataRequest.input(p.name, p.type, p.value)
        );

        dataRequest
            .input('offset', sql.Int, offset)
            .input('limit', sql.Int, limitNum);

        const dataResult = await dataRequest.query(`
            SELECT
                t.*,
                p.ProjectsName,
                u.username
            FROM HRMS_TimesheetEntries t
            LEFT JOIN HRMS_Projects p ON t.ProjectID = p.ProjectsId
            LEFT JOIN HRMS_users u ON t.EmployeeID = u.EmployeeID
            ${whereClause}
            ORDER BY t.Date DESC, t.EntryID DESC
            OFFSET @offset ROWS
            FETCH NEXT @limit ROWS ONLY
        `);

        const pagination =
            buildPaginationMetadata(pageNum, limitNum, totalCount);

        res.json(
            formatPaginatedResponse(dataResult.recordset, pagination)
        );

    } catch (err) {
        console.error('Pagination Error:', err);
        res.status(500).json({ error: 'Failed to load timesheets' });
    }
};

/* ================================
   UPDATE TIMESHEET ENTRY
================================ */
exports.updateTimesheetEntry = async (req, res) => {
    try {
        const {
            EntryID,
            EmployeeID,
            ProjectID,
            Date,
            TotalHours,
            TaskID,
            Task,
            Comment,
            Status,
            ModifiedBy,
            Cateogary,
            ManagerComment
        } = req.body;

        if (!EntryID || !EmployeeID) {
            return res.status(400).json({ error: 'EntryID and EmployeeID required' });
        }

        if (!validateEntryDate(Date, res)) {
            return; // Exit if date is invalid
        }

        const pool = await poolPromise;

        const result = await pool.request()
            .input('EntryID', sql.Int, EntryID)
            .input('EmployeeID', sql.Int, EmployeeID)
            .input('ProjectID', sql.Int, ProjectID)
            .input('Date', sql.Date, Date)
            .input('TotalHours', sql.Decimal(4, 2), TotalHours)
            .input('TaskID', sql.NVarChar(255), TaskID || null)
            .input('Task', sql.NVarChar(255), Task || null)
            .input('Comment', sql.NVarChar(500), Comment || null)
            .input('Status', sql.NVarChar(50), Status)
            .input('ModifiedBy', sql.NVarChar(50), ModifiedBy || 'system')
            .input('Cateogary', sql.NVarChar(100), Cateogary || null)
            .input('ManagerComment', sql.NVarChar(500), ManagerComment || null)
            .query(`
                UPDATE HRMS_TimesheetEntries
                SET
                    ProjectID = @ProjectID,
                    Date = @Date,
                    TotalHours = @TotalHours,
                    TaskID = @TaskID,
                    Task = @Task,
                    Comment = @Comment,
                    Status = @Status,
                    ModifiedBy = @ModifiedBy,
                    ModifiedDate = GETDATE(),
                    Cateogary = @Cateogary,
                    ManagerComment = @ManagerComment
                WHERE EntryID = @EntryID
                  AND EmployeeID = @EmployeeID
            `);

        if (!result.rowsAffected[0]) {
            return res.status(404).json({ error: 'Entry not found' });
        }

        res.json({ success: true });
    } catch (err) {
        console.error('Update Error:', err);
        res.status(500).json({ error: 'Failed to update timesheet' });
    }
};

/* ================================
   DELETE TIMESHEET ENTRY
================================ */
exports.deleteTimesheetEntry = async (req, res) => {
    try {
        const { EntryID, EmployeeID, Status } = req.body;

        if (!EntryID || !EmployeeID || !Status) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const pool = await poolPromise;

        const result = await pool.request()
            .input('EntryID', sql.Int, EntryID)
            .input('EmployeeID', sql.Int, EmployeeID)
            .input('Status', sql.NVarChar(50), Status)
            .query(`
                DELETE FROM HRMS_TimesheetEntries
                WHERE EntryID = @EntryID
                  AND EmployeeID = @EmployeeID
                  AND Status = @Status
            `);

        if (!result.rowsAffected[0]) {
            return res.status(404).json({ error: 'Entry not found or locked' });
        }

        res.json({ success: true });
    } catch (err) {
        console.error('Delete Error:', err);
        res.status(500).json({ error: 'Failed to delete entry' });
    }
};
